import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionsoPluginOptions } from '../types/notion';

import notionLoader from '../notion/notionLoader';
import loadPage from '../notion/loadPage';
import createNodeForPage from './createNodeForPage';

export default async function createNodesFromRootPage(
  rootPageId: string,
  createNodeId: NodePluginArgs['createNodeId'],
  createNode: Actions['createNode'],
  createParentChildLink: Actions['createParentChildLink'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  getNodes: NodePluginArgs['getNodes'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
  try {
    const debug = pluginConfig.debug || false;

    const loader = notionLoader(reporter, debug);
    // loading the root page
    const item = await loadPage(rootPageId, '', 0, loader, reporter, debug);

    // we are interested only by the linked pages from the root page
    let index = 0;
    for (const linkedPage of item.linkedPages) {
      index += 1;
      const { pageId, title } = linkedPage;

      // we reset data before we load a new page
      // (to avoid keeping around too many blocks)
      loader.reset();

      await createNodeForPage(
        pageId,
        rootPageId,
        title,
        index,
        loader,
        createNodeId,
        createNode,
        createContentDigest,
        store,
        cache,
        pluginConfig,
        reporter,
      );
    }
  } catch (err) {
    console.log(err);
    reporter.error(
      `Error loading root page: ${rootPageId} - error is: ${err.message}`,
    );
  }
}
