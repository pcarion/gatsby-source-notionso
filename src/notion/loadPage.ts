import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';
import { GatsbyReporter } from '../types/gatsby';

const urlLoadPageChunk = 'https://www.notion.so/api/v3/loadPageChunk';

export default async function loadPage(
  pageId: string,
  reporter: GatsbyReporter,
): Promise<void> {
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
      headers: { accept: '*/*', 'accept-language': 'en-US,en;q=0.9,fr;q=0.8' },
    },
    data: JSON.stringify(data, null, 0),
    url: urlLoadPageChunk,
  };
  reporter.info(`retrieving notion data: ${JSON.stringify(options, null, '')}`);
  return axios(options)
    .then(function(response) {
      if (response.status !== 200) {
        reporter.error(
          `error retrieving data from notion. status=${response.status}`,
        );
        throw new Error(`Error retrieving data - status: ${response.status}`);
      }
      const data = util.inspect(response.data, {
        colors: true,
        depth: null,
      });
      reporter.info(`response is: ${data}`);
    })
    .catch(function(error) {
      reporter.error(`Error retrieving data: err: ${error}`);
      throw error;
    })
    .finally(function() {
      console.log('DONE');
      console.log(options);
      // always executed
    });
}
