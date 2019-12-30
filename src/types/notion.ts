import { PluginOptions } from 'gatsby';

export type NotionTextAttributes = string[][];

export type NotionText = [string, NotionTextAttributes?][];

export interface NotionTextParsedAttributes {
  isBold: boolean;
  isItalic: boolean;
  isStrikeThrough: boolean;
  isCode: boolean;
  isLink: boolean;
  withLink?: string;
}

export type NotionTextParsed = [string, NotionTextParsedAttributes][];

export interface BlockText {
  kind: 'text';
  text: NotionTextParsed;
}

export interface BlockPage {
  kind: 'page';
  title: NotionTextParsed;
  contentIds: string[];
}

export interface BlockCode {
  kind: 'code';
  code: NotionTextParsed;
  language: NotionTextParsed;
}

export interface BlockImage {
  kind: 'image';
  sourceUrl: string;
  width: number;
  aspectRatio: number;
}

export interface BlockUnknown {
  kind: 'unknown';
  blockType: string;
}

export type BlockData =
  | BlockPage
  | BlockText
  | BlockCode
  | BlockImage
  | BlockUnknown;

export interface BlockDescription {
  id: string;
  version: string;
  createdTime: string;
  lastEditedTime: string;
  content: BlockData;
}

export interface ContentDescription {
  f1: string;
  f2: string;
  f3: string;
}

export interface ParagraphDescription {
  type: 'text' | 'code' | 'image';
  content: ContentDescription[];
}

export interface ImageDescription {
  notionUrl: string;
  signedUrl: string;
  contentId: string;
}

export interface PageDescription {
  pageId: string;
  title: ParagraphDescription;
  paras: ParagraphDescription[];
  images: ImageDescription[];
}

// generic type to hold json data
export type JsonTypes = string | number | boolean | Date | Json | JsonArray;
export interface Json {
  [x: string]: JsonTypes;
}
export type JsonArray = Array<JsonTypes>;

// plugin configuration data
export interface NotionsoPluginOptions extends PluginOptions {
  rootPageId: string;
  name: string;
  tokenv2?: string;
  downloadLocal: boolean;
  debug?: boolean;
}

export interface NotionLoader {
  loadPage(pageId: string): Promise<void>;
  downloadImages(images: [string, string][]): Promise<[string, string][]>;
  getBlockById(blockId: string): Json;
}

export interface GatsbyNotionsoNode {
  id: string; // Gatsby node ID
  parent?: string | null;
  children?: string[];
  internal?: {
    mediaType?: string;
    type: string;
    contentDigest: string;
    owner: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
