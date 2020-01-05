import { NotionPageBlock, NotionPageText } from '../types/notion';

import { NotionRenderFuncs, NotionRenderChild, BlockMeta } from './index';

import renderNotionText from './renderNotionText';

import notionPageTextToString from '../notion/parser/notionPageTextToString';

interface Block extends NotionPageBlock {
  _subBlocks: Block[];
}

function getPropertiesAsDict(block: Block): Record<string, string> {
  const result: Record<string, string> = {};
  block.properties.forEach(p => {
    result[p.propName] = notionPageTextToString(p.value);
  });
  return result;
}

function getAttributesAsDict(block: Block): Record<string, string> {
  const result: Record<string, string> = {};
  block.attributes.forEach(a => {
    result[a.att] = a.value || '';
  });
  return result;
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

function hasProperty(block: Block, propName: string): boolean {
  const prop = block.properties.find(p => p.propName === propName);
  return !!prop;
}

function findBlockById(
  id: string,
  blocks: NotionPageBlock[],
): NotionPageBlock | undefined {
  const block = blocks.find(b => b.blockId === id);
  return block;
}

function isListItemsBlockType(type: string): boolean {
  return ['bulleted_list', 'numbered_list'].indexOf(type) >= 0;
}
function mkEmptyBlock(type: string): Block {
  return {
    type,
    blockId: '',
    attributes: [],
    properties: [],
    _subBlocks: [],
    blockIds: [],
  };
}
// iterate through the list and merge together
// blocks belonging to the same list
function mergeListBlocks(blocks: Block[]): Block[] {
  const result: Block[] = [];
  let mergingBlock: Block = mkEmptyBlock('');
  blocks.forEach(block => {
    const type = block.type;
    if (type === mergingBlock.type) {
      // we are in a list of items to be merged
      // we change the type of the subnode to 'item'
      block.type = `${type}__item`;
      mergingBlock._subBlocks.push(block);
      mergingBlock.blockIds.push(block.blockId);
    } else {
      // we are leaving the sequence of nodes to merge
      // we push that block if it had subblocks
      if (mergingBlock._subBlocks.length > 0) {
        result.push(mergingBlock);
      }
      if (isListItemsBlockType(type)) {
        // we change the type of the subnode to 'item'
        block.type = `${type}__item`;
        mergingBlock = mkEmptyBlock(type);
        mergingBlock.blockId = block.blockId;
        mergingBlock._subBlocks = [block];
        mergingBlock.blockIds = [block.blockId];
        mergingBlock.attributes = [];
        mergingBlock.properties = [];
      } else {
        mergingBlock = mkEmptyBlock('');
        // non list item block, we push it as is
        result.push(block);
      }
    }
  });
  // flush last block if needed
  if (mergingBlock._subBlocks.length > 0) {
    result.push(mergingBlock);
  }
  return result;
}

// for bulleted list, numbered list etc all the items
// are adjacents
// this function will create a parent node with _suBlocks containing
// the items of the list
function aggregateListTree(block: Block): Block {
  block._subBlocks = mergeListBlocks(block._subBlocks);
  block._subBlocks.forEach(b => aggregateListTree(b));
  return block;
}

// we store in _subBlocks all the blocks which were referenced in blockIds
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
  // we aggregate list items
  return aggregateListTree(root);
}

function renderBlocks(
  blocks: Block[],
  renderFuncs: NotionRenderFuncs,
  debug: boolean,
): NotionRenderChild[] {
  const result: NotionRenderChild[] = [];
  blocks.forEach(block => {
    // get meta information about block
    const blockChildren: NotionRenderChild[] = [];
    const meta: BlockMeta = {
      properties: getPropertiesAsDict(block),
      attributes: getAttributesAsDict(block),
    };
    let texts: NotionPageText[] = [];
    if (hasProperty(block, 'title')) {
      texts = findTextProperty(block, 'title');
    } else {
      // if no title property, we put an empty text
      texts = [
        {
          text: '',
          atts: [],
        },
      ];
    }
    blockChildren.push(renderNotionText(texts, renderFuncs, debug));
    const child = renderFuncs.renderBlock(block.type, meta, blockChildren);
    result.push(child);
  });
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
