export default function notionTextToParagraphDescription(
  parsedText: NotionTextParsed,
): ParagraphDescription {
  const parts: TextDescription[] = [];
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
      text,
      style: style.join(''),
      extra,
    });
  });
  return {
    content: parts,
  };
}
