import { NotionPageText } from '../../types/notion';

import notionPageTextToString from './notionPageTextToString';

// example:
// 'slug: first_page\ndate: 2019/12/31'
export default function parseMetaBlock(
  data: NotionPageText[],
  meta: Record<string, string>,
): boolean {
  const text = notionPageTextToString(data);
  const lines = text.split(/\r?\n/);
  let isMeta = false;
  lines.forEach(line => {
    const pos = line.indexOf(':');
    if (pos > 0) {
      const key = line.substring(0, pos).trim();
      const value = line.substring(pos + 1).trim();
      if (key.length > 0 && value.length > 0) {
        meta[key] = value;
        isMeta = true;
      }
    } else {
      isMeta = false;
    }
  });
  return isMeta;
}
