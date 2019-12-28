export default function notionTextToHtml(parsedText: NotionTextParsed): string {
  const parts: string[] = [];
  parsedText.forEach(([text, atts]) => {
    let newStr = text;
    if (atts.isBold) {
      newStr = `**${newStr}**`;
    }
    if (atts.isItalic) {
      newStr = `_${newStr}_`;
    }
    if (atts.isCode) {
      newStr = `\`${newStr}\``;
    }
    if (atts.isLink) {
      newStr = `[${newStr}](${atts.withLink})`;
    }
    parts.push(newStr);
  });
  return parts.join('');
}
