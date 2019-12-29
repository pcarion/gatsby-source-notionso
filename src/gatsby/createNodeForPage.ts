import '../types/notion';
import {
  GatsbyNodeIdCreator,
  GatsbyNodeCreator,
  GatsbyContentDigester,
  GatsbyReporter,
} from '../types/gatsby';

import loadPage from '../notion/loadPage';

export default async function createNodeForPage(
  pageId: string,
  notionLoader: NotionLoader,
  createNodeId: GatsbyNodeIdCreator,
  createNode: GatsbyNodeCreator,
  createContentDigest: GatsbyContentDigester,
  pluginConfig: PluginConfig,
  reporter: GatsbyReporter,
): Promise<void> {
  try {
    // loading page
    const item = await loadPage(pageId, notionLoader, reporter);

    const nodeId = createNodeId(pageId);
    createNode({
      ...item,
      id: nodeId,
      _id: nodeId,
      parent: null,
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `NotionPage${pluginConfig.name}`,
        owner: '', // will be set by Gatsbsy itself
      },
    });
  } catch (err) {
    reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
  }
}
