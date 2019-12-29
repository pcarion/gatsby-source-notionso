type NotionTextAttributes = string[][];
type NotionText = [string, NotionTextAttributes?][];

interface NotionTextParsedttributes {
  isBold: boolean;
  isItalic: boolean;
  isStrikeThrough: boolean;
  isCode: boolean;
  isLink: boolean;
  withLink?: string;
}

type NotionTextParsed = [string, NotionTextParsedttributes][];

interface BlockText {
  kind: 'text';
  text: NotionTextParsed;
}

interface BlockPage {
  kind: 'page';
  title: NotionTextParsed;
  contentIds: string[];
}

interface BlockCode {
  kind: 'code';
  code: NotionTextParsed;
  language: NotionTextParsed;
}

interface BlockImage {
  kind: 'image';
  sourceUrl: string;
  width: number;
  aspectRatio: number;
}

interface BlockUnknown {
  kind: 'unknown';
  blockType: string;
}

type BlockData = BlockPage | BlockText | BlockCode | BlockImage | BlockUnknown;

interface BlockDescription {
  id: string;
  version: string;
  createdTime: string;
  lastEditedTime: string;
  content: BlockData;
}

interface ContentDescription {
  f1: string;
  f2: string;
  f3: string;
}
interface ParagraphDescription {
  type: 'text' | 'code' | 'image';
  content: ContentDescription[];
}

interface PageDescription {
  pageId: string;
  title: ParagraphDescription;
  paras: ParagraphDescription[];
}

// generic type to hold json data
type JsonTypes = string | number | boolean | Date | Json | JsonArray;
interface Json {
  [x: string]: JsonTypes;
}
type JsonArray = Array<JsonTypes>;

// plugin configuration data
interface PluginConfig {
  rootPageId: string;
  name: string;
  tokenv2?: string;
  debug?: boolean;
}

interface NotionLoader {
  loadPage(pageId: string): Promise<void>;
  downloadImage(imageUrl: string, contentId: string): Promise<void>;
  getBlockById(blockId: string): Json;
}
