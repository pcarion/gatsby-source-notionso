import { NotionText, NotionPageText } from '../../types/notion';

/*
Example:
[
  [ 'This is ' ],
  [ 'bold', [ [ 'b' ] ] ],
  [ ' and ' ],
  [ 'italic ', [ [ 'i' ] ] ],
  [ 'and ' ],
  [ 'stroke', [ [ 's' ] ] ],
  [ ' and ' ],
  [ 'code', [ [ 'c' ] ] ],
  [ ' and a ' ],
  [ 'link', [ [ 'a', 'http://www.google.com' ] ] ],
  [ ' and a ' ],
  [ 'red text', [ [ 'h', 'red' ] ] ],
  [ '. This is ' ],
  [ 'bold and italic', [ [ 'b' ], [ 'i' ] ] ],
  [ '.' ]
]
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function parseNotionText(text: NotionText): NotionPageText[] {
  const result: NotionPageText[] = [];
  text.forEach(([str, att]) => {
    const item: NotionPageText = {
      text: str,
      atts: [],
    };
    if (att) {
      att.forEach(([attName, ...rest]) => {
        item.atts.push({
          att: attName,
          value: rest && rest[0],
        });
      });
    }
    result.push(item);
  });
  return result;
}
