import * as _ from 'lodash';
import { Reporter } from 'gatsby';

import {
  Json,
  BlockCode,
  BlockPage,
  BlockImage,
  BlockQuote,
  BlockData,
  BlockText,
  BlockDescription,
  BlockBulletedList,
} from '../../types/notion';
import parseNotionText from './parseNotionText';
import notionPageTextToString from './notionPageTextToString';

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

function parseBulletedList(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const result: BlockBulletedList = {
    kind: 'bulleted_list',
    text: parseNotionText(title as []),
  };
  return result;
}

function parseText(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const result: BlockText = {
    kind: 'text',
    text: parseNotionText(title as []),
  };
  return result;
}

function parseHeader(
  block: Json,
  level: number,
  _reporter: Reporter,
): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];

  switch (level) {
    case 1:
      return {
        kind: 'header1',
        text: parseNotionText(title as []),
      };
    case 2:
      return {
        kind: 'header2',
        text: parseNotionText(title as []),
      };
    case 3:
      return {
        kind: 'header3',
        text: parseNotionText(title as []),
      };
    default:
      return {
        kind: 'text',
        text: parseNotionText(title as []),
      };
  }
}

function parseHeader1(block: Json, reporter: Reporter): BlockData {
  return parseHeader(block, 1, reporter);
}

function parseHeader2(block: Json, reporter: Reporter): BlockData {
  return parseHeader(block, 2, reporter);
}

function parseHeader3(block: Json, reporter: Reporter): BlockData {
  return parseHeader(block, 3, reporter);
}

function parseCode(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const language = (properties && properties.language) || [];
  const result: BlockCode = {
    kind: 'code',
    code: parseNotionText(title as []),
    language: notionPageTextToString(parseNotionText(language as [])),
  };
  return result;
}

function parseImage(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const source = (properties && properties.source) || [];
  const result: BlockImage = {
    kind: 'image',
    sourceUrl: notionPageTextToString(parseNotionText(source as [])),
    width: _.get(block, 'format.block_width', -1) as number,
    aspectRatio: _.get(block, 'format.block_aspect_ratio', -1) as number,
  };
  return result;
}

function parseQuote(block: Json, _reporter: Reporter): BlockData {
  const properties = block.properties as Json;

  const title = (properties && properties.title) || [];
  const result: BlockQuote = {
    kind: 'quote',
    quote: parseNotionText(title as []),
  };
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
    title: notionPageTextToString(parseNotionText(title as [])),
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

function ignoreBlockParser(type: string): BlockContentParser {
  return (_block: Json, _reporter: Reporter): BlockData => ({
    kind: 'ignore',
    blockType: type,
  });
}

const contentParserByTypes: Record<string, BlockContentParser | null> = {
  text: parseText,
  code: parseCode,
  image: parseImage,
  page: parsePage,
  quote: parseQuote,
  header: parseHeader1,
  // eslint-disable-next-line @typescript-eslint/camelcase
  sub_header: parseHeader2,
  // eslint-disable-next-line @typescript-eslint/camelcase
  sub_sub_header: parseHeader3,
  // eslint-disable-next-line @typescript-eslint/camelcase
  bulleted_list: parseBulletedList,
  // eslint-disable-next-line @typescript-eslint/camelcase
  column_list: ignoreBlockParser('column_list'),
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
