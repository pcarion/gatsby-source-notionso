import { NotionPageBlock, NotionPageText } from '../types/notion';

import { NotionRenderFuncs, NotionRenderChild } from './index';

import renderNotionText from './renderNotionText';
/*
[
 {
  "blockId": "718ddd99-2bec-4d47-917c-bb075a216340",
  "blockIds": [
   "746c125f-7f07-4950-980a-eeba2af3c626",
   "fa20c5d7-bd87-486d-a614-b7092fe0519e",
   "9349a8a9-1b95-4b34-801b-d8133894c745",
   "6edb653f-6aa2-46a3-87a7-db255e469eef",
   "3801f4ea-93be-4450-8d60-5a3636c4f7d1",
   "217033e6-876a-4a75-a82f-db85ac39523a",
   "646eefc4-b7b0-431e-a49d-bbc7632a5f68"
  ],
  "type": "page",
  "attributes": [
   {
    "att": "pageIcon",
    "value": "✒️"
   }
  ],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "test page",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "746c125f-7f07-4950-980a-eeba2af3c626",
  "blockIds": [],
  "type": "text",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "Let's ",
      "atts": []
     },
     {
      "text": "try",
      "atts": [
       {
        "att": "i",
        "value": null
       }
      ]
     },
     {
      "text": " from here!",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "fa20c5d7-bd87-486d-a614-b7092fe0519e",
  "blockIds": [],
  "type": "image",
  "attributes": [
   {
    "att": "width",
    "value": "2447"
   },
   {
    "att": "aspectRatio",
    "value": "0.6943195749897834"
   }
  ],
  "properties": [
   {
    "propName": "source",
    "value": [
     {
      "text": "https://s3-us-west-2.amazonaws.com/secure.notion-static.com/443cca18-4fd5-402e-aa6f-94815965a547/alphabet.png",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "9349a8a9-1b95-4b34-801b-d8133894c745",
  "blockIds": [],
  "type": "text",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "item 1",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "6edb653f-6aa2-46a3-87a7-db255e469eef",
  "blockIds": [],
  "type": "bulleted_list",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "list 1",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "3801f4ea-93be-4450-8d60-5a3636c4f7d1",
  "blockIds": [
   "40bf8eed-9cd1-4b07-b554-fff95ac7c61c",
   "4d095669-d559-4172-b991-9f390a14fe84"
  ],
  "type": "bulleted_list",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "list 2",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "40bf8eed-9cd1-4b07-b554-fff95ac7c61c",
  "blockIds": [],
  "type": "bulleted_list",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "list 2.1",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "4d095669-d559-4172-b991-9f390a14fe84",
  "blockIds": [],
  "type": "bulleted_list",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "list 2.2",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "217033e6-876a-4a75-a82f-db85ac39523a",
  "blockIds": [],
  "type": "bulleted_list",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "list 3",
      "atts": []
     }
    ]
   }
  ]
 },
 {
  "blockId": "646eefc4-b7b0-431e-a49d-bbc7632a5f68",
  "blockIds": [],
  "type": "text",
  "attributes": [],
  "properties": [
   {
    "propName": "title",
    "value": [
     {
      "text": "para",
      "atts": []
     }
    ]
   }
  ]
 }
]
*/

interface Block extends NotionPageBlock {
  _subBlocks: Block[];
}

function findTextProperty(block: Block, propName: string): NotionPageText[] {
  const prop = block.properties.find(p => p.propName === propName);
  if (!prop) {
    throw new Error(
      `cannot find prop: ${propName} on ${JSON.stringify(block)}`,
    );
  }
  return prop.value;
}

function findBlockById(
  id: string,
  blocks: NotionPageBlock[],
): NotionPageBlock | undefined {
  const block = blocks.find(b => b.blockId === id);
  return block;
}

function buildTree(block: NotionPageBlock, blocks: NotionPageBlock[]): Block {
  const root: Block = {
    ...block,
    _subBlocks: [],
  };
  block.blockIds.forEach(id => {
    const subBlock = findBlockById(id, blocks);
    if (!subBlock) {
      throw new Error(`missing block id: ${id}`);
    }
    root._subBlocks.push(buildTree(subBlock, blocks));
  });
  return root;
}

function renderBlocks(
  blocks: Block[],
  renderFuncs: NotionRenderFuncs,
  debug: boolean,
): NotionRenderChild[] {
  let blockType = '';
  const result: NotionRenderChild[] = [];
  const children: NotionRenderChild[][] = [];
  blocks.forEach(block => {
    if (block.type !== blockType) {
      if (blockType !== '') {
        const child = renderFuncs.renderBlock(blockType, children);
        result.push(child);
      }
      blockType = block.type;
      children.length = 0;
    }
    const texts: NotionPageText[] = findTextProperty(block, 'title');
    const blockChildren: NotionRenderChild[] = renderNotionText(
      texts,
      renderFuncs,
      debug,
    );
    if (block._subBlocks.length > 0) {
      const subs = renderBlocks(block._subBlocks, renderFuncs, debug);
      subs.forEach(s => blockChildren.push(s));
    }
    children.push(blockChildren);
  });
  // flush last block
  if (blockType !== '') {
    const child = renderFuncs.renderBlock(blockType, children);
    result.push(child);
  }
  return result;
}

export default function renderPageblocks(
  pageId: string,
  blocks: NotionPageBlock[],
  renderFuncs: NotionRenderFuncs,
  debug = false,
): NotionRenderChild[] {
  const pageBlock = findBlockById(pageId, blocks);
  if (!pageBlock) {
    throw new Error(`missing root block id: ${pageId}`);
  }
  // we build the tree of blocks
  const rootBlock = buildTree(pageBlock, blocks);
  return renderBlocks(rootBlock._subBlocks, renderFuncs, debug);
}
