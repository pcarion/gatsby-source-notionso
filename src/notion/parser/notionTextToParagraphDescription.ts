import {
  NotionTextParsed,
  ContentDescription,
  ParagraphDescription,
} from '../../types/notion';

export default function notionTextToParagraphDescription(
  parsedText: NotionTextParsed,
): ParagraphDescription {
  const parts: ContentDescription[] = [];
  parsedText.forEach(([text, atts]) => {
    const style: string[] = [];
    let extra = '';
    if (atts.isBold) {
      style.push('b');
    }
    if (atts.isItalic) {
      style.push('i');
    }
    if (atts.isCode) {
      style.push('c');
    }
    if (atts.isLink) {
      style.push('l');
      extra = atts.withLink || '';
    }
    parts.push({
      f1: text,
      f2: style.join(''),
      f3: extra,
    });
  });
  return {
    type: 'text',
    content: parts,
  };
}
