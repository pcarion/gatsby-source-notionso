import { Reporter, Actions, NodePluginArgs, NodeInput } from 'gatsby';
import { NotionsoPluginOptions } from '../types/notion';

import notionLoader from '../notion/notionLoader';
import loadPage from '../notion/loadPage';
import createNodeForPage from './createNodeForPage';
import downloadNotionImages from '../gatsby/downloadNotionImages';

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
    const { debug } = pluginConfig;

    const loader = notionLoader(reporter, debug);
    // loading the root page
    const item = await loadPage(rootPageId, '', 0, loader, reporter);

    const pageNodesDict: Record<string, NodeInput> = {};

    // we are interested only by the linked pages from the root page
    let index = 0;
    for (const linkedPage of item.linkedPages) {
      index += 1;
      const { pageId, title } = linkedPage;

      // we reset data before we load a new page
      // (to avoid keeping around too many blocks)
      loader.reset();

      const pageNode = await createNodeForPage(
        pageId,
        rootPageId,
        title,
        index,
        loader,
        createNodeId,
        createNode,
        createContentDigest,
        pluginConfig,
        reporter,
      );
      // we crate a dictionary of the page nodes
      // will be used to create the link between a
      // page and its images
      if (pageNode) {
        pageNodesDict[pageId] = pageNode as NodeInput;
      }
    }
    // we download all the images found
    // in the various pages
    await downloadNotionImages(
      pageNodesDict,
      getNodes,
      createNode,
      createParentChildLink,
      createNodeId,
      store,
      cache,
      createContentDigest,
      loader,
      pluginConfig,
      reporter,
    );
  } catch (err) {
    console.log(err);
    reporter.error(
      `Error loading root page: ${rootPageId} - error is: ${err.message}`,
    );
  }
}
