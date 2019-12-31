import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionLoader, NotionsoPluginOptions } from '../types/notion';

import loadPage from '../notion/loadPage';
import createNodeForPage from './createNodeForPage';

export default async function createNodesFromRootPage(
  pageId: string,
  notionLoader: NotionLoader,
  createNodeId: NodePluginArgs['createNodeId'],
  createNode: Actions['createNode'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
  try {
    // loading page
    const item = await loadPage(pageId, notionLoader, reporter);

    // we are interested only by the linked pages from the root page
    let index = 0;
    for (const linkedPage of item.linkedPages) {
      index += 1;
      const { pageId, title } = linkedPage;
      await createNodeForPage(
        pageId,
        title,
        index,
        notionLoader,
        createNodeId,
        createNode,
        createContentDigest,
        pluginConfig,
        reporter,
      );
    }
  } catch (err) {
    reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
  }
}
