import * as util from 'util';
import { Reporter, Actions, NodePluginArgs } from 'gatsby';

import { createRemoteFileNode } from 'gatsby-source-filesystem';
import {
  NotionLoader,
  ImageDescription,
  GatsbyNotionsoNode,
} from '../types/notion';

// reference:
// https://www.gatsbyjs.org/packages/gatsby-source-filesystem/#createremotefilenode

export default async function downloadNotionImages(
  getNodes: NodePluginArgs['getNodes'],
  createNode: Actions['createNode'],
  createNodeId: NodePluginArgs['createNodeId'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  notionLoader: NotionLoader,
  reporter: Reporter,
): Promise<void> {
  const imagesNodes: GatsbyNotionsoNode[] = getNodes().filter(
    (n: GatsbyNotionsoNode) => {
      return n.internal && n.internal.owner === 'gatsby-source-notionso';
    },
  );

  const imagesToDownload: [string, string][] = [];
  await Promise.all(
    imagesNodes.map(async node => {
      ((node.images as ImageDescription[]) || []).forEach(image => {
        console.log(image.notionUrl);
        imagesToDownload.push([image.notionUrl, image.contentId]);
      });
    }),
  );
  console.log('@@@ images to download:', imagesToDownload);
  const result = await notionLoader.downloadImages(imagesToDownload);
  reporter.info(`Images for notion source: ${result}`);

  for (const img of result) {
    const [notionUrl, signedUrl] = img;
    const fileNode = await createRemoteFileNode({
      url: signedUrl,
      store,
      cache,
      createNode,
      createNodeId,
      reporter,
    });
    console.log('@@@ notionUrl:', notionUrl);
    console.log(
      '@@@@ fileNode:',
      util.inspect(fileNode, {
        colors: true,
        depth: null,
      }),
    );
  }
  console.log('@@@ done with downloadNotionImages');
}
