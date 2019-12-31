import { NotionPageText } from '../../types/notion';

export default function notionTextParsedToString(
  text: NotionPageText[],
): string {
  const parts: string[] = [];
  text.forEach(t => {
    parts.push(t.text);
  });
  return parts.join('');
}
