import { Reporter } from 'gatsby';
import {
  Json,
  NotionPageBlock,
  ImageDescription,
  NotionLoader,
  PageDescription,
  LinkedPagesDescription,
} from '../types/notion';

import parseBlock from './parser/parseBlock';
import parseMetaBlock from './parser/parseMetaBlock';

export default async function loadPage(
  pageId: string,
  indexPage: number,
  notionLoader: NotionLoader,
  reporter: Reporter,
): Promise<PageDescription> {
  // we load the given page
  await notionLoader.loadPage(pageId);

  // and parse its description block
  const page: Json = notionLoader.getBlockById(pageId);
  if (!page) {
    reporter.error(`could not retreieve page with id: ${pageId}`);
    throw Error('error retrieving page');
  }

  const description = parseBlock(page.value as Json, reporter);

  const content = description.content;
  if (content.kind !== 'page') {
    throw new Error('invalid page');
  }

  const blocks: NotionPageBlock[] = [];
  const imageDescriptions: ImageDescription[] = [];
  const linkedPages: LinkedPagesDescription[] = [];
  let hasMeta = false;
  const meta: Record<string, string> = {};

  for (const contentId of content.contentIds) {
    const para: Json = notionLoader.getBlockById(contentId);
    if (!para) {
      reporter.error(`could not retreieve para with id: ${contentId}`);
      throw Error('error retrieving paragraph');
    }
    const block = parseBlock(para.value as Json, reporter);
    const blockData = block.content;
    switch (blockData.kind) {
      case 'text':
        blocks.push({
          type: 'text',
          content: blockData.text,
        });
        break;
      case 'bulleted_list':
        blocks.push({
          type: 'bulleted_list',
          content: blockData.text,
        });
        break;
      case 'header1':
      case 'header2':
      case 'header3':
        blocks.push({
          type: blockData.kind,
          content: blockData.text,
        });
        break;
      case 'page':
        linkedPages.push({
          pageId: blockData.pageId,
          title: blockData.title,
        });
        break;
      case 'code':
        const code = blockData.code[0];
        const language = blockData.language;
        code.atts.push({
          att: '_language',
          value: language,
        });
        blocks.push({
          type: 'code',
          content: [code],
        });
        break;
      case 'quote':
        if (hasMeta) {
          blocks.push({
            type: 'quote',
            content: blockData.quote,
          });
        } else {
          hasMeta = true;
          // try to parse the block as a meta information definition block
          if (!parseMetaBlock(blockData.quote, meta)) {
            // if not parsable, we consider the back as a
            // a real quote block
            blocks.push({
              type: 'quote',
              content: blockData.quote,
            });
          }
        }
        break;
      case 'image':
        imageDescriptions.push({
          pageId,
          notionUrl: blockData.sourceUrl,
          signedUrl: '',
          contentId,
        });
        blocks.push({
          type: 'image',
          content: [
            {
              text: '',
              atts: [
                {
                  att: '_sourceUrl',
                  value: blockData.sourceUrl,
                },
                {
                  att: '_width',
                  value: `${blockData.width}`,
                },
                {
                  att: '_aspectRatio',
                  value: `${blockData.aspectRatio}`,
                },
              ],
            },
          ],
        });
        break;
      case 'ignore':
        // guess what... we ignore that one
        break;
      default:
        reporter.error(`unknown block: ${JSON.stringify(blockData)}`);
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

  return {
    pageId,
    title: content.title,
    slug,
    createdAt,
    blocks,
    images: imageDescriptions,
    linkedPages,
  };
}
