import {
  GatsbyContext,
  // GatsbyReporter,
  // GatsbyNode,
  // GatsbyOnNodeTypeContext,
  // GatsbyResolversCreator,
} from './types/gatsby';

import './types/notion';

import notionLoader from './notion/notionLoader';
import createNodeForPage from './gatsby/createNodeForPage';

const defaultConfig = {
  debug: false,
};

export const sourceNodes = async (
  context: GatsbyContext,
  pluginConfig: PluginConfig,
): Promise<void> => {
  const config = { ...defaultConfig, ...pluginConfig };
  const { rootPageId, name } = config;
  const {
    actions,
    //    getNode,
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

  await createNodeForPage(
    rootPageId,
    loader,
    createNodeId,
    createNode,
    createContentDigest,
    config,
    reporter,
  );
  // const item = {
  //   pageId,
  //   tokenv2,
  //   debug,
  // };

  // await loadPage(pageId, reporter);

  // const nodeId = createNodeId(pageId);
  // createNode({
  //   ...item,
  //   id: nodeId,
  //   _id: nodeId,
  //   parent: null,
  //   children: [],
  //   internal: {
  //     contentDigest: createContentDigest(item),
  //     type: `Notion${name}`,
  //   },
  // });
};
