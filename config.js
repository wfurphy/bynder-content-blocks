import 'dotenv/config';

/**
 * CBCWConfig
 * Configuration for Bynder Content Blocks
 * @type {Object}
 * @property {string} BASE_URL - Base URL for Content Workflow API (default: https://api.gathercontent.com) {@link BASE_URL}
 * @property {number} PROJECT_ID - Content Workflow Project ID (.env: PROJECT_ID)
 * @property {string} ITEM_NAME - The name of the Item to be created (.env: ITEM_NAME) {@link ITEM_NAME}
 * @property {Object} TEMPLATES - Template IDs used for different content types {@link TEMPLATES}
 * @property {number} TEMPLATES.MASTER - The master template ID (.env: MASTER_TEMPLATE_ID)
 * @property {Object} GROUPS - Group names used for different product types {@link GROUPS}
 * @method {Function} getUniqueItemName([name]) - Generates a unique name for the Item {@link getUniqueItemName}
 *
 * @see {@link https://docs.gathercontent.com/reference/getting-started}
 */
export const CBCWConfig = {
  /**
   * Base URL
   * @type {string} - Base URL for Content Workflow API (default: https://api.gathercontent.com)
   * @see {@link https://docs.gathercontent.com/reference/getting-started}
   */
  BASE_URL: encodeURI(process.env.BASE_URL ?? 'https://api.gathercontent.com'),

  /**
   * Project ID
   * @type {number} - Project ID for the GatherContent project
   */
  PROJECT_ID: Number(process.env.PROJECT_ID),

  /**
   * Item name
   * @type {string} - Name of the test item (env: ITEM_NAME, default: 'Test Item')
   * Used for creating a new item in the project and in ITEM_NAME_DT to create a unique name
   * @see {@link ITEM_NAME_DT}
   */
  ITEM_NAME: process.env.ITEM_NAME ?? 'Test Item',

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
