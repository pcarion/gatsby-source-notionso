import { PluginOptions } from 'gatsby';

export interface NotionPageAtt {
  att: string;
  value?: string;
}

export interface NotionPageText {
  text: string;
  atts: NotionPageAtt[];
}

export interface NotionPageProperty {
  propName: string;
  value: NotionPageText[];
}

export interface NotionPageBlock {
  type: string;
  blockId: string;
  properties: NotionPageProperty[];
  attributes: NotionPageAtt[];
  blockIds: string[];
}

export interface NotionPageImage {
  pageId: string;
  notionUrl: string;
  signedUrl: string;
  contentId: string;
}

export interface NotionPageLinkedPage {
  title: string;
  pageId: string;
}

export interface NotionPageDescription {
  pageId: string;
  title: string;
  indexPage: number;
  slug: string;
  createdAt: string;
  blocks: NotionPageBlock[];
  images: NotionPageImage[];
  linkedPages: NotionPageLinkedPage[];
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
  getBlockById(blockId: string): NotionPageBlock | undefined;
  getBlocks(copyTo: NotionPageBlock[], pageId: string): void;
  reset(): void;
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
