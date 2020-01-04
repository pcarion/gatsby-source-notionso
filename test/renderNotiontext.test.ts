import renderNotionText, {
  NotionRenderFuncs,
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
];

type FuncTestFactory = () => {
  renderFuncs: () => NotionRenderFuncs;
  result: () => string;
};
const renderFuncsForTests: FuncTestFactory = () => {
  const items: string[] = [];
  return {
    renderFuncs(): NotionRenderFuncs {
      return {
        renderText: (text): void => {
          items.push(text);
        },
        renderTextAtt: (text, att): void => {
          items.push(`<${att}>${text}</${att}>`);
        },
        renderLink: (text, ref): void => {
          items.push(`<a href=\'${ref}'>${text}</a`);
        },
      };
    },
    result(): string {
      return items.join('');
    },
  };
};

describe('renderNotionText', () => {
  it('should render a simple string', () => {
    const factory = renderFuncsForTests();
    renderNotionText(
      [
        {
          text: "Let's ",
          atts: [],
        },
        {
          text: 'try',
          atts: [
            {
              att: 'i',
            },
          ],
        },
        {
          text: ' from here!',
          atts: [],
        },
      ],
      factory.renderFuncs(),
    );
    expect(factory.result()).toEqual("Let's <i>try</i> from here!");
  });

  it('should render fixtures', () => {
    fixtures.forEach(fixture => {
      const factory = renderFuncsForTests();
      renderNotionText(fixture.in, factory.renderFuncs());
      expect(factory.result()).toEqual(fixture.out);
    });
  });
});
