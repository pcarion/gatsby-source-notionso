import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';
import { GatsbyReporter } from '../types/gatsby';
import '../types/notion';

export default function notionLoader(
  reporter: GatsbyReporter,
  debug = true,
): NotionLoader {
  const _blockDict: Record<string, Json> = {};

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
          // we store the blocks
          Object.keys(
            response &&
              response.data &&
              response.data.recordMap &&
              response.data.recordMap.block,
          ).forEach(key => {
            _blockDict[key] = response.data.recordMap.block[key];
          });
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
    downloadImage(imageUrl: string, contentId: string): Promise<void> {
      const urlGetSignedFileUrls =
        'https://www.notion.so/api/v3/getSignedFileUrls';

      const dataForUrls = {
        urls: [
          {
            url: imageUrl,
            permissionRecord: {
              table: 'block',
              id: contentId,
            },
          },
        ],
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

      return axios(options)
        .then(function(response) {
          console.log('Response:');
          if (response.status !== 200) {
            console.log(response);
          } else {
            console.log(
              util.inspect(response.data, {
                colors: true,
                depth: null,
              }),
            );
          }
        })
        .catch(function(error) {
          console.log('Error:');
          console.log(error);
        })
        .finally(function() {
          console.log('DONE');
          console.log(options);
          // always executed
        });
    },
    getBlockById(blockId: string): Json {
      return _blockDict[blockId];
    },
  };
}
