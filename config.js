import 'dotenv/config';

/**
 * CBCWConfig
 * Configuration for Bynder Content Blocks
 * @type {Object}
 * @property {Object} AUTH - Authentication foe Content Workflow API {@link AUTH}
 * @property {string} AUTH.EMAIL - Content Workflow Email (.env: EMAIL)
 * @property {string} AUTH.API_KEY - Content Workflow API Key (.env: API_KEY)
 * @property {number} PROJECT_ID - Content Workflow Project ID (.env: PROJECT_ID)
 * @property {Function|string} ITEM_NAME - Generates unique test item name with timestamp (.env: ITEM_NAME) {@link ITEM_NAME}
 * @property {Object} TEMPLATES - Template IDs used for different content types {@link TEMPLATES}
 * @property {number} TEMPLATES.MASTER - The master template ID (.env: MASTER_TEMPLATE_ID)
 * @property {Object} GROUPS - Group names used for different product types {@link GROUPS}
 */
export const CBCWConfig = {
  /**
   * Authentication configuration (Default from .env)
   * @type {Object}
   * @property {string} EMAIL - Email address for authentication
   * @property {string} API_KEY - API key for authentication
   * @see {@link https://docs.gathercontent.com/reference/authentication}
   */
  AUTH: {
    EMAIL: process.env.EMAIL,
    API_KEY: process.env.API_KEY,
  },

  /**
   * Project ID
   * @type {number}
   */
  PROJECT_ID: Number(process.env.PROJECT_ID),

  /**
   * Generates a unique test item name with timestamp (uses env: ITEM_NAME)
   * @returns {string} Test item name with current timestamp
   */
  ITEM_NAME: (() => `${process.env.ITEM_NAME ?? 'Test Item'} ${new Date().getTime()}`)(),
  // ITEM_NAME: process.env.ITEM_NAME ?? 'Test Item', // Can uncomment and replace above with a static name

  /**
   * Template IDs used for different content types
   * @type {Object}
   * @property {number} MASTER - ID for the master Template (.env: MASTER_TEMPLATE_ID)
   */
  TEMPLATES: {
    MASTER: Number(process.env.MASTER_TEMPLATE_ID), // KEEP THIS ONE AND ADD TO .env
    PRODUCT: 3240083, // @TODO REPLACE WITH YOURS
    // ADD MORE HERE
  },

  /**
   * Available Groups (add one for every Group (tab) to ensure the name matches exactly)
   * @type {Object}
   * @property {string} [PRODUCT_ONE] - A key Value Pair where the Value is the exact name of the group (tab) in the Master Template
   */
  GROUPS: {
    PRODUCT_ONE: 'Product One', // @TODO REPLACE WITH YOURS
    PRODUCT_TWO: 'Product Two', // @TODO REPLACE WITH YOURS
    // ADD MORE HERE
  },
}
