import { Reporter } from 'gatsby';
import {
  NotionPageBlock,
  NotionLoader,
  NotionPageDescription,
  NotionPageImage,
  NotionPageLinkedPage,
  NotionMeta,
} from '../types/notion';

import notionPageTextToString from './parser/notionPageTextToString';
import parseMetaText from './parser/parseMetaText';

function getPropertyAsString(
  block: NotionPageBlock,
  propName: string,
  defaultValue: '',
): string {
  const property = block.properties.find(p => p.propName === propName);
  if (!property) {
    return defaultValue;
  }
  return notionPageTextToString(property.value);
}

function getAttributeAsString(
  block: NotionPageBlock,
  attName: string,
  defaultValue: '',
): string {
  const att = block.attributes.find(p => p.att === attName);
  if (!att || !att.value) {
    return defaultValue;
  }
  return att.value;
}

// loads a gatsby page
export default async function loadPage(
  pageId: string,
  rootPageId: string,
  indexPage: number,
  notionLoader: NotionLoader,
  reporter: Reporter,
  debug: boolean,
): Promise<NotionPageDescription> {
  // we load the given page
  await notionLoader.loadPage(pageId);

  // and parse its description block
  const page = notionLoader.getBlockById(pageId);
  if (!page) {
    reporter.error(`could not retreieve page with id: ${pageId}`);
    throw Error('error retrieving page');
  }

  if (page.type !== 'page') {
    throw new Error('invalid page');
  }

  const imageDescriptions: NotionPageImage[] = [];
  const linkedPages: NotionPageLinkedPage[] = [];
  const meta: NotionMeta = {};
  const metaParser = parseMetaText(meta);

  // parse all the blocks retrieved from notion
  for (const blockId of page.blockIds) {
    const block = notionLoader.getBlockById(blockId);
    if (!block) {
      reporter.error(`could not retrieve block with id: ${blockId}`);
      throw Error('error retrieving block in page');
    }
    switch (block.type) {
      case 'page':
        linkedPages.push({
          pageId: block.blockId,
          title: getPropertyAsString(block, 'title', ''),
        });
        break;
      case 'text':
        {
          // for the text blocks, we parse them to see if they contain
          // meta attributes, if not, we addf them as regular blocks
          const text = getPropertyAsString(block, 'title', '').trim();
          if (metaParser(text)) {
            // we change the type to meta to avoid the rendering of this text block
            block.type = 'meta';
          }
        }
        break;
      case 'image':
        imageDescriptions.push({
          pageId,
          notionUrl: getPropertyAsString(block, 'source', ''),
          signedUrl: '',
          contentId: block.blockId,
        });
        break;
      case 'ignore':
        // guess what... we ignore that one
        break;
      default:
        // we keep the block by defaut
        break;
    }
  }

  const item: NotionPageDescription = {
    pageId,
    title: getPropertyAsString(page, 'title', ''),
    indexPage,
    slug: meta.slug || `${indexPage}`,
    createdAt: meta.date || new Date().toISOString(),
    tags: meta.tags || [],
    isDraft: !!meta.isDraft,
    excerpt: meta.excerpt || '',
    pageIcon: getAttributeAsString(page, 'pageIcon', ''),
    blocks: [],
    images: imageDescriptions,
    linkedPages,
  };
  // we return all the blocks
  // TODO: as we already got those blocks above, we may want to build the list as we go
  notionLoader.getBlocks(item.blocks, rootPageId);
  return item;
}
