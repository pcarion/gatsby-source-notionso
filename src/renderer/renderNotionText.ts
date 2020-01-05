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
        item.atts.forEach(a => {
          children.push(
            renderFuncs.renderTextAtt([renderFuncs.wrapText(item.text)], a.att),
          );
        });
      }
    });
    if (ref === '') {
      children.forEach(c => result.push(c));
    } else {
      result.push(renderFuncs.renderLink(children, ref));
    }
  });
  return result;
}
