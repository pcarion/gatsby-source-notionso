import { PluginOptions } from 'gatsby';

export type NotionTextAttributes = string[][];

export type NotionText = [string, NotionTextAttributes?][];

export interface BlockText {
  kind: 'text';
  text: NotionPageText[];
}

export interface BlockPage {
  kind: 'page';
  pageId: string;
  title: string;
  contentIds: string[];
}

export interface BlockCode {
  kind: 'code';
  code: NotionPageText[];
  language: string;
}

export interface BlockQuote {
  kind: 'quote';
  quote: NotionPageText[];
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

export interface BlockIgnore {
  kind: 'ignore';
  blockType: string;
}

export type BlockData =
  | BlockPage
  | BlockText
  | BlockCode
  | BlockImage
  | BlockQuote
  | BlockIgnore
  | BlockUnknown;

export interface BlockDescription {
  id: string;
  version: string;
  createdTime: string;
  lastEditedTime: string;
  content: BlockData;
}

export interface NotionPageTextAtt {
  att: string;
  value?: string;
}

export interface NotionPageText {
  text: string;
  atts: NotionPageTextAtt[];
}

export interface NotionPageBlock {
  type: 'text' | 'code' | 'image' | 'quote';
  content: NotionPageText[];
}

export interface ImageDescription {
  pageId: string;
  notionUrl: string;
  signedUrl: string;
  contentId: string;
}

export interface PageDescription {
  pageId: string;
  title: string;
  slug: string;
  createdAt: string;
  blocks: NotionPageBlock[];
  images: ImageDescription[];
  linkedPages: LinkedPagesDescription[];
}

export interface LinkedPagesDescription {
  title: string;
  pageId: string;
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
  downloadImages(
    images: [string, string, string][],
  ): Promise<[string, string, string][]>;
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
