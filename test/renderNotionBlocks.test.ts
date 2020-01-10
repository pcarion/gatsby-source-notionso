import renderNotionBlocks from '../src/renderer/renderNotionBlocks';
import { NotionPageBlock } from '../src/types/notion';
import renderFuncsForTests from './renderFuncsForTests';

// for xml beaufifier: https://codebeautify.org/xmlviewer

type Fixtures = {
  pageId: string;
  in: NotionPageBlock[];
  out: string;
  skip: boolean;
}[];

const fixtures: Fixtures = [
  {
    skip: false,
    pageId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
    in: [
      {
        blockId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
        blockIds: [
          'a83d3b38-6d1e-4754-82cf-1397509b19fc',
          '791a43e2-2d34-49e5-b66a-922acf5daa86',
        ],
        type: 'page',
        attributes: [
          {
            att: 'pageIcon',
            value: '',
          },
        ],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'page 2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: 'a83d3b38-6d1e-4754-82cf-1397509b19fc',
        blockIds: [],
        type: 'text',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'para1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '791a43e2-2d34-49e5-b66a-922acf5daa86',
        blockIds: [],
        type: 'text',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'para2',
                atts: [],
              },
            ],
          },
        ],
      },
    ],
    out: `
    <page>
      <text>para1</text>
      <text>para2</text>
    </page>
    `,
  },
  {
    skip: false,
    pageId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
    in: [
      {
        blockId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
        blockIds: [
          '3c0878e1-e6c5-4e85-b757-8355262577bf',
          '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        ],
        type: 'page',
        attributes: [
          {
            att: 'pageIcon',
            value: '',
          },
        ],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'page 2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '3c0878e1-e6c5-4e85-b757-8355262577bf',
        blockIds: [
          '6664db04-32e0-4996-9a30-2a5e353c5902',
          '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
        ],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '6664db04-32e0-4996-9a30-2a5e353c5902',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list2',
                atts: [],
              },
            ],
          },
        ],
      },
    ],
    out: `
    <page>
      <bulleted_list>
        <bulleted_list__item>list1
          <bulleted_list>
            <bulleted_list__item>list1.1</bulleted_list__item>
            <bulleted_list__item>list1.2</bulleted_list__item>
          </bulleted_list>
        </bulleted_list__item>
        <bulleted_list__item>list2</bulleted_list__item>
      </bulleted_list>
    </page>
  `,
  },
  {
    skip: false,
    pageId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
    in: [
      {
        blockId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
        blockIds: [
          '3c0878e1-e6c5-4e85-b757-8355262577bf',
          '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        ],
        type: 'page',
        attributes: [
          {
            att: 'pageIcon',
            value: '',
          },
        ],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'page 2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '3c0878e1-e6c5-4e85-b757-8355262577bf',
        blockIds: [
          '6664db04-32e0-4996-9a30-2a5e353c5902',
          '699e463d-cfe1-458d-b146-05b2f8ba489d',
          '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
          '74870e62-22a3-4609-a0cc-74ac823262b3',
        ],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '6664db04-32e0-4996-9a30-2a5e353c5902',
        blockIds: [],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '699e463d-cfe1-458d-b146-05b2f8ba489d',
        blockIds: [],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '74870e62-22a3-4609-a0cc-74ac823262b3',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.3',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list2',
                atts: [],
              },
            ],
          },
        ],
      },
    ],
    out: `
    <page>
      <bulleted_list>
        <bulleted_list__item>list1
          <numbered_list>
            <numbered_list__item>n1.1</numbered_list__item>
            <numbered_list__item>n1.2</numbered_list__item>
          </numbered_list>
          <bulleted_list>
            <bulleted_list__item>list1.2</bulleted_list__item>
            <bulleted_list__item>list1.3</bulleted_list__item>
          </bulleted_list>
        </bulleted_list__item>
        <bulleted_list__item>list2</bulleted_list__item>
      </bulleted_list>
    </page>    `,
  },
  {
    skip: false,
    pageId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
    in: [
      {
        blockId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
        blockIds: [
          '3c0878e1-e6c5-4e85-b757-8355262577bf',
          '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        ],
        type: 'page',
        attributes: [
          {
            att: 'pageIcon',
            value: '',
          },
        ],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'page 2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '3c0878e1-e6c5-4e85-b757-8355262577bf',
        blockIds: [
          '6664db04-32e0-4996-9a30-2a5e353c5902',
          '699e463d-cfe1-458d-b146-05b2f8ba489d',
        ],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '6664db04-32e0-4996-9a30-2a5e353c5902',
        blockIds: [],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '699e463d-cfe1-458d-b146-05b2f8ba489d',
        blockIds: [
          '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
          '74870e62-22a3-4609-a0cc-74ac823262b3',
        ],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '74870e62-22a3-4609-a0cc-74ac823262b3',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.3',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list2',
                atts: [],
              },
            ],
          },
        ],
      },
    ],
    out: `
    <page>
      <bulleted_list>
        <bulleted_list__item>list1
          <numbered_list>
            <numbered_list__item>n1.1</numbered_list__item>
            <numbered_list__item>n1.2
              <bulleted_list>
                <bulleted_list__item>list1.2</bulleted_list__item>
                <bulleted_list__item>list1.3</bulleted_list__item>
              </bulleted_list>
            </numbered_list__item>
          </numbered_list>
        </bulleted_list__item>
        <bulleted_list__item>list2</bulleted_list__item>
      </bulleted_list>
    </page>
  `,
  },
  {
    skip: false,
    pageId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
    in: [
      {
        blockId: '517b209c-981e-439e-9b8f-bd04d4ca48a8',
        blockIds: [
          '3c0878e1-e6c5-4e85-b757-8355262577bf',
          '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        ],
        type: 'page',
        attributes: [
          {
            att: 'pageIcon',
            value: '',
          },
        ],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'page 2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '3c0878e1-e6c5-4e85-b757-8355262577bf',
        blockIds: [
          '6664db04-32e0-4996-9a30-2a5e353c5902',
          '699e463d-cfe1-458d-b146-05b2f8ba489d',
        ],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '6664db04-32e0-4996-9a30-2a5e353c5902',
        blockIds: [],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.1',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '699e463d-cfe1-458d-b146-05b2f8ba489d',
        blockIds: [
          '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
          '74870e62-22a3-4609-a0cc-74ac823262b3',
        ],
        type: 'numbered_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'n1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '1f21514e-b820-4ac5-972a-dfdcfc4403aa',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.2',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '74870e62-22a3-4609-a0cc-74ac823262b3',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list1.3',
                atts: [],
              },
            ],
          },
        ],
      },
      {
        blockId: '157cbd6b-a2ac-4dd1-b2d5-9c3e5eac6683',
        blockIds: [],
        type: 'bulleted_list',
        attributes: [],
        properties: [
          {
            propName: 'title',
            value: [
              {
                text: 'list2',
                atts: [],
              },
            ],
          },
        ],
      },
    ],
    out: `
    <page>
      <bulleted_list>
        <bulleted_list__item>list1
          <numbered_list>
            <numbered_list__item>n1.1</numbered_list__item>
            <numbered_list__item>n1.2
              <bulleted_list>
                <bulleted_list__item>list1.2</bulleted_list__item>
                <bulleted_list__item>list1.3</bulleted_list__item>
              </bulleted_list>
            </numbered_list__item>
          </numbered_list>
        </bulleted_list__item>
        <bulleted_list__item>list2</bulleted_list__item>
      </bulleted_list>
    </page>
    `,
  },
];

describe.skip('renderNotionBlocks', () => {
  it.each(fixtures)('text : %#', fixture => {
    const debug = false;
    if (!fixture.skip) {
      const factory = renderFuncsForTests(debug);
      const result = renderNotionBlocks(
        fixture.pageId,
        fixture.in,
        factory.renderFuncs(),
        debug,
      );
      expect(factory.childToString(result)).toEqual(
        fixture.out.replace(/[ \r\n]/g, ''),
      );
    }
  });
});
