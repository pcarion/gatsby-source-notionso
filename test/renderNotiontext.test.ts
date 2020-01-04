import renderNotionText, {
  NotionRenderFuncs,
} from '../src/renderer/renderNotionText';

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
});
