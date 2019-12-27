import notionTextToMarkdown from '../src/notion/parser/notionTextToMarkdown';

describe('notionTextToMarkdown', () => {
  it('should process complex string', () => {
    const parsedText: NotionTextParsed = [
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
    ];
    expect(notionTextToMarkdown(parsedText)).toEqual(
      'This is **bold** and _italic _and stroke and `code` and a [link](http://www.google.com) and a red text. This is _**bold and italic**_.',
    );
  });
});
