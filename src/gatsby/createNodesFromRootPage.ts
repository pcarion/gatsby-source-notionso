import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionsoPluginOptions } from '../types/notion';

import notionLoader from '../notion/notionLoader';
import loadPage from '../notion/loadPage';
import createNodeForPage from './createNodeForPage';
import downloadNotionImages from '../gatsby/downloadNotionImages';

export default async function createNodesFromRootPage(
  pageId: string,
  createNodeId: NodePluginArgs['createNodeId'],
  createNode: Actions['createNode'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  getNodes: NodePluginArgs['getNodes'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
  try {
    const { debug } = pluginConfig;

    const loader = notionLoader(reporter, debug);
    // loading page
    const item = await loadPage(pageId, 0, loader, reporter);

    // we are interested only by the linked pages from the root page
    let index = 0;
    for (const linkedPage of item.linkedPages) {
      index += 1;
      const { pageId, title } = linkedPage;

      // we reset data before we load a new page
      // (to avoid keeping around to many blocks)
      loader.reset();

      await createNodeForPage(
        pageId,
        title,
        index,
        loader,
        createNodeId,
        createNode,
        createContentDigest,
        pluginConfig,
        reporter,
      );
    }
    // we download all the images found
    // in the various pages
    await downloadNotionImages(
      getNodes,
      createNode,
      createNodeId,
      store,
      cache,
      createContentDigest,
      loader,
      pluginConfig,
      reporter,
    );
  } catch (err) {
    reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
  }
}
