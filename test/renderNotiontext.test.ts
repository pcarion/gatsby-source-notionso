import renderNotionText from '../src/renderer/renderNotionText';
import { NotionPageText } from '../src/types/notion';
import renderFuncsForTests from './renderFuncsForTests';

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
        text: 'This is a ',
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
    out:
      "let's consider <a href=https://www.google.com>a link with </a><a href=https://www.bing.com>a link</a><a href=https://www.google.com> in the anchor</a>, will you?",
  },
  {
    in: [
      {
        text: 'This is a ',
        atts: [
          {
            att: 'a',
            value: 'https://dev.null',
          },
        ],
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
    ],
    out: '<a href=https://dev.null>This is a very nice link</a>',
  },
];

describe('renderNotionText', () => {
  it('should render', () => {
    const factory = renderFuncsForTests();
    const result = renderNotionText(
      [
        {
          text: 'This is a ',
          atts: [
            {
              att: 'a',
              value: 'https://dev.null',
            },
          ],
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
      ],
      factory.renderFuncs(),
    );
    expect(factory.toString(result)).toEqual(
      '<a href=https://dev.null>This is a very nice link</a>',
    );
  });

  it.each(fixtures)('text : %#', fixture => {
    const factory = renderFuncsForTests();
    const result = renderNotionText(fixture.in, factory.renderFuncs());
    expect(factory.toString(result)).toEqual(fixture.out);
  });
});
