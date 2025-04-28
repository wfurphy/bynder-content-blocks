import { CWBlocks } from './lib/cwblocks.js';
import { Item } from './lib/item.js';

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
   * Below is an advanced example of creating an item with content blocks.
   * This is useful if you want to create multiple items from different projects or with content from different master templates.
   * @see {@link CWBlocks.getTemplate}
   * @see {@link CWBlocks.getContentBlocks}
   * @see {@link CWBlocks.create}
   * @see {@link Item}
   * */
  // Create Template object from any Template ID
  const template = await cb.getTemplate(3240083); //::> Template ID
  // Create a new Item
  const item = new Item(
    cb.getUniqueItemName('The Product Name'),  //::> Item Name
    393102,                                    //::> Project ID
    template,                                  //::> Template object (created above)
    'Product Two',                             //::> Master Template Group name (Optional)
  );
  // Include the Master Template ID when getting the content blocks
  await cb.getContentBlocks(item, 3263673); //::> Master Template ID
  // Create the item in Content Workflow
  const outputAdv = await cb.create(item);

  console.log('::BynderContentBlocks::| Advanced Item Created |::>', outputAdv);

} catch (error) {
  console.error('::BynderContentBlocks::| ERROR |::>', error);
}




