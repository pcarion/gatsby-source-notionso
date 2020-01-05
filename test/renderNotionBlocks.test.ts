import renderNotionBlocks from '../src/renderer/renderNotionBlocks';
import { NotionPageBlock } from '../src/types/notion';
import renderFuncsForTests from './renderFuncsForTests';

type Fixtures = { pageId: string; in: NotionPageBlock[]; out: string }[];

const fixtures: Fixtures = [
  {
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
    out: '<text.x><text>para1</text><text>para2</text></text.x>',
  },
];

describe('renderNotionBlocks', () => {
  it.each(fixtures)('text : %#', fixture => {
    const factory = renderFuncsForTests();
    const result = renderNotionBlocks(
      fixture.pageId,
      fixture.in,
      factory.renderFuncs(),
    );
    expect(factory.toString(result)).toEqual(fixture.out);
  });
});
