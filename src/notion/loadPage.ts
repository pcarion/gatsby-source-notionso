import { Reporter } from 'gatsby';
import {
  NotionPageBlock,
  NotionLoader,
  NotionPageDescription,
  NotionPageImage,
  NotionPageLinkedPage,
  NotionPageText,
} from '../types/notion';

import parseMetaBlock from './parser/parseMetaBlock';
import notionPageTextToString from './parser/notionPageTextToString';

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

function getPropertyText(
  block: NotionPageBlock,
  propName: string,
): NotionPageText[] | null {
  const property = block.properties.find(p => p.propName === propName);
  if (!property) {
    return null;
  }
  return property.value;
}

export default async function loadPage(
  pageId: string,
  rootPageId: string,
  indexPage: number,
  notionLoader: NotionLoader,
  reporter: Reporter,
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
  let hasMeta = false;
  const meta: Record<string, string> = {};

  for (const blockId of page.blockIds) {
    const block = notionLoader.getBlockById(blockId);
    if (!block) {
      reporter.error(`could not retreieve para with id: ${blockId}`);
      throw Error('error retrieving paragraph');
    }
    switch (block.type) {
      case 'page':
        linkedPages.push({
          pageId: block.blockId,
          title: getPropertyAsString(block, 'title', ''),
        });
        break;
      case 'quote':
        if (!hasMeta) {
          hasMeta = true;
          const text = getPropertyText(block, 'title');
          // try to parse the block as a meta information definition block
          if (text) {
            if (parseMetaBlock(text, meta)) {
              // if we were able to parse the block, we change its type
              // (so that it is not rendered)
              block.type = '_meta';
            }
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
        // we keep the record by defaut
        break;
    }
  }

  let slug = `${indexPage}`;
  let createdAt = new Date().toISOString();

  if (hasMeta) {
    if (meta['slug']) {
      slug = meta['slug'];
    }
    // TODO: parse date so that it becomes an actual
    // date in GraphQL
    if (meta['date']) {
      createdAt = meta['date'];
    }
  }

  const item: NotionPageDescription = {
    pageId,
    title: getPropertyAsString(page, 'title', ''),
    indexPage,
    slug,
    createdAt,
    blocks: [],
    images: imageDescriptions,
    linkedPages,
  };
  notionLoader.getBlocks(item.blocks, rootPageId);
  return item;
}
