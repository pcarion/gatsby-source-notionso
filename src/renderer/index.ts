import renderNotionBlocks from './renderNotionBlocks';
import { NotionPageDescription } from '../types/notion';

export type BlockMeta = Record<string, string>;

export type NotionRenderChild = object;

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
  notionPage: NotionPageDescription;
  allNotionPageAsset: object;
};

type NotionPageRenderer = {
  render: (renderFuncs: NotionRenderFuncs) => object;
};

type NotionPageRendererFactory = (
  arg: NotionRendererParam,
) => NotionPageRenderer;

const renderer: NotionPageRendererFactory = ({
  notionPage,
  allNotionPageAsset,
}) => {
  return {
    render: (renderFuncs: NotionRenderFuncs): object => {
      console.log('From: gatsy-source-notionso/renderer:');
      console.log('notionPage:', notionPage);
      console.log('allNotionPageAsset:', allNotionPageAsset);
      const pageId = notionPage.pageId;
      const blocks = notionPage.blocks;
      const result = renderNotionBlocks(pageId, blocks, renderFuncs);
      return result;
    },
  };
};

export default renderer;
