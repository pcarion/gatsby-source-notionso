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
  it('should parse a complex string', () => {
    const result = parseNotionText([
      ['This is '],
      ['bold', [['b']]],
      [' and '],
      ['italic ', [['i']]],
      ['and '],
      ['stroke', [['s']]],
      [' and '],
      ['code', [['c']]],
      [' and a '],
      ['link', [['a', 'http://www.google.com']]],
      [' and a '],
      ['red text', [['h', 'red']]],
      ['. This is '],
      ['bold and italic', [['b'], ['i']]],
      ['.'],
    ]);
    expect(result).toEqual([
      [
        'This is ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
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
      [
        ' and ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        'italic ',
        {
          isBold: false,
          isItalic: true,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        'and ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        'stroke',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: true,
          isCode: false,
          isLink: false,
        },
      ],
      [
        ' and ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        'code',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: true,
          isLink: false,
        },
      ],
      [
        ' and a ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
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
      [
        ' and a ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        'red text',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
      [
        '. This is ',
        {
          isBold: false,
          isItalic: false,
          isStrikeThrough: false,
          isCode: false,
          isLink: false,
        },
      ],
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
      [
        '.',
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
});
