import { GatsbyReporter } from '../types/gatsby';
import parseBlock from './parser/parseBlock';
import notionTextToParagraphDescription from './parser/notionTextToParagraphDescription';

function notionTextParsedToString(text: NotionTextParsed): string {
  const parts: string[] = [];
  text.forEach(([t, _]) => {
    parts.push(t);
  });
  return parts.join('');
}

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
          content: [
            {
              text: notionTextParsedToString(blockData.code),
              style: 'c',
              extra: notionTextParsedToString(blockData.language),
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
