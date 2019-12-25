import * as util from 'util';
import axios, { AxiosRequestConfig } from 'axios';

console.log('Hello world!');

// fetch("https://www.notion.so/api/v3/getSignedFileUrls", {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{\"urls\":[{\"url\":\"https://s3-us-west-2.amazonaws.com/secure.notion-static.com/436b6c37-9fa0-4347-a34d-fc2fc9fd1538/basic-usage.svg\",\"permissionRecord\":{\"table\":\"block\",\"id\":\"b6c6dd42-79a1-4838-bce1-a42d5a3dd52a\"}}]}","method":"POST","mode":"cors"});

const urlGetSignedFileUrls = 'https://www.notion.so/api/v3/getSignedFileUrls';

const dataForUrls = {
  urls: [
    {
      url:
        'https://s3-us-west-2.amazonaws.com/secure.notion-static.com/436b6c37-9fa0-4347-a34d-fc2fc9fd1538/basic-usage.svg',
      permissionRecord: {
        table: 'block',
        id: 'b6c6dd42-79a1-4838-bce1-a42d5a3dd52a',
      },
    },
  ],
};

const options: AxiosRequestConfig = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    credentials: 'include',
    headers: { accept: '*/*', 'accept-language': 'en-US,en;q=0.9,fr;q=0.8' },
  },
  data: JSON.stringify(dataForUrls, null, 0),
  url: urlGetSignedFileUrls,
};
// {"credentials":"include","headers":{"accept":"*/*","accept-language":"en-US,en;q=0.9,fr;q=0.8","content-type":"application/json","notion-client-version":"21.2.131","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://www.notion.so/Git-internals-e1f2d14b42544c39a7b528545e0feebd","referrerPolicy":"same-origin","body":"{"requests\":[{\"table\":\"block\",\"id\":\"e1f2d14b-4254-4c39-a7b5-28545e0feebd\"}]}","method":"POST","mode":"cors"});

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
