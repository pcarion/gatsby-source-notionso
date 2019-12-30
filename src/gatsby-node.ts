import { GatsbyNode, SourceNodesArgs } from 'gatsby';
import { NotionsoPluginOptions } from './types/notion';

import notionLoader from './notion/notionLoader';
import createNodesFromRootPage from './gatsby/createNodesFromRootPage';
import downloadNotionImages from './gatsby/downloadNotionImages';

const defaultConfig = {
  debug: false,
  downloadLocal: true,
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  context: SourceNodesArgs,
  pluginConfig: NotionsoPluginOptions,
): Promise<void> => {
  const config = { ...defaultConfig, ...pluginConfig };
  const { rootPageId, name, downloadLocal } = config;
  const {
    actions,
    //    getNode,
    getNodes,
    store,
    cache,
    createNodeId,
    createContentDigest,
    reporter,
  } = context;
  const { createNode /*, createTypes, createParentChildLink */ } = actions;
  if (!rootPageId) {
    reporter.panic(
      'gatsby-source-notioso requires a rootPageId parameter. This is the id of the root page for your notion content',
    );
    return;
  }

  if (!name) {
    reporter.panic('gatsby-source-notioso requires a name parameter.');
    return;
  }
  const loader = notionLoader(reporter, config.debug);

  await createNodesFromRootPage(
    rootPageId,
    loader,
    createNodeId,
    createNode,
    createContentDigest,
    config,
    reporter,
  );

  if (downloadLocal) {
    await downloadNotionImages(
      getNodes,
      createNode,
      createNodeId,
      store,
      cache,
      createContentDigest,
      loader,
      config,
      reporter,
    );
  }
};
