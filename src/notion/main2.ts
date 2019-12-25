import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';

console.log('Hello world!');

// fetch("https://www.notion.so/api/v3/getRecordValues", {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"requests\":[{\"table\":\"block\",\"id\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\"}]}","method":"POST","mode":"cors"});

/*
{requests: [{table: "block", id: "e1f2d14b-4254-4c39-a7b5-28545e0feebd"}]}
requests: [{table: "block", id: "e1f2d14b-4254-4c39-a7b5-28545e0feebd"}]
0: {table: "block", id: "e1f2d14b-4254-4c39-a7b5-28545e0feebd"}
table: "block"
id: "e1f2d14b-4254-4c39-a7b5-28545e0feebd"

*/

// fetch("https://www.notion.so/api/v3/loadPageChunk", {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"pageId\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\",\"limit\":50,\"cursor\":{\"stack\":[]},\"chunkNumber\":0,\"verticalColumns\":false}","method":"POST","mode":"cors"});

const urlLoadPageChunk = 'https://www.notion.so/api/v3/loadPageChunk';

const pageId = 'e1f2d14b-4254-4c39-a7b5-28545e0feebd';

const dataForPageId = (pageId: string) => ({
  pageId: pageId,
  limit: 100000,
  cursor: { stack: [] },
  chunkNumber: 0,
  verticalColumns: false,
});

const options: AxiosRequestConfig = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    credentials: 'include',
    headers: { accept: '*/*', 'accept-language': 'en-US,en;q=0.9,fr;q=0.8' },
  },
  data: JSON.stringify(dataForPageId(pageId), null, 0),
  url: urlLoadPageChunk,
};
// {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"requests\":[{\"table\":\"block\",\"id\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\"}]}","method":"POST","mode":"cors"});

axios(options)
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

// fetch("", {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"requests\":[{\"table\":\"block\",\"id\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\"}]}","method":"POST","mode":"cors"});
