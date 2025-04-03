import { CWBlocks } from './lib/cwblocks.js';

// Set up the CW Blocks instance and authenticate with environment variables
const cb = new CWBlocks(process.env.EMAIL, process.env.API_KEY);

/**
 * Create new item with the matching fields populated from Content Blocks
 * CONFIG variables can be replaced with unique values here. Repeat for each item.
 * @see {@link CWBlocks.createItem}
 * @see {@link CWBlocks.CONFIG}
 */
const output = await cb.createItem(
  CWBlocks.CONFIG.ITEM_NAME,           //::> Item Name
  CWBlocks.CONFIG.TEMPLATES.PRODUCT,   //::> Template ID
  CWBlocks.CONFIG.GROUPS.PRODUCT_ONE,  //::> Master Template Group Name (Optional)
);

console.log('::| BynderContentBlocks |::::>', output);
