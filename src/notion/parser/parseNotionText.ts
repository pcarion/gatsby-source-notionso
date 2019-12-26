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
type NotionTextAttributes = string[][];
type NotionText = [string, NotionTextAttributes?][];

interface NotionTextParsedttributes {
  isBold: boolean;
  isItalic: boolean;
  isStrikeThrough: boolean;
  isCode: boolean;
  isLink: boolean;
  withLink?: string;
}

type NotionTextParsed = [string, NotionTextParsedttributes][];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function parseNotionText(text: NotionText): NotionTextParsed {
  const result: NotionTextParsed = [];
  text.forEach(([str, att]) => {
    const parsedAtt: NotionTextParsedttributes = {
      isBold: false,
      isItalic: false,
      isStrikeThrough: false,
      isCode: false,
      isLink: false,
    };
    if (att) {
      att.forEach(([attName, ...rest]) => {
        switch (attName) {
          case 'b':
            parsedAtt.isBold = true;
            break;
          case 'i':
            parsedAtt.isItalic = true;
            break;
          case 's':
            parsedAtt.isStrikeThrough = true;
            break;
          case 'c':
            parsedAtt.isCode = true;
            break;
          case 'a':
            parsedAtt.isLink = true;
            parsedAtt.withLink = rest[0];
            break;
          default:
            // unknow attribute
            break;
        }
      });
    }
    result.push([str, parsedAtt]);
  });
  return result;
}
