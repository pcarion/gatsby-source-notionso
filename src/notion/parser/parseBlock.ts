import * as _ from 'lodash';
import { Reporter } from 'gatsby';

import {
  Json,
  NotionTextParsed,
  BlockCode,
  BlockPage,
  BlockImage,
  BlockData,
  BlockDescription,
  BlockText,
} from '../../types/notion';
import parseNotionText from './parseNotionText';
import notionTextParsedToString from './notionTextParsedToString';

function getFieldAsString(
  block: Json,
  propName: string,
  reporter: Reporter,
): string {
  const value = _.get(block, propName, null);
  if (value === null) {
    reporter.error(
      `missing property: ${propName} in ${JSON.stringify(block, null, '')}`,
    );
    throw new Error('invalid block definition');
  }
  return `${value}`;
}

// generic type for block content parser
type BlockContentParser = (properties: Json, reporter: Reporter) => BlockData;

function parseNotiontext(title: []): NotionTextParsed {
  return parseNotionText(title);
}

function parseText(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const result: BlockText = {
    kind: 'text',
    text: parseNotiontext(title as []),
  };
  return result;
}

function parseCode(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const language = (properties && properties.language) || [];
  const result: BlockCode = {
    kind: 'code',
    code: parseNotiontext(title as []),
    language: parseNotiontext(language as []),
  };
  return result;
}

function parseImage(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const source = (properties && properties.source) || [];
  const result: BlockImage = {
    kind: 'image',
    sourceUrl: notionTextParsedToString(parseNotiontext(source as [])),
    width: _.get(block, 'format.block_width', -1) as number,
    aspectRatio: _.get(block, 'format.block_aspect_ratio', -1) as number,
  };
  console.log('@@@@ image:', result);
  return result;
}

function parsePage(block: Json, reporter: Reporter): BlockData {
  const properties = block.properties as Json;
  const title = properties && properties.title;
  if (!title) {
    reporter.error('missing title property for page text block');
    throw new Error('parsing error');
  }
  const result: BlockPage = {
    kind: 'page',
    title: parseNotiontext(title as []),
    pageId: block.id as string,
    contentIds: [],
  };
  ((block && (block.content as [])) || []).forEach(id =>
    result.contentIds.push(id),
  );
  return result;
}

function unknowknBlockParser(type: string): BlockContentParser {
  return (_block: Json, _reporter: Reporter): BlockData => ({
    kind: 'unknown',
    blockType: type,
  });
}

const contentParserByTypes: Record<string, BlockContentParser | null> = {
  text: parseText,
  code: parseCode,
  image: parseImage,
  page: parsePage,
};

export default function parseBlock(
  block: Json,
  reporter: Reporter,
): BlockDescription {
  const type = getFieldAsString(block, 'type', reporter);
  const parser = contentParserByTypes[type] || unknowknBlockParser(type);

  const result: BlockDescription = {
    id: getFieldAsString(block, 'id', reporter),
    version: getFieldAsString(block, 'version', reporter),
    createdTime: getFieldAsString(block, 'created_time', reporter),
    lastEditedTime: getFieldAsString(block, 'last_edited_time', reporter),
    content: parser(block, reporter),
  };
  return result;
}
