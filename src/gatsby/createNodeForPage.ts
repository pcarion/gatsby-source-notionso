import { Reporter, Actions, NodePluginArgs } from 'gatsby';
import { NotionLoader, NotionsoPluginOptions } from '../types/notion';

import loadPage from '../notion/loadPage';

export default async function createNodeForPage(
  pageId: string,
  title: string,
  index: number,
  notionLoader: NotionLoader,
  createNodeId: NodePluginArgs['createNodeId'],
  createNode: Actions['createNode'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
  try {
    // loading page
    const item = await loadPage(pageId, index, notionLoader, reporter);

    const nodeId = createNodeId(pageId);
    createNode({
      ...item,
      indexPage: index,
      id: nodeId,
      _id: nodeId,
      title,
      parent: undefined,
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `NotionPage${pluginConfig.name}`,
      },
    });
  } catch (err) {
    reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
  }
}
