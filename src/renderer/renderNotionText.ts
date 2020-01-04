import { NotionPageText } from '../types/notion';

/*
     "value": [
      {
       "text": "Let's ",
       "atts": []
      },
      {
       "text": "try",
       "atts": [
        {
         "att": "i",
         "value": null
        }
       ]
      },
      {
       "text": " from here!",
       "atts": []
      }
     ]
*/

export interface NotionRenderFuncs {
  renderText: (text: string) => void;
  renderTextAtt: (text: string, att: string) => void;
  renderLink: (text: string, ref: string) => void;
}

export default function renderNotionText(
  items: NotionPageText[],
  renderFuncs: NotionRenderFuncs,
): void {
  items.forEach(item => {
    if (!item.atts || item.atts.length === 0) {
      renderFuncs.renderText(item.text);
    } else {
      item.atts.forEach(a => {
        if (a.att === 'a') {
          // we have a link here
          const ref = a.value;
          if (ref) {
            renderFuncs.renderLink(item.text, ref);
          } else {
            renderFuncs.renderTextAtt(item.text, a.att);
          }
        } else {
          renderFuncs.renderTextAtt(item.text, a.att);
        }
      });
    }
  });
}
