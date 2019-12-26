import * as _ from 'lodash';

import '../../types/notion';
import { GatsbyReporter } from '../../types/gatsby';

function getFieldAsString(
  block: Json,
  propName: string,
  reporter: GatsbyReporter,
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
type BlockContentParser = (
  properties: Json,
  reporter: GatsbyReporter,
) => BlockData;

/*
example:
  type: 'text',
  properties:
    { title:
      [ [ 'and a ' ],
        [ 'l', [ [ 'a', 'https://www.pcarion.com' ] ] ],
        [ 'ink', [ [ 'a', 'http://www.pcarion.com' ] ] ],
        [ ' !' ] ] },
*/
function parseText(properties: Json, reporter: GatsbyReporter): BlockData {
  const title = properties && properties.title;
  if (!title) {
    reporter.error('missing title property for title text block');
    throw new Error('parsing error');
  }
  const result: BlockTextMarkdown = {
    kind: 'text_markdown',
    markdown: '',
  };
  return result;
}

function unknowknBlockParser(type: string): BlockContentParser {
  return (_properties: Json, _reporter: GatsbyReporter): BlockData => ({
    kind: 'unknown',
    blockType: type,
  });
}

const contentParserByTypes: Record<string, BlockContentParser | null> = {
  text: parseText,
  code: null,
  image: null,
  page: null,
};

export default function parseBlock(
  block: Json,
  reporter: GatsbyReporter,
): BlockDescription {
  const type = getFieldAsString(block, 'type', reporter);
  const parser = contentParserByTypes[type] || unknowknBlockParser(type);
  const properties = block.properties as Json;

  const result: BlockDescription = {
    id: getFieldAsString(block, 'id', reporter),
    version: getFieldAsString(block, 'version', reporter),
    createdTime: getFieldAsString(block, 'resulted_time', reporter),
    lastEditedTime: getFieldAsString(block, 'last_edresulttime', reporter),
    data: parser(properties, reporter),
  };
  return result;
}