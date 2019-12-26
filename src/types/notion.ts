interface PageRecordInformation {
  id: string;
  title: string; // TODO: parsing required
  contentIds: string[];
  version: number;
  createdTime: string;
  lastEditedTime: string;
}

interface BlockTextMarkdown {
  kind: 'text_markdown';
  markdown: string;
}

interface BlockCode {
  kind: 'code';
  code: string;
  language: string;
}

interface BlockUnknown {
  kind: 'unknown';
  blockType: string;
}

type BlockData = BlockTextMarkdown | BlockCode | BlockUnknown;

interface BlockDescription {
  id: string;
  version: string;
  createdTime: string;
  lastEditedTime: string;
  data: BlockData;
}

// generic type to hold json data
type JsonTypes = string | number | boolean | Date | Json | JsonArray;
interface Json {
  [x: string]: JsonTypes;
}
type JsonArray = Array<JsonTypes>;
