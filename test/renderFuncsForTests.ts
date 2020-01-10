import {
  NotionRenderFuncs,
  NotionRenderChild,
  BlockMeta,
} from '../src/renderer';

export type FuncTestFactory = (
  debug?: boolean,
) => {
  renderFuncs: () => NotionRenderFuncs;
  childrenToString(children: object[]): string;
  childToString(children: object): string;
};

export interface FuncTestFactoryChild extends NotionRenderChild {
  text: string;
}

const renderFuncsForTests: FuncTestFactory = (debug = false) => {
  function childrenToString(children: object[]): string {
    const actualChildren = children as FuncTestFactoryChild[];
    return actualChildren.map(c => c.text || ('' as string)).join('');
  }
  function childToString(child: object): string {
    const actualChild = child as FuncTestFactoryChild;
    return actualChild.text;
  }

  return {
    renderFuncs(): NotionRenderFuncs {
      return {
        wrapText: (text): NotionRenderChild => {
          if (debug) {
            console.log('>renderFuncs>wrapText>text>', text);
          }
          return {
            text,
          };
        },
        renderTextAtt: (
          children: NotionRenderChild[],
          att,
        ): NotionRenderChild => {
          const text = `<${att}>${childrenToString(children)}</${att}>`;
          if (debug) {
            console.log('>renderFuncs>renderTextAtt>text>', text);
          }
          return { text };
        },
        renderLink: (children: NotionRenderChild[], ref): NotionRenderChild => {
          const text = `<a href=${ref}>${childrenToString(children)}</a>`;
          if (debug) {
            console.log('>renderFuncs>renderLink>text>', text, '>ref>', ref);
          }
          return { text };
        },
        renderBlock: (
          type: string,
          meta: BlockMeta,
          children: NotionRenderChild[],
        ): NotionRenderChild => {
          const parts: string[] = [];
          parts.push(`<${type}>`);
          children.forEach(child => {
            parts.push(childToString(child));
          });
          parts.push(`</${type}>`);
          if (debug) {
            console.log(
              '>renderFuncs>renderBlock>type>',
              type,
              '>parts>',
              JSON.stringify(parts),
            );
          }
          return { text: parts.join('') };
        },
      };
    },
    childrenToString(children: object[]): string {
      return childrenToString(children);
    },
    childToString(child: object): string {
      return childToString(child);
    },
  };
};

export default renderFuncsForTests;
