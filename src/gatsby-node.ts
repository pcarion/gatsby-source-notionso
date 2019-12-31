import {
  GatsbyNode,
  SourceNodesArgs,
  CreateSchemaCustomizationArgs,
} from 'gatsby';
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
  const { createNode } = actions;
  if (!rootPageId) {
    reporter.panic(
      'gatsby-source-notionso requires a rootPageId parameter. This is the id of the root page for your notion content',
    );
    return;
  }

  if (!name) {
    reporter.panic('gatsby-source-notionso requires a name parameter.');
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

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = async (
  context: CreateSchemaCustomizationArgs,
  pluginConfig: NotionsoPluginOptions,
): Promise<void> => {
  const { actions } = context;
  const { createTypes } = actions;
  const typeDefs = `
    type NotionPage${pluginConfig.name}LinkedPage {
      title: String!
      pageId: String!
    }

    type NotionPage${pluginConfig.name}Image {
      notionUrl: String!
      signedUrl: String!
      contentId: String!
    }

    type NotionPage${pluginConfig.name}Att {
      att: String!
      value: String
    }

    type NotionPage${pluginConfig.name}Text {
      text: String!
      atts: [NotionPage${pluginConfig.name}Att!]
    }

    type NotionPage${pluginConfig.name}Block {
      type: String!
      content: [NotionPage${pluginConfig.name}Text!]
    }

    type NotionPage${pluginConfig.name} implements Node @dontInfer {
      pageId: String!
      title: String!
      indexPage: Int!
      slug: String!
      createdAt: Date!
      blocks: [NotionPage${pluginConfig.name}Block!]
      images: [NotionPage${pluginConfig.name}Image!]
      linkedPages: [NotionPage${pluginConfig.name}LinkedPage!]
    }
  `;
  createTypes(typeDefs);
};
