import parseNotionText from '../src/notion/parser/parseNotionText';

// type NotionTextAttributes = [string[]];
// type NotionText = [string, NotionTextAttributes?][];

describe('parseNotionText', () => {
  it('should parse a plain string', () => {
    const result = parseNotionText([['hello']]);
    expect(result).toEqual([
      [
        'hello',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
    ]);
  });
  it('should parse a bold string', () => {
    const result = parseNotionText([['bold', [['b']]]]);
    expect(result).toEqual([
      [
        'bold',
        {
          isBold: true,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
    ]);
  });
  it('should parse a bold and italic string', () => {
    const result = parseNotionText([['bold and italic', [['b'], ['i']]]]);
    expect(result).toEqual([
      [
        'bold and italic',
        {
          isBold: true,
          isItalic: true,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
    ]);
  });
  it('should parse a link string', () => {
    const result = parseNotionText([
      ['link', [['a', 'http://www.google.com']]],
    ]);
    expect(result).toEqual([
      [
        'link',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: true,
          withLink: 'http://www.google.com',
        },
      ],
    ]);
  });
});
