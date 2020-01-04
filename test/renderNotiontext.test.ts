import renderNotionText, {
  NotionRenderFuncs,
  NotionRenderChild,
} from '../src/renderer/renderNotionText';

import { NotionPageText } from '../src/types/notion';

type Fixtures = { in: NotionPageText[]; out: string }[];

const fixtures: Fixtures = [
  {
    in: [
      {
        text: 'my tailor is rich',
        atts: [],
      },
    ],
    out: 'my tailor is rich',
  },
  {
    in: [
      {
        text: 'my ',
        atts: [],
      },
      {
        text: 'tailor',
        atts: [
          {
            att: 'i',
          },
        ],
      },
      {
        text: ' is rich',
        atts: [],
      },
    ],
    out: 'my <i>tailor</i> is rich',
  },
  {
    in: [
      {
        text: 'my tailor ',
        atts: [],
      },
      {
        text: 'is',
        atts: [
          {
            att: 'b',
          },
        ],
      },
      {
        text: ' rich',
        atts: [],
      },
    ],
    out: 'my tailor <b>is</b> rich',
  },
  {
    in: [
      {
        text: 'my ',
        atts: [],
      },
      {
        text: 'tailor',
        atts: [
          {
            att: 'i',
          },
        ],
      },
      {
        text: ' ',
        atts: [],
      },
      {
        text: 'is',
        atts: [
          {
            att: 'b',
          },
        ],
      },
      {
        text: ' rich',
        atts: [],
      },
    ],
    out: 'my <i>tailor</i> <b>is</b> rich',
  },
  {
    in: [
      {
        text: 'my ',
        atts: [],
      },
      {
        text: 'tailor',
        atts: [
          {
            att: 's',
          },
        ],
      },
      {
        text: ' is ',
        atts: [],
      },
      {
        text: 'rich',
        atts: [
          {
            att: 'b',
          },
        ],
      },
    ],
    out: 'my <s>tailor</s> is <b>rich</b>',
  },
  {
    in: [
      {
        text: 'my tailor is rich',
        atts: [
          {
            att: 'b',
          },
        ],
      },
    ],
    out: '<b>my tailor is rich</b>',
  },
  {
    in: [
      {
        text: 'my',
        atts: [
          {
            att: 'b',
          },
        ],
      },
      {
        text: ' ',
        atts: [],
      },
      {
        text: 'tailor',
        atts: [
          {
            att: 'i',
          },
        ],
      },
      {
        text: ' ',
        atts: [],
      },
      {
        text: 'is',
        atts: [
          {
            att: 's',
          },
        ],
      },
      {
        text: ' ',
        atts: [],
      },
      {
        text: 'rich',
        atts: [
          {
            att: 'b',
          },
        ],
      },
    ],
    out: '<b>my</b> <i>tailor</i> <s>is</s> <b>rich</b>',
  },
  {
    in: [
      {
        text: 'This is a ',
        atts: [],
      },
      {
        text: 'link',
        atts: [
          {
            att: 'a',
            value: 'https://www.google.com',
          },
        ],
      },
      {
        text: '.',
        atts: [],
      },
    ],
    out: 'This is a <a href=https://www.google.com>link</a>.',
  },
  {
    in: [
      {
        text: 'This a ',
        atts: [],
      },
      {
        text: 'very ',
        atts: [
          {
            att: 'a',
            value: 'https://dev.null',
          },
        ],
      },
      {
        text: 'nice',
        atts: [
          {
            att: 'b',
          },
          {
            att: 'a',
            value: 'https://dev.null',
          },
        ],
      },
      {
        text: ' link',
        atts: [
          {
            att: 'a',
            value: 'https://dev.null',
          },
        ],
      },
      {
        text: '.',
        atts: [],
      },
    ],
    out: 'This is a <a href=https://dev.null>very <b>nice</b> link</a>.',
  },
  {
    in: [
      {
        text: "let's consider ",
        atts: [],
      },
      {
        text: 'a link with ',
        atts: [
          {
            att: 'a',
            value: 'https://www.google.com',
          },
        ],
      },
      {
        text: 'a link',
        atts: [
          {
            att: 'a',
            value: 'https://www.bing.com',
          },
        ],
      },
      {
        text: ' in the anchor',
        atts: [
          {
            att: 'a',
            value: 'https://www.google.com',
          },
        ],
      },
      {
        text: ', will you?',
        atts: [],
      },
    ],
    out: 'not yet',
  },
];

type FuncTestFactory = () => {
  renderFuncs: () => NotionRenderFuncs;
  toString(children: object[]): string;
};

interface FuncTestFactoryChild extends NotionRenderChild {
  text: string;
}

const renderFuncsForTests: FuncTestFactory = () => {
  function childrenToString(children: object[]): string {
    const actualChildren = children as FuncTestFactoryChild[];
    return actualChildren.map(c => c.text || ('' as string)).join('');
  }
  return {
    renderFuncs(): NotionRenderFuncs {
      return {
        wrapText: (text): NotionRenderChild => {
          return {
            text,
          };
        },
        renderTextAtt: (
          children: NotionRenderChild[],
          att,
        ): NotionRenderChild => {
          const text = `<${att}>${childrenToString(children)}</${att}>`;
          return { text };
        },
        renderLink: (children: NotionRenderChild[], ref): NotionRenderChild => {
          const text = `<a href=${ref}>${childrenToString(children)}</a>`;
          return { text };
        },
      };
    },
    toString(children: object[]): string {
      return childrenToString(children);
    },
  };
};

describe('renderNotionText', () => {
  it('should render', () => {
    const factory = renderFuncsForTests();
    const result = renderNotionText(
      [
        {
          text: 'This a ',
          atts: [],
        },
        {
          text: 'very ',
          atts: [
            {
              att: 'a',
              value: 'https://dev.null',
            },
          ],
        },
        {
          text: 'nice',
          atts: [
            {
              att: 'b',
            },
            {
              att: 'a',
              value: 'https://dev.null',
            },
          ],
        },
        {
          text: ' link',
          atts: [
            {
              att: 'a',
              value: 'https://dev.null',
            },
          ],
        },
        {
          text: '.',
          atts: [],
        },
      ],
      factory.renderFuncs(),
    );
    expect(factory.toString(result)).toEqual(
      'This is a <a href=https://dev.null>very <b>nice</b> link</a>.',
    );
  });

  it.skip('should render fixtures', () => {
    fixtures.forEach(fixture => {
      const factory = renderFuncsForTests();
      const result = renderNotionText(fixture.in, factory.renderFuncs());
      expect(factory.toString(result)).toEqual(fixture.out);
    });
  });
});
