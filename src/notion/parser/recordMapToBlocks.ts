import * as _ from 'lodash';
import { Json, NotionPageText, NotionPageBlock } from '../../types/notion';

export type NotionTextAttributes = string[][];

export type NotionText = [string, NotionTextAttributes?][];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MyObj = Record<string, any>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseNotionText(text: NotionText): NotionPageText[] {
  const result: NotionPageText[] = [];
  text.forEach(([str, att]) => {
    const item: NotionPageText = {
      text: str,
      atts: [],
    };
    if (att) {
      att.forEach(([attName, ...rest]) => {
        item.atts.push({
          att: attName,
          value: rest && rest[0],
        });
      });
    }
    result.push(item);
  });
  return result;
}

function recordToBlock(value: Json): NotionPageBlock | null {
  const block: NotionPageBlock = {
    type: value.type as string,
    blockId: value.id as string,
    properties: [],
    attributes: [],
    blockIds: [],
  };
  const properties: MyObj = (value.properties as object) || {};
  Object.keys(properties).forEach(propName => {
    block.properties.push({
      propName,
      value: parseNotionText(properties[propName] as NotionText),
    });
  });
  ((value.content as []) || []).forEach(id => block.blockIds.push(id));

  // extra attributes to grab for images
  if (block.type === 'image') {
    block.attributes.push({
      att: 'width',
      value: _.get(block, 'format.block_width', '-1'),
    });
    block.attributes.push({
      att: 'width',
      value: _.get(block, 'format.block_aspect_ratio', '-1'),
    });
  }
  return block;
}

export default function recordMapToBlocks(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordMap: any,
  blocks: NotionPageBlock[],
): NotionPageBlock[] {
  Object.keys(recordMap.block).forEach(key => {
    const block = recordToBlock(recordMap.block[key].value as Json);
    if (block) {
      blocks.push(block);
    }
  });
  return blocks;
}
