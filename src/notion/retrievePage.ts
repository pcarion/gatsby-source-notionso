import { Reporter } from 'gatsby';
import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';

const urlGetRecordCalues = 'https://www.notion.so/api/v3/getRecordValues';

export default async function retrievePage(
  pageId: string,
  reporter: Reporter,
): Promise<void> {
  const data = {
    requests: [{ table: 'block', id: pageId }],
  };
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      credentials: 'include',
      headers: { accept: '*/*', 'accept-language': 'en-US,en;q=0.9,fr;q=0.8' },
    },
    data: JSON.stringify(data, null, 0),
    url: urlGetRecordCalues,
  };
  // {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"requests\":[{\"table\":\"block\",\"id\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\"}]}","method":"POST","mode":"cors"});

  reporter.info(`retrieving notion data: ${JSON.stringify(options, null, '')}`);
  return axios(options)
    .then(function(response) {
      console.log('Response:');
      if (response.status !== 200) {
        reporter.error(
          `error retrieving data from notion. status=${response.status}`,
        );
        throw new Error(`Error retrieving data - status: ${response.status}`);
      }
      reporter.info(
        util.inspect(response.data.results, {
          colors: true,
          depth: null,
        }),
      );
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
