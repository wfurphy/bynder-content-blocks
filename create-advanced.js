import { CWBlocks } from './lib/cwblocks.js';
import { Item } from './lib/item.js';

try {
  // Set up the CW Blocks instance and authenticate with environment variables
  const cb = new CWBlocks(process.env.EMAIL, process.env.API_KEY);

  /**
   * Below is an advanced example of creating an item with content blocks.
   * This is useful if you want to create multiple items from different projects or with content from different master templates.
   * @see {@link CWBlocks.getTemplate}
   * @see {@link CWBlocks.getContentBlocks}
   * @see {@link CWBlocks.create}
   * @see {@link Item}
   * */
  // Create template object from template ID
  const template = await cb.getTemplate(CWBlocks.CONFIG.TEMPLATES.PRODUCT);
  // Create a new Item
  const item = new Item(
    'The Product Name',                  //::> Item Name
    CWBlocks.CONFIG.PROJECT_ID,          //::> Project ID
    template,                            //::> Template object created from the above
    CWBlocks.CONFIG.GROUPS.PRODUCT_TWO,  //::> Master Template Group Name (Optional)
  );
  // include the masterTemplateId when getting the content blocks
  await cb.getContentBlocks(item, 3263673);
  const outputAdv = await cb.create(item);

  console.log('::| BynderContentBlocks Advanced |::::>', outputAdv);

} catch (error) {
  console.error('::| BynderContentBlocks |::ERROR::>', error.message);
}




