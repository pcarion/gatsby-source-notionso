import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';
import { Reporter } from 'gatsby';
import { NotionLoader, NotionPageBlock } from '../types/notion';
import recordMapToBlocks from './parser/recordMapToBlocks';

interface NotionApiDownloadInfo {
  url: string;
  permissionRecord: {
    table: string;
    id: string;
  };
}
export default function notionLoader(
  reporter: Reporter,
  debug = true,
): NotionLoader {
  let _blocks: NotionPageBlock[] = [];

  return {
    loadPage: async (pageId: string): Promise<void> => {
      const urlLoadPageChunk = 'https://www.notion.so/api/v3/loadPageChunk';

      const data = {
        pageId: pageId,
        limit: 100000,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      };

      const options: AxiosRequestConfig = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          credentials: 'include',
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
          },
        },
        data: JSON.stringify(data, null, 0),
        url: urlLoadPageChunk,
      };
      reporter.info(
        `retrieving notion data: ${JSON.stringify(options, null, '')}`,
      );
      return axios(options)
        .then(function(response) {
          if (response.status !== 200) {
            reporter.error(
              `error retrieving data from notion. status=${response.status}`,
            );
            throw new Error(
              `Error retrieving data - status: ${response.status}`,
            );
          }
          if (debug) {
            const data = util.inspect(response.data, {
              colors: true,
              depth: null,
            });
            reporter.info(`response is: ${data}`);
          }
          // we parse the blocks
          recordMapToBlocks(
            (response && response.data && response.data.recordMap) || {},
            _blocks,
          );
        })
        .catch(function(error) {
          reporter.error(`Error retrieving data: ${error}`);
          throw error;
        })
        .finally(function() {
          if (debug) {
            console.log('DONE');
            console.log(options);
          }
        });
    },
    downloadImages(
      images: [string, string, string][],
    ): Promise<[string, string, string][]> {
      const urlGetSignedFileUrls =
        'https://www.notion.so/api/v3/getSignedFileUrls';
      const urls: NotionApiDownloadInfo[] = [];
      images.forEach(([imageUrl, contentId]) => {
        urls.push({
          url: imageUrl,
          permissionRecord: {
            table: 'block',
            id: contentId,
          },
        });
      });

      const dataForUrls = {
        urls,
      };

      const options: AxiosRequestConfig = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          credentials: 'include',
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
          },
        },
        data: JSON.stringify(dataForUrls, null, 0),
        url: urlGetSignedFileUrls,
      };

      const result: [string, string, string][] = [];

      return axios(options)
        .then(function(response) {
          if (response.status !== 200) {
            reporter.error(
              `Error retrieving images ${images} , status is: ${response.status}`,
            );
          } else {
            console.log(
              util.inspect(response.data, {
                colors: true,
                depth: null,
              }),
            );
            (
              (response &&
                response.data &&
                (response.data.signedUrls as string[])) ||
              ([] as string[])
            ).forEach((signedUrl, index) => {
              result.push([images[index][0], signedUrl, images[index][2]]);
            });
          }
          return result;
        })
        .catch(function(error) {
          console.log('Error:');
          console.log(error);
          return result;
        })
        .finally(function() {
          console.log('DONE');
          console.log(options);
        });
    },
    getBlockById(blockId: string): NotionPageBlock | undefined {
      return _blocks.find(b => b.blockId === blockId);
    },
    getBlocks(copyTo: NotionPageBlock[], pageId: string): void {
      //_blocks.forEach(b => copyTo.push(b));
      _blocks.filter(b => b.blockId !== pageId).forEach(b => copyTo.push(b));
    },
    reset(): void {
      _blocks = [];
    },
  };
}
