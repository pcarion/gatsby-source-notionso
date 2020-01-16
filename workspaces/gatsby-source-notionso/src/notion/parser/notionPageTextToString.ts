import { NotionPageText } from '../../types/notion';

export default function notionPageTextToString(text: NotionPageText[]): string {
  const parts: string[] = [];
  text.forEach(t => {
    parts.push(t.text);
  });
  return parts.join('');
}
