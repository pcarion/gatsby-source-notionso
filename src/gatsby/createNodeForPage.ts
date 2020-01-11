// import * as util from 'util';
import { Reporter, Actions, NodePluginArgs, NodeInput } from 'gatsby';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import {
  NotionLoader,
  NotionsoPluginOptions,
  NotionLoaderImageInformation,
  NotionLoaderImageResult,
} from '../types/notion';

import loadPage from '../notion/loadPage';

function findSignedUrlFromResult(
  imageUrl: string,
  result: NotionLoaderImageResult[],
): string | null {
  const item = result.find(r => r.imageUrl === imageUrl);
  if (!item) {
    return null;
  }
  return item.signedImageUrl;
}

export default async function createNodeForPage(
  pageId: string,
  rootPageId: string,
  title: string,
  index: number,
  notionLoader: NotionLoader,
  createNodeId: NodePluginArgs['createNodeId'],
  createNode: Actions['createNode'],
  createContentDigest: NodePluginArgs['createContentDigest'],
  store: NodePluginArgs['store'],
  cache: NodePluginArgs['cache'],
  pluginConfig: NotionsoPluginOptions,
  reporter: Reporter,
): Promise<object | null> {
  try {
    // loading page
    const item = await loadPage(
      pageId,
      rootPageId,
      index,
      notionLoader,
      reporter,
    );
    const imagesToDownload: NotionLoaderImageInformation[] = [];
    // we retrieve the list of iamges to download for the page
    for (const image of item.images) {
      imagesToDownload.push({
        imageUrl: image.notionUrl,
        contentId: image.contentId,
      });
    }
    const imagesResult = await notionLoader.downloadImages(imagesToDownload);
    reporter.info(`Images for notion source: ${JSON.stringify(imagesResult)}`);
    const imageNodeIds: string[] = [];

    // we build a node per image
    for (const image of item.images) {
      // we find the signed url for that image
      const signedUrl = findSignedUrlFromResult(image.notionUrl, imagesResult);
      if (!signedUrl) {
        reporter.error(
          `cound not find signed URL for ${JSON.stringify(image)}`,
        );
      } else {
        const fileNode = await createRemoteFileNode({
          url: signedUrl,
          store,
          cache,
          createNode,
          createNodeId,
          reporter,
        });

        const imageItem = {
          imageUrl: image.notionUrl,
          contentId: image.contentId,
          pageId: image.pageId,
        };
        const imageNodeId = createNodeId(image.notionUrl);
        const imageNode: NodeInput = {
          ...imageItem,
          // check:
          // https://www.gatsbyjs.org/docs/node-creation/#foreign-key-reference-___node
          // https://www.gatsbyjs.org/docs/schema-gql-type#foreign-key-reference-___node
          // eslint-disable-next-line @typescript-eslint/camelcase
          localFile___NODE: fileNode.id,
          id: imageNodeId,
          _id: imageNodeId,
          parent: undefined,
          children: [],
          internal: {
            contentDigest: createContentDigest(imageItem),
            type: `NotionPageImage${pluginConfig.name}`,
          },
        };
        // we keep a reference on that nodeId
        imageNodeIds.push(imageNodeId);
        await createNode(imageNode);
      }
    }
    const nodeId = createNodeId(pageId);
    // we delete the images property because
    // we want to use the reference to the actual nodes
    delete item.images;

    const node = {
      ...item,
      imageNodeIds,
      indexPage: index,
      id: nodeId,
      _id: nodeId,
      title,
      parent: undefined,
      // eslint-disable-next-line @typescript-eslint/camelcase
      imageNodes___NODE: imageNodeIds, // https://github.com/gatsbyjs/gatsby/issues/3793
      children: [],
      internal: {
        contentDigest: createContentDigest(item),
        type: `NotionPage${pluginConfig.name}`,
      },
    };
    await createNode(node);
    return node;
  } catch (err) {
    reporter.error(`Error loading page: ${pageId} - error is: ${err.message}`);
    return null;
  }
}
