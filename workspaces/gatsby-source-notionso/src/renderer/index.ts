import renderNotionBlocks from './renderNotionBlocks';
import { NotionPageBlock, NotionImageNodes } from '../types/notion';

export type BlockMeta = Record<string, string>;

export type NotionRenderChild = object;

export interface NotionPageToRender {
  title: string;
  pageId: string;
  slug: string;
  isDraft: boolean;
  indexPage: number;
  id: string;
  excerpt: string;
  pageIcon: string;
  createdAt: string;
  blocks: NotionPageBlock[];
  imageNodes: NotionImageNodes[];
}

export interface NotionRenderFuncs {
  // span rendering
  wrapText: (text: string) => NotionRenderChild;
  renderTextAtt: (
    children: NotionRenderChild[],
    att: string,
  ) => NotionRenderChild;
  renderLink: (children: NotionRenderChild[], ref: string) => NotionRenderChild;

  // blocks rendering
  renderBlock(
    blockType: string,
    meta: BlockMeta,
    children: NotionRenderChild[],
  ): NotionRenderChild;
}

type NotionRendererParam = {
  notionPage: NotionPageToRender;
  debug?: boolean;
};

type NotionPageRenderer = {
  render: (renderFuncs: NotionRenderFuncs) => object;
};

type NotionPageRendererFactory = (
  arg: NotionRendererParam,
) => NotionPageRenderer;

const renderer: NotionPageRendererFactory = ({ notionPage, debug }) => {
  return {
    render: (renderFuncs: NotionRenderFuncs): object => {
      const pageId = notionPage.pageId;
      const blocks = notionPage.blocks;
      const imageNodes = notionPage.imageNodes;
      const result = renderNotionBlocks(
        pageId,
        blocks,
        imageNodes,
        renderFuncs,
        !!debug,
      );
      return result;
    },
  };
};

export default renderer;
