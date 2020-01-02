import { Reporter, Actions, NodePluginArgs } from 'gatsby';

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
  getNodes: NodePluginArgs['getNodes'],
  createNode: Actions['createNode'],
  createNodeId: NodePluginArgs['createNodeId'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  notionLoader: NotionLoader,
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<void> {
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      localFile___NODE: fileNode.id,
    };
    createNode({
      ...item,
      id: assetNodeId,
      _id: assetNodeId,
      parent: undefined,
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `NotionPageAsset${pluginConfig.name}`,
      },
    });
  }
}
