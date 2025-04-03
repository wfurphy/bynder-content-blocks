import axios from 'axios';
import { decode } from 'html-entities';
import { Item } from './item.js';
import { CBCWConfig } from '../config.js';
import 'dotenv/config';

/**
 * CW Class
 * This class provides methods to interact with the Content Workflow API.
 * It allows you to get template information, create items, and retrieve HTML snippets.
 */
export class CWBlocks {

  /**
   * The configuration object
   * @type {CBCWConfig}
   * @see {@link CBCWConfig}
   */
  static CONFIG = CBCWConfig;

  /**
   * Base URL for the Content Workflow API
   * @type {string}
   */
  baseURL = process.env.BASE_URL ?? 'https://api.gathercontent.com';

  /**
   * Create a new instance of the CW class
   * @param {string} email Authentication email
   * @param {string} apiKey Authentication API key
   * @description Initializes the CW class with the provided email and API key.
   * @throws Will throw an error if email or apiKey is not provided.
   */
  constructor(email, apiKey) {
    if (!email || !apiKey) {
      throw new Error('Email and API Key are required');
    }

    const auth64 = Buffer.from(`${email}:${apiKey}`).toString('base64');

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        Authorization: `Basic ${auth64}`,
        'content-type': 'application/json',
        Accept: 'application/vnd.gathercontent.v2+json',
      },
    });
  }

  /**
   * Get template information from Content Workflow
   * @param {Int} templateId
   * @returns {Object} Template information including structure
   */
  async getTemplate(templateId) {
    if (!templateId) {
      throw new Error('Template ID is required');
    }

    const response = await this.api.get(`/templates/${templateId}`);

    if (response.status !== 200) {
      throw new Error(`Error getting template: ${response.status}`);
    }

    return response.data;
  }

  /**
   * Get field data with decoded HTML appended in the `html` property
   * @param {string} [groupName='Content'] The Product Type {@link GROUPS}
   * @param {string|string[]} [fields] Field name or array of field names to get HTML for. If not provided, all fields from the product type will be returned.
   *
   * @returns {Object|Object[]} An object or array of objects containing field properties. HTML snippet is in the html property of each field object ({}.html)
   */
  async getContent(groupName = 'Content', fields) {
    // Get the master template structure
    const master = await this.getTemplate(CWBlocks.CONFIG.TEMPLATES.MASTER);

    if (!master) {
      throw new Error(`Master Template: ${CWBlocks.CONFIG.TEMPLATES.MASTER} not found`);
    }

    // Get Group data
    const group = await master.related.structure.groups.find(
      (g) => g.name === groupName
    );

    if (!group) {
      throw new Error(`Group: ${groupName} not found`);
    }

    const content = {};
    let fieldData;

    // Get field if specified in a string
    if (fields && typeof fields === 'string') {
      const fieldData = await group.fields.find((f) => f.label === fields);

      if (fieldData) {
        content[fieldData.label] = decode(fieldData.instructions);
      }
    // or fields if an array was provided
    } else if (fields && Array.isArray(fields)) {
      fieldData = await group.fields.filter((f) => fields.includes(f.label));
    // Otherwise return all fields
    } else {
      fieldData = group.fields;
    }

    if (fieldData.length) {
      fieldData.forEach((field) => {
        content[field.label] = decode(field.instructions);
      });
    }

    // Otherwise return the whole group of fields;
    return content;
  }

  /**
   * Create a new Item in Content Workflow with the matching fields populated from Content Blocks
   * @param {string} name The name of the item to create {@link CONFIG.ITEM_NAME}
   * @param {Int} templateId Template ID of the Template to use when creating this Item
   * @param {string} [groupName] The Group name to match in the master Template (eg. Product Type)
   * @param {Object} [content={}] Additional content to populate the item with { 'field.label': value }. Matching fields will override Content Blocks.
   * @throws Will throw an error if name or templateId are not provided.
   * @returns {Object} The response data from the API
   */
  async createItem(name, templateId, groupName, content = {}) {
    const projectId = CWBlocks.CONFIG.PROJECT_ID;
    if (!projectId || !name || !templateId) {
      throw new Error('Project ID, Name and Template ID are required');
    }

    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Create the Item
    const item = await new Item(name, projectId, template, groupName);
    // Get the Content Block Content
    const blockContent = await this.getContent(groupName, Object.keys(item.__fields));
    // Add the combined content to the item
    item.addContent({...blockContent, ...content});
    // Create the item in Content Workflow
    const response = await this.api.post(`/projects/${projectId}/items`, item.toApi());

    if (response.status !== 201) {
      throw new Error(`Error creating item: ${response.error} (${response.code})`);
    }

    // return {item, response: response.data.data};
    return response.data.data;
  }
}
