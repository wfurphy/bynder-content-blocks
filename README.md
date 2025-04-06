
# Content Blocks for Content Workflow by Bynder

This NodeJS sample application is intended as middleware between any application in a MarTech ecosystem and Bynder's Content Workflow. It shows how to use **guidelines** fields in a master **Template** as predefined **Content Blocks** to populate editable **text** fields in a new content **Items**.

> ### :warning: WARNING
>
> This is a proof of concept only. This code is not intended to be used in production and comes with no warranty or guarantee to work as described. There is no linting or tests included. Use this to validate your concept and then build an integration that works for your use case and within your connected ecosystem.

## Concept

You're a software engineer for an online retailer using Content Workflow to manage the content for your eCommerce platform. You could create a Master Template and allow your marketing team to add product descriptions for multiple product categories. You could then trigger your middleware when a new product is created in your Product Information Management (PIM) solution or similar. Your middleware would create an Item in Content Workflow for the product page, from an existing Template, containing all of the product information fields. The Item created can have the product description and any other fields already populated with sample content from those masters. This would provide your marketing team full control of the master content and give the content editor a head start and structure when creating the content all in Content Workflow. Once the workflow is completed you would be able to use a webhook to get the final, approved content and push it back to the PIM or directly to your eCommerce platform already in HTML ready to publish.

_I have built this example for a customer who wishes to use raw HTML in the blocks and so it uses guidelines fields populated with actual HTML code in the master template. It then decodes and inserts it into the standard WYSIWYG text fields in the Item. You could use the standard WYSIWYG content (output as HTML in the API) from the guidelines fields or if you wanted to use many field types, or run through an approval workflow first for your master content, you could apply the same concept but have a master content Item rather than a master Template._

## Process Flow

![Content Blocks process flow](/img/cbcw-flow.svg)

## Content Workflow Preparation

> :raising_hand: When creating fields in the master Template the field labels should be unique to their Group (tab). Use unique field labels across all tabs in your other Templates.

### Master Template

Create a master Template in your Content Workflow project. Create a **guidelines** field for each piece of content you wish to use as a **Content Block** and label them with a unique name. You can create multiple **Groups** (tabs) if you want to create variations of the content. Name them with unique, clear names. The field labels only need to be unique within their Group.

_In this example I created a template with a Group (tab) for each product category and then **guidelines** fields for each field I wanted to pre-populate in those Groups. Two of the fields are populated with raw HTML code to give strict control over what HTML is used but the third is using the standard WYSIWYG content which will output as HTML but gives a better experience for the user._

![example master Template in Content Workflow](/img/master-template-example.png)

> :raising_hand: Copy the `projectId` and the `templateId` from the URL when editing the template, you'll need to use them later when configuring the middleware. You need the numbers from the url at these locations:
> `https://your.gathercontent.com/projects/{projectId}/templates/{templateId}`

### Templates

Create your Templates for the Items you'll be creating. If you want to populate a **text** field with a Content Block ensure that it has the exact same label as the Guidelines field in the Master Template.

_In this template example the top two fields will match with my Content Blocks._

![example Template in Content Workflow](/img/product-template-example.png)

> :raising_hand: If you plan to use any template in your middleware then don't forget to grab the `templateId` from the URL when editing the template.
> `https://your.gathercontent.com/projects/999999/templates/{templateId}`

## Content Blocks Sample Middleware

### Perquisites

* NodeJS v20+
* NPM/Yarn

### Installation

1. Clone this repository:

   ```sh
   git clone https://github.com/wfurphy/bynder-content-blocks.git
   ```

2. Navigate to the directory, install the dependencies and rename the `env.example` file to `.env`:

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
   console.log(CWBlocks.CONFIG.TEMPLATES.PRODUCT);
   // 3240083
   ```

### Creating an Item

1. Modify the parameters in `create.js` to suit your needs:

   ```js
   const response = await cb.createItem(
     CWBlocks.CONFIG.ITEM_NAME,           //::> Item Name
     CWBlocks.CONFIG.TEMPLATES.PRODUCT,   //::> Template ID
     CWBlocks.CONFIG.GROUPS.PRODUCT_ONE,  //::> Master Template Group Name (Optional)
   );
   ```

   If you don't want to use the constant helpers then this may look like:

   ```js
   const response = await cb.createItem(
     'The Content Item Name',           //::> Item Name
     999999,                            //::> Template ID
     'Product One',                     //::> Master Template Group Name (Optional)
   );
   ```

   You call `createItem()` as many times as you need to create more Items for the same project.

   > :raising_hand: If you need, you could modify the code so you can specify the `projectId` and `masterTemplateId` each call rather than have them set at the app level.

2. Go back to the CLI and run:

   ```sh
   npm run start
   ```

3. If you see a positive response object in the CLI then you should be able to find your new Item in your Content Workflow project with the matching text fields populated from your Content Blocks. And that's it, you created **Content Blocks** that can be managed in Content Workflow and created a new content Item pre-populated with editable sample content.

   ![New Item with Blocks populated](/img/new-item.png)

4. Now you can expand on this concept to fit your use case and automate more of your content operations. Enjoy.

## Resources

* [Content Workflow API Docs](https://docs.gathercontent.com/reference/introduction)
* [Bynder Knowledge Base](https://support.bynder.com/)

## Contributing

This was rolled out quickly as a POC, there are probably some bugs in the code and there are almost certainly more effective and efficient ways to achieve the result. The intention is to show what can be achieved. That said, I want it to be as accurate as possible so that others can get value from it so please raise issues or make PRs and I'll do my best to address anything as it comes up.

## Disclaimer

I work as a Solutions Engineer at Bynder. However, this POC, the concepts in this repository, the code and other contents are NOT officially endorsed, supported or verified by Bynder.
