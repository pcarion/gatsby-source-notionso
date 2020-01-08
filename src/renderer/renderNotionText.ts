import * as _ from 'lodash';
import { NotionPageText } from '../types/notion';
import { NotionRenderChild, NotionRenderFuncs } from './index';

type LinkTextSplit = { ref: string; items: NotionPageText[] };

function extractLink(item: NotionPageText): [NotionPageText, string] {
  // we copy the attributes because _.remove mutates the array
  const atts = item.atts ? [...item.atts] : [];
  const refAtts = _.remove(atts, a => a.att === 'a');
  const ref = refAtts.length > 0 ? refAtts[0].value || '' : '';
  return [{ text: item.text, atts }, ref];
}

// we split the blocks of text based on the link
// they are pointing to. The goal is to avoid the multiplcation
// of links in the resulting html if we use formating for the anchor
function splitPerLinks(items: NotionPageText[]): LinkTextSplit[] {
  const result: LinkTextSplit[] = [
    {
      ref: '',
      items: [],
    },
  ];
  let currentSplit = result[0];
  items.forEach(item => {
    const [itemNoLink, ref] = extractLink(item);
    if (ref === currentSplit.ref) {
      currentSplit.items.push(itemNoLink);
    } else {
      if (currentSplit.items.length === 0) {
        // the first slot was not actually used, so we overwrite it
        currentSplit.ref = ref;
      } else {
        currentSplit = {
          ref,
          items: [],
        };
        result.push(currentSplit);
      }
      currentSplit.items.push(itemNoLink);
    }
  });
  return result;
}

// starting from a given index, this function counts
// the number of consecutive items having the same attribute set
function lengthAttributeSequence(
  items: NotionPageText[],
  att: string,
  index: number,
): number {
  let count = 0;
  for (const ix = index; ix < items.length; ix++) {
    if (items[ix].atts.find(a => a.att === att)) {
      count++;
    } else {
      return count;
    }
  }
  return count;
}

interface AccumulatedStyle {
  content: NotionRenderChild;
  attributes: Record<string, number>;
}

// we want this kind of transformations:
// x:a y:b => a(x) b(y)
// x:ab y:b => b(a(x) y)
// x:a y:ab z:b => a(x b(y)) b(z) | a(x) b(a(y) z)
// x:a y:ab z:a => a(x b(y) z)
function renderTextItems(
  items: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
): NotionRenderChild[] {
  const children: NotionRenderChild[] = [];
  const accumulated: AccumulatedStyle[] = [];
  // first pass: we wrap the text and preare the data structure
  // to track the attributes sequences length
  items.forEach((item, index) => {
    const acc: AccumulatedStyle = {
      content: renderFuncs.wrapText(item.text),
      attributes: {},
    };
    item.atts.forEach(
      a =>
        (acc.attributes[a.att] = lengthAttributeSequence(items, a.att, index)),
    );
    accumulated.push(acc);
  });
  return children;
}

export default function renderNotionText(
  input: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
  debug = false,
): NotionRenderChild[] {
  const result: NotionRenderChild[] = [];
  // we can split the input based on the links
  // it contains
  const splits = splitPerLinks(input);
  if (debug) {
    console.log('splits:', JSON.stringify(splits, null, '  '));
  }
  splits.forEach(({ ref, items }) => {
    const children: NotionRenderChild[] = [];
    items.forEach(item => {
      if (!item.atts || item.atts.length === 0) {
        children.push(renderFuncs.wrapText(item.text));
      } else {
        // TODO: bug here - won't work with text with mutiple rendering attributes
        item.atts.forEach(a => {
          children.push(
            renderFuncs.renderTextAtt([renderFuncs.wrapText(item.text)], a.att),
          );
        });
      }
    });
    if (ref === '') {
      // no link, we push all the rendered piece
      children.forEach(c => result.push(c));
    } else {
      // we ahe a link: we pushed the rendered link
      result.push(renderFuncs.renderLink(children, ref));
    }
  });
  return result;
}
