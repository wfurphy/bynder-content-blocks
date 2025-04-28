import { CWBlocks } from './lib/cwblocks.js';

try {
  /**
   * Set up the CW Blocks instance and authenticate with environment variables
   * @see {@link https://github.com/wfurphy/bynder-content-blocks}
   */
  const cb = new CWBlocks(
    process.env.EMAIL,    //::> Email address
    process.env.API_KEY   //::> API Key
  );

  /**
   * Create new item with the matching fields populated from Content Blocks
   * CONFIG variables can be replaced with unique values here. Repeat for each item.
   * @see {@link CWBlocks.createItem}
   * @see {@link CWBlocks.CONFIG}
   */
  const output = await cb.createItem(
    cb.getUniqueItemName(),              //::> Item Name
    CWBlocks.CONFIG.TEMPLATES.PRODUCT,   //::> Template ID
    CWBlocks.CONFIG.GROUPS.PRODUCT_ONE,  //::> Master Template Group Name (Optional)
  );

  console.log('::BynderContentBlocks::| Item Created |::>', output);

} catch (error) {
  console.error('::BynderContentBlocks::| ERROR |::>', error);
}
