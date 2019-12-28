import { GatsbyReporter } from '../types/gatsby';
import parseBlock from './parser/parseBlock';

export default async function loadPage(
  pageId: string,
  notionLoader: NotionLoader,
  reporter: GatsbyReporter,
): Promise<PageDescrition> {
  // we load the given page
  await notionLoader.loadPage(pageId);

  // and parse its description block
  const page: Json = notionLoader.getBlockById(pageId);
  if (!page) {
    reporter.error(`could not retreieve page with id: ${pageId}`);
    throw Error('error retrieving page');
  }

  const description = parseBlock(page.value as Json, reporter);

  return {
    pageId,
    blocks: [description],
  };
}
