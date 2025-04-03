
# Content Blocks for Content Workflow by Bynder

This NodeJS sample application shows how you can to use **guidelines** fields in a master **Template** as predefined Content Blocks to populate editable **text** fields in a new content **Items**.

For example, you could create master product description snippets for use in your eCommerce platform for certain product categories. You could then create an integration, which triggers when a new product is created in your PIM (Product Information Management) or similar solution, to create an Item in Content Workflow for the product page that will be published to your eCommerce platform. The Item can have the Product Description field already populated with sample content for that product type from your Content Block master Template. This would give the content writer a head start and structure when creating the content and allow the admin to manage the master content, all without leaving Content Workflow.

_I have built this example for a customer who wishes to use raw HTML in the blocks and so it uses Guidelines fields populated with actual HTML code in the master template and then inserts it into the standard WYSIWYG text fields in the Item. You could use the standard WYSIWYG content (output as HTML in the API) from the Guidelines fields or if you wanted to use many field types you could apply the same concept but have a master content Item rather than a master Template._

> ### :warning: WARNING
>
> This is a proof of concept only. This code is not intended to be used in production and comes with no warranty or guarantee to work as described. There is no linting or tests included. Use this to test your concept and then build an integration that works for your use case and within your connected ecosystem.

## Content Workflow

> :raising_hand: When creating fields in the master Template the field labels should be unique to their Group (tab). Use unique field labels across all tabs in your other Templates.

### Master Template

Create a master Template in your Content Workflow Project. Create a **Guidelines** field for each piece of content you wish to use as a Content Block and label them with a unique name. You can create multiple **Groups** (Tabs) if you want to create variations of the content. Name them with unique, clear names. The field labels only need to be unique within their Group.

_In this example I created a template with a Group (Tab) for each product type and then **Guidelines** fields for each field I wanted to pre-populate in those Groups._

![example master Template in Content Workflow](/img/master-template-example.png)

> :raising_hand: Copy the `projectId` and the `templateId` from the URL when editing the template, you'll need to use them later. You need the numbers from the url at these locations:
> https://wave-us.gathercontent.com/projects/`{projectId}`/templates/`{templateId}`

### Templates

Create your Templates for the Items you'll be creating. If you want to populate a **Text** field with a Content Block ensure that it has the exact same label as the Guidelines field in the Master Template.

_In this template example the top two fields will match with my Content Blocks._

![example Template in Content Workflow](/img/product-template-example.png)

> :raising_hand: If you plan to use any template in your this sample app then don't forget to grab the `templateId` from the URL when editing the template.
> https://wave-us.gathercontent.com/projects/999999/templates/`{templateId}`

## Content Blocks Sample

### Perquisites

* Node.JS v20+
* NPM/Yarn

### Installation

1. Clone this repository:

```sh
git clone https://github.com/wfurphy/bynder-content-blocks.git
```

1. Navigate to the directory, install the dependencies and rename the `env.example` file to `.env`:

```sh
cd bynder-content-blocks && npm install && mv env.example .env
```

3. Edit the `.env` file and add your `EMAIL` and `API_KEY`.

  > :information_source: [How to get your API credentials](https://docs.gathercontent.com/reference/authentication).


```sh
EMAIL="sample@sample.com"
API_KEY="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx"
```

### Configuration

1. Add to `PROJECT_ID`, `MASTER_TEMPLATE_ID` and `ITEM_NAME` to your `.env` file.

```sh
PROJECT_ID=999999
MASTER_TEMPLATE_ID=9999999
ITEM_NAME="Test Item"
```

2. Optionally add your Templates and Groups to the constant objects `TEMPLATES` and `GROUPS` in `config.js`. These are helpers so you don't have to remember the exact names/id numbers or keep going back to reference them.

```js

  /**
   * Template IDs used for different content types
   * @type {Object}
   * @property {number} MASTER - ID for the master Template (.env: MASTER_TEMPLATE_ID)
   */
  TEMPLATES: {
    MASTER: process.env.MASTER_TEMPLATE_ID, // DO NOT REMOVE THIS ONE
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

```

Once added they can be accessed in `create.js` and any other file which imports `CWBlocks` as a static property using `CWBlocks.CONFIG.{TEMPLATES|GROUPS}.{NAME}`. For example:

```js
const productTemplateId = CWBlocks.CONFIG.TEMPLATES.PRODUCT
```

### Creating an Item

1. Modify the parameters in `create.js` to make your request:

```js
const response = await cb.createItem(
  CWBlocks.CONFIG.ITEM_NAME,           //::> Item Name
  CWBlocks.CONFIG.TEMPLATES.PRODUCT,   //::> Template ID
  CWBlocks.CONFIG.GROUPS.PRODUCT_ONE,  //::> Master Template Group Name (Optional)
);
```

If you don't want to use the helpers then you could use:

```js
const response = await cb.createItem(
  'The Content Item Name',           //::> Item Name
  999999,                            //::> Template ID
  'Product One',                     //::> Master Template Group Name (Optional)
);
```

2. Go back to the CLI and run:

   ```sh
   npm run start
   ```

3. If you see a positive response object in the CLI then you should be able to find your new Item in your Content Workflow Project with the matching Text fields populated from your Content Blocks.

## Resources

* [Content Workflow API Docs](https://docs.gathercontent.com/reference/introduction)
* [Bynder Knowledge Base](https://support.bynder.com/)

## Contributing

This was rolled out quickly as a POC, there are probably some bugs in the code and there are almost certainly better ways to do this. The intention is to show what can be achieved. Please raise issues or make PRs and I'll do my best to fix anything as it comes up.

## Disclaimer

I am a Solutions Engineer at Bynder. However this POC, the concepts shared in this repository and it's contents and are not officially supported or verified by Bynder.
