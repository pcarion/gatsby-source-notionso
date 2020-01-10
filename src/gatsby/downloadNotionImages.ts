import { Reporter, Actions, NodePluginArgs, NodeInput, Node } from 'gatsby';

import { createRemoteFileNode } from 'gatsby-source-filesystem';
import {
  NotionLoader,
  GatsbyNotionsoNode,
  NotionsoPluginOptions,
  NotionPageImage,
} from '../types/notion';

// reference:
// https://www.gatsbyjs.org/packages/gatsby-source-filesystem/#createremotefilenode

export default async function downloadNotionImages(
  pageNodesDict: Record<string, NodeInput>,
  getNodes: NodePluginArgs['getNodes'],
  createNode: Actions['createNode'],
  createParentChildLink: Actions['createParentChildLink'],
  createNodeId: NodePluginArgs['createNodeId'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  notionLoader: NotionLoader,
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
  // we retrieve all the notion nodes which have been created
  // and we see if they have images associated to them
  // TODO: add filtering pertype (eg. NotionPageBlog) to allow
  // multiple instanes of the plugin to coexist
  const imagesNodes: GatsbyNotionsoNode[] = getNodes().filter(
    (n: GatsbyNotionsoNode) => {
      return n.internal && n.internal.owner === 'gatsby-source-notionso';
    },
  );

  const imagesToDownload: [string, string, string][] = [];
  await Promise.all(
    imagesNodes.map(async node => {
      ((node.images as NotionPageImage[]) || []).forEach(image => {
        imagesToDownload.push([image.notionUrl, image.contentId, image.pageId]);
      });
    }),
  );
  const result = await notionLoader.downloadImages(imagesToDownload);
  reporter.info(`Images for notion source: ${result}`);

  for (const img of result) {
    const [notionUrl, signedUrl, pageId] = img;
    const fileNode = await createRemoteFileNode({
      url: signedUrl,
      store,
      cache,
      createNode,
      createNodeId,
      reporter,
    });
    const assetNodeId = createNodeId(notionUrl);
    const item = {
      notionUrl,
      pageId,
      // check:
      // https://www.gatsbyjs.org/docs/node-creation/#foreign-key-reference-___node
      // https://www.gatsbyjs.org/docs/schema-gql-type#foreign-key-reference-___node
      // eslint-disable-next-line @typescript-eslint/camelcase
      localFile___NODE: fileNode.id,
    };
    const assetNode: NodeInput = {
      ...item,
      id: assetNodeId,
      _id: assetNodeId,
      parent: undefined,
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `NotionPageAsset${pluginConfig.name}`,
      },
    };
    createNode(assetNode);
    // create the link between the page and its images
    // https://www.gatsbyjs.org/docs/actions/#createParentChildLink
    const pageNode = pageNodesDict[pageId];
    if (pageNode) {
      createParentChildLink({
        parent: pageNode as Node,
        child: assetNode as Node,
      });
    } else {
      reporter.error(`Could not find page node for pageId:${pageId}`);
    }
  }
}
