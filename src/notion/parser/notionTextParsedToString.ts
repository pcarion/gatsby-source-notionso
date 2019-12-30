import { NotionTextParsed } from '../../types/notion';

export default function notionTextParsedToString(
  text: NotionTextParsed,
): string {
  const parts: string[] = [];
  text.forEach(([t, _]) => {
    parts.push(t);
  });
  return parts.join('');
}
