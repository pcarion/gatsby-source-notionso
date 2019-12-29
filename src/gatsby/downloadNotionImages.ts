import * as util from 'util';

// import { createRemoteFileNode } from 'gatsby-source-filesystem';
import { GatsbyGetNodes, GatsbyReporter } from '../types/gatsby';
import '../types/notion';

export default async function downloadNotionImages(
  getNodes: GatsbyGetNodes,
  notionLoader: NotionLoader,
  reporter: GatsbyReporter,
): Promise<void> {
  const imagesNodes = getNodes().filter(n => {
    return n.internal && n.internal.owner === 'gatsby-source-notionso';
  });
  console.log('@@@ imagesNodes #', imagesNodes.length);

  //         await notionLoader.downloadImage(blockData.sourceUrl, contentId);

  const imagesToDownload: [string, string][] = [];
  await Promise.all(
    imagesNodes.map(async node => {
      console.log(
        '@@@ look for images:',
        util.inspect(node, {
          colors: true,
          depth: null,
        }),
      );
      ((node.images as ImageDescription[]) || []).forEach(image => {
        console.log(image.notionUrl);
        imagesToDownload.push([image.notionUrl, image.contentId]);
      });
    }),
  );
  console.log('@@@ images to download:', imagesToDownload);
  const result = await notionLoader.downloadImages(imagesToDownload);
  reporter.info(`Images for notion source: ${result}`);
  console.log('@@@ done with downloadNotionImages');
}
