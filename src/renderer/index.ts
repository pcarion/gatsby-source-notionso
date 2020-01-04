type NotionRendererParam = {
  notionPage: object;
  allNotionPageAsset: object;
};

type NotionPageRenderer = {
  render: () => void;
};

type NotionPageRendererFactory = (
  arg: NotionRendererParam,
) => NotionPageRenderer;

const renderer: NotionPageRendererFactory = ({
  notionPage,
  allNotionPageAsset,
}) => {
  return {
    render: (): void => {
      console.log('From: gatsy-source-notionso/renderer:');
      console.log('notionPage:', notionPage);
      console.log('allNotionPageAsset:', allNotionPageAsset);
    },
  };
};

export default renderer;

/* {
 "blocks": [
  {
   "blockId": "718ddd99-2bec-4d47-917c-bb075a216340",
   "blockIds": [
    "746c125f-7f07-4950-980a-eeba2af3c626",
    "4391a4c8-d47a-499e-afd4-dd287a9504b7",
    "fa20c5d7-bd87-486d-a614-b7092fe0519e"
   ],
   "type": "page",
   "attributes": [
    {
     "att": "pageIcon",
     "value": "✒️"
    }
   ],
   "properties": [
    {
     "propName": "title",
     "value": [
      {
       "text": "test page",
       "atts": []
      }
     ]
    }
   ]
  },
  {
   "blockId": "746c125f-7f07-4950-980a-eeba2af3c626",
   "blockIds": [],
   "type": "text",
   "attributes": [],
   "properties": [
    {
     "propName": "title",
     "value": [
      {
       "text": "Let's ",
       "atts": []
      },
      {
       "text": "try",
       "atts": [
        {
         "att": "i",
         "value": null
        }
       ]
      },
      {
       "text": " from here!",
       "atts": []
      }
     ]
    }
   ]
  },
  {
   "blockId": "4391a4c8-d47a-499e-afd4-dd287a9504b7",
   "blockIds": [],
   "type": "text",
   "attributes": [],
   "properties": []
  },
  {
   "blockId": "fa20c5d7-bd87-486d-a614-b7092fe0519e",
   "blockIds": [],
   "type": "image",
   "attributes": [
    {
     "att": "width",
     "value": "2447"
    },
    {
     "att": "aspectRatio",
     "value": "0.6943195749897834"
    }
   ],
   "properties": [
    {
     "propName": "source",
     "value": [
      {
       "text": "https://s3-us-west-2.amazonaws.com/secure.notion-static.com/443cca18-4fd5-402e-aa6f-94815965a547/alphabet.png",
       "atts": []
      }
     ]
    }
   ]
  }
 ],
 "createdAt": "2020-01-04T16:10:55.572Z",
 "pageId": "718ddd99-2bec-4d47-917c-bb075a216340",
 "slug": "1",
 "title": "test page",
 "isDraft": false,
 "id": "69dbe8bf-3baa-51da-afde-e4c2e9c473e4",
 "indexPage": 1
}
*/
