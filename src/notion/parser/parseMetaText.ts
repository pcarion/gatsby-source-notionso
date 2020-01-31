import { NotionMeta } from '../../types/notion';

// line starting with that chacracter are meta information
// about the page
const META_MARKER_TAGS = '!';

/*
export interface NotionMeta {
  slug?: string;
  date?: Date;
  tags?: string[];
  isDraft: boolean;
}
*/
function parseArrayString(line: string): string[] {
  const result: string[] = [];
  line
    .split(',')
    .map(t => t.trim())
    .forEach(t => result.push(t));

  return result;
}

function parseDateValue(line: string): string {
  return new Date(line + ' Z').toJSON();
}

function parseSlug(line: string): string {
  return line.replace(/\W+/g, '-');
}

function parseBooleanValue(line: string): boolean {
  if (line.length === 0) {
    return true;
  }
  if (line === '0' || line === 'false') {
    return false;
  }
  return true;
}
export default function parseMetaText(
  meta: NotionMeta,
): (arg: string) => boolean {
  return (line: string): boolean => {
    const l1 = line.trim();
    if (!l1.startsWith(META_MARKER_TAGS)) {
      return false;
    }
    const l2 = l1.substring(1).trim();
    const lc2 = l2.toLowerCase();
    let isMeta = true;
    if (lc2.startsWith('draft')) {
      meta.isDraft = parseBooleanValue(lc2.substring(5).trim());
    } else if (lc2.startsWith('date')) {
      meta.date = parseDateValue(lc2.substring(4).trim());
    } else if (lc2.startsWith(META_MARKER_TAGS)) {
      meta.excerpt = l2.substring(1).trim();
    } else if (lc2.startsWith('slug')) {
      meta.slug = parseSlug(l2.substring(4).trim());
    } else if (lc2.startsWith('tags')) {
      meta.tags = parseArrayString(l2.substring(4).trim());
    } else {
      isMeta = false;
    }
    return isMeta;
  };
}
