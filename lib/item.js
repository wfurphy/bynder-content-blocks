/**
 * Represents an item with associated content and template information
 */
export class Item {
  /** @type {Object.<string, string>} Map of field labels to UUIDs */
  __fields = {};

    /** @type {Object.<string, *>} Content values mapped by field label */
  __content = {};

  /** @type {Object.<string, *>} Content values mapped by field UUID */
  content = {};

  /**
   * Creates a new Item instance
   * @param {string} name - The name of the item
   * @param {string} projectId - The Content Workflow Project ID
   * @param {Object} template - The Template object from Content Workflow API {@link CWBlocks.getTemplate}
   * @param {string} [masterGroup='Content'] - The Group Name in the master Template to get Content Blocks from (eg. Product Type)
   * @param {Object} [content] - Optional additional content for the Item
   */
  constructor(name, projectId, template, masterGroup = 'Content', content) {
    this.name = name;
    this.projectId = projectId;
    this.templateId = template.data.id;
    this.masterGroup = masterGroup;
    const groups = template.related.structure.groups;

    groups.forEach((g) => {
      g.fields.forEach((f) => {
        this.__fields[f.label] = f.uuid;
      });
    });

    if (content) {
      this.addContent(content);
    }
  }

  /**
   * Makes the content object with the current content values
   * @returns {Item} The item instance for chaining
   */
  makeContent() {
    for (const [key, value] of Object.entries(this.__content)) {
      this.content[this.__fields[key]] = value;
    }

    return this;
  }

  /**
   * Adds content to the Item. Only keeps fields which exist in Template.
   * @param {Object} content - Object of content in key value pairs { field.label: value }
   * @returns {Item} The item instance for chaining
   */
  addContent(content) {
    for (const [key, value] of Object.entries(content)) {
      if (this.__fields.hasOwnProperty(key)) {
        this.__content[key] = value;
      }
    }

    return this.makeContent();
  }

  /**
   * Sets a single content value
   * @param {string} key - The content field key
   * @param {*} value - The value to set
   * @returns {Item} The item instance for chaining
   */
  set(key, value) {
    if (this.__fields.hasOwnProperty(key)) {
      this.__content[key] = value;
    }

    return this.makeContent();
  }

  /**
   * Gets content value(s) from label
   * @param {string|string[]} [label] - The content field labels(s) to get
   * @returns {*|*[]|undefined} The requested content value(s)
   */
  get(label) {
    if (Array.isArray(label)) {
      return label.map((k) => this.get(k));
    } else if (typeof label === 'string' && this.__fields.hasOwnProperty(label)) {
      return this.__content[label];
    }

    return undefined;
  }

  /**
   * Converts the item to an API-friendly format
   * @returns {Object} API representation of the item
   */
  toApi() {
    return {
      name: this.name,
      project_id: this.projectId,
      template_id: this.templateId,
      content: this.makeContent().content,
    };
  }

  /**
   * Converts the item to a JSON string
   * @returns {string} JSON string representation of the item
   */
  toJson() {
    return JSON.stringify(this.toApi());
  }
}
