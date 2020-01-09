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
  index: number,
  att: string,
): number {
  let count = 0;
  for (let ix = index; ix < items.length; ix++) {
    if (items[ix].atts.find(a => a.att === att)) {
      count++;
    } else {
      return count;
    }
  }
  return count;
}

type AttributesCount = Record<string, number>;

type MaxCounter = [number, number, string];

function removeAttributeFromItem(item: NotionPageText, attName: string): void {
  const ix = item.atts.findIndex(a => a.att === attName);
  if (ix < 0) {
    throw new Error(
      `could not find attrubute ${attName} in ${JSON.stringify(item)}`,
    );
  }
  item.atts.splice(ix, 1);
}

// may be a method exists in the std lib for Array
function extractSubSlices(
  items: NotionPageText[],
  from: number,
  to: number,
): NotionPageText[] {
  const result: NotionPageText[] = [];
  for (let ix = from; ix < to; ix++) {
    result.push(items[ix]);
  }
  return result;
}

function renderSlices(
  items: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
): NotionRenderChild[] {
  // quick optimization: if no items in the sequence has any attributes
  // then we can quickly return!
  const hasAtLEastOneAttribute = !!items.find(item => item.atts.length > 0);
  if (!hasAtLEastOneAttribute) {
    return items.map(item => renderFuncs.wrapText(item.text));
  }
  // first pass we count the different sequences length
  const attCounts: AttributesCount[] = [];
  // for each attribute, for each item, we count the consecutive number items with
  // the same attribute set
  // we will use the longest sequence to be rendered last
  items.forEach((item, index) => {
    const counter: AttributesCount = {};
    attCounts.push(counter);
    item.atts.forEach(
      a => (counter[a.att] = lengthAttributeSequence(items, index, a.att)),
    );
  });
  // let's find the longest sequence
  // [0]: max seq length
  // [1]: position where this seq appears
  // [2]: associated attribute
  const max: MaxCounter = [0, 0, ''];
  attCounts.forEach((counter, index) => {
    for (const key in counter) {
      if (counter[key] > max[0]) {
        max[0] = counter[key];
        max[1] = index;
        max[2] = key;
      }
    }
  });
  if (max[0] === 1) {
    // this means that the sequences are at the most 1
    // item long that means that there is no need to
    // compose them in any specific way
    return items.map(item => {
      return item.atts.reduce<NotionRenderChild>((child, a) => {
        return renderFuncs.renderTextAtt([child], a.att);
      }, renderFuncs.wrapText(item.text));
    });
  }

  // final case, at least one section has a sequence of attributes
  const result: NotionRenderChild[] = [];
  const [length, index0, attName] = max;
  if (index0 > 0) {
    const subslices = extractSubSlices(items, 0, index0);
    result.push(renderSlices(subslices, renderFuncs));
  }
  // for the sequence in question, we need first to remove the attribute
  // from the list of attributes before doing the (sub) rendering
  const subslices = extractSubSlices(items, index0, index0 + length);
  for (let ix = 0; ix < subslices.length; ix++) {
    removeAttributeFromItem(subslices[ix], attName);
  }
  result.push(
    renderFuncs.renderTextAtt(renderSlices(subslices, renderFuncs), attName),
  );

  // and we render the last chunk
  if (index0 + length < items.length) {
    const subslices = extractSubSlices(items, index0 + length, items.length);
    result.push(renderSlices(subslices, renderFuncs));
  }
  return result;
}

// we want this kind of transformations:
// x:a y:b => a(x) b(y)
// x:ab y:b => b(a(x) y)
// x:a y:ab z:b => a(x b(y)) b(z) | a(x) b(a(y) z)
// x:a y:ab z:a => a(x b(y) z)
// x:a y:ab z:b t:b => a(x) b(y(a) z t)
function renderTextItems(
  items: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
): NotionRenderChild[] {
  return renderSlices(items, renderFuncs);
}

export default function renderNotionText(
  input: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
  debug = false,
): NotionRenderChild[] {
  const result: NotionRenderChild[] = [];
  // we can split the input based on the links
  // it contains
  // we need that as links texts cannnot be rendered across links
  // each link test must be renderede independently from the others
  const splits = splitPerLinks(input);
  if (debug) {
    console.log('splits:', JSON.stringify(splits, null, '  '));
  }
  splits.forEach(({ ref, items }) => {
    const children: NotionRenderChild[] = renderTextItems(items, renderFuncs);
    if (ref === '') {
      // no link, we push all the rendered piece
      children.forEach(c => result.push(c));
    } else {
      // we have a link: we pushed the rendered link
      result.push(renderFuncs.renderLink(children, ref));
    }
  });
  return result;
}
