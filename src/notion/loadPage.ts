import { GatsbyReporter } from '../types/gatsby';
import parseBlock from './parser/parseBlock';
import notionTextToParagraphDescription from './parser/notionTextToParagraphDescription';
import notionTextParsedToString from './parser/notionTextParsedToString';

export default async function loadPage(
  pageId: string,
  notionLoader: NotionLoader,
  reporter: GatsbyReporter,
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

  const paras: ParagraphDescription[] = [];

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
        paras.push(notionTextToParagraphDescription(blockData.text));
        break;
      case 'page':
        // TODO: we ignore for now but could be considered a a link
        break;
      case 'code':
        paras.push({
          type: 'code',
          content: [
            {
              f1: notionTextParsedToString(blockData.code),
              f2: 'c',
              f3: notionTextParsedToString(blockData.language),
            },
          ],
        });
        break;
      case 'image':
        await notionLoader.downloadImage(blockData.sourceUrl, contentId);
        paras.push({
          type: 'image',
          content: [
            {
              f1: blockData.sourceUrl,
              f2: 'i',
              f3: JSON.stringify({
                width: blockData.width,
                aspectRatio: blockData.aspectRatio,
              }),
            },
          ],
        });
        break;

      default:
        reporter.error(`unknown block: ${JSON.stringify(blockData)}`);
    }
  }

  return {
    pageId,
    title: notionTextToParagraphDescription(content.title),
    paras,
  };
}
