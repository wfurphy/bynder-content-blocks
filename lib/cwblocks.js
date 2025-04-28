import axios from 'axios';
import { decode } from 'html-entities';
import { Item } from './item.js';
import { CBCWConfig } from '../config.js';

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
      baseURL: CWBlocks.CONFIG.BASE_URL,
      headers: {
        Authorization: `Basic ${auth64}`,
        'content-type': 'application/json',
        Accept: 'application/vnd.gathercontent.v2+json',
      },
    });
  }

  /**
   * Generates a unique Item name with timestamp
   * @param {string} [name] - Optional name to use instead of the default CWBlocks.CONFIG.ITEM_NAME
   * @returns {string} Item name with current timestamp
   */
  getUniqueItemName(name) {
    return `${name ?? CWBlocks.CONFIG.ITEM_NAME} ${new Date().getTime()}`;
  }

  /**
   * Get template information from Content Workflow
   * @param {Int} templateId The template ID to retrieve
   * @returns {Object} The template data
   * @throws Will throw an error if the template ID is not provided or if there's an error getting the template.
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
   * Get Content Block content from the master template and append it to an Item
   * @param {Item|string} [from='Content'] - Item instance or Group name to get content blocks from
   * @params {Int} [masterTemplateId=CWBlocks.CONFIG.TEMPLATES.MASTER] - The master Template ID
   * @throws Will throw an error if the master template or Item is not found
   * @returns {Object} - Content Block content in {field.label: value} format
   */
  async getContentBlocks(from = 'Content', masterTemplateId) {

    // Get the master template structure
    const master = await this.getTemplate(masterTemplateId ?? CWBlocks.CONFIG.TEMPLATES.MASTER);

    if (!master) {
      throw new Error(
        `Master Template: ${masterTemplateId} not found`
      );
    }

    const groupName = typeof from === 'string' ? from : from.masterGroup;

    // Get Group data
    const group = await master.related.structure.groups.find(
      (g) => g.name === groupName
    );

    if (!group) {
      throw new Error(`Group: ${groupName} not found`);
    }

    const content = {};
    let fieldData;

    // If fields is an Item instance
    if (from instanceof Item) {
      fieldData = await group.fields.filter((f) =>
        from.__fields.hasOwnProperty(f.label)
      );
    } else if (typeof from === 'string') {
      // Get Group fields if specified in a string
      fieldData = group.fields;
    } else {
      throw new Error('Item must be an instance of Item or a string');
    }

    if (fieldData.length) {
      await fieldData.forEach((field) => {
        content[field.label] = decode(field.instructions);
      });
    }

    if (from instanceof Item) {
      from.addContent(content);
    }

    return content;
  }

  /**
   * Create a new Item in Content Workflow with the matching fields populated from Content Blocks
   *
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
    const item = new Item(name, projectId, template, groupName);
    // Get the Content Block Content
    await this.getContentBlocks(item);
    // Add additional content if provided
    if (content) {
      item.addContent(content);
    }

    return this.create(item);
  }

  /**
   * Create a new Item in Content Workflow
   * @param {Item} item The item to create
   * @throws Will throw an error if item is not provided or not an instance of Item
   * @returns {Object} The response data from the API
   */
  async create(item) {
    if (!item || !(item instanceof Item)) {
      throw new Error('Item is required and must be an instance of Item');
    }

    // Create the item in Content Workflow
    const response = await this.api.post(
      `/projects/${item.projectId}/items`,
      item.toApi()
    );

    if (response.status !== 201) {
      throw new Error(
        `Error creating item: ${response.error} (${response.code})`
      );
    }

    return response.data.data;
  }
}
