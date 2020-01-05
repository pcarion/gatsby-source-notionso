import { NotionRenderFuncs, NotionRenderChild } from '../src/renderer';

export type FuncTestFactory = () => {
  renderFuncs: () => NotionRenderFuncs;
  toString(children: object[]): string;
};

export interface FuncTestFactoryChild extends NotionRenderChild {
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
        renderBlock: (
          type: string,
          children: NotionRenderChild[][],
        ): NotionRenderChild => {
          const parts: string[] = [];
          parts.push(`<${type}.x>`);
          children.forEach(child => {
            parts.push(`<${type}>${childrenToString(child)}</${type}>`);
          });
          parts.push(`</${type}.x>`);
          return { text: parts.join('') };
        },
      };
    },
    toString(children: object[]): string {
      return childrenToString(children);
    },
  };
};

export default renderFuncsForTests;
