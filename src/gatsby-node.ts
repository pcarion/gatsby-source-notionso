import {
  GatsbyContext,
  // GatsbyReporter,
  // GatsbyNode,
  // GatsbyOnNodeTypeContext,
  // GatsbyResolversCreator,
} from './types/gatsby';

import retrievePage from './notion/retrievePage';

export interface PluginConfig {
  pageId: string;
  name: string;
  tokenv2?: string;
  debug?: boolean;
}

const defaultConfig = {
  debug: false,
};

export const sourceNodes = async (
  context: GatsbyContext,
  pluginConfig: PluginConfig,
): Promise<void> => {
  const config = { ...defaultConfig, ...pluginConfig };
  const { pageId, name, tokenv2, debug } = config;
  const {
    actions,
    //    getNode,
    createNodeId,
    createContentDigest,
    reporter,
  } = context;
  const { createNode /*, createTypes, createParentChildLink */ } = actions;
  if (!pageId) {
    reporter.panic(
      'gatsby-source-notioso requires a pageId parameter. This is the id of the root page for your notion content',
    );
    return;
  }

  if (!name) {
    reporter.panic('gatsby-source-notioso requires a name parameter.');
    return;
  }
  const item = {
    pageId,
    tokenv2,
    debug,
  };

  await retrievePage(pageId, reporter);

  const nodeId = createNodeId(pageId);
  createNode({
    ...item,
    id: nodeId,
    _id: nodeId,
    parent: null,
    children: [],
    internal: {
      contentDigest: createContentDigest(item),
      type: `Notion${name}`,
    },
  });
};
