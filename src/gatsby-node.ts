import {
  GatsbyNode,
  SourceNodesArgs,
  CreateSchemaCustomizationArgs,
} from 'gatsby';
import { NotionsoPluginOptions } from './types/notion';

import createNodesFromRootPage from './gatsby/createNodesFromRootPage';

const defaultConfig = {
  debug: false,
  downloadLocal: true,
};

export const sourceNodes: GatsbyNode['sourceNodes'] = async (
  context: SourceNodesArgs,
  pluginConfig: NotionsoPluginOptions,
): Promise<void> => {
  const config = { ...defaultConfig, ...pluginConfig };
  const { rootPageId, name } = config;
  const {
    actions,
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
  await createNodesFromRootPage(
    rootPageId,
    createNodeId,
    createNode,
    createContentDigest,
    getNodes,
    store,
    cache,
    config,
    reporter,
  );
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

    type NotionPage${pluginConfig.name}Property {
      propName: String!
      value: [NotionPage${pluginConfig.name}Text!]
    }

    type NotionPage${pluginConfig.name}Block {
      type: String!
      blockId: String!
      properties: [NotionPage${pluginConfig.name}Property!]
      attributes: [NotionPage${pluginConfig.name}Att!]
      blockIds: [String!]
    }

    type NotionPage${pluginConfig.name} implements Node @dontInfer {
      pageId: String!
      title: String!
      indexPage: Int!
      isDraft: Boolean!
      slug: String!
      createdAt: Date!
      blocks: [NotionPage${pluginConfig.name}Block!]
      images: [NotionPage${pluginConfig.name}Image!]
      linkedPages: [NotionPage${pluginConfig.name}LinkedPage!]
    }
  `;
  createTypes(typeDefs);
};
