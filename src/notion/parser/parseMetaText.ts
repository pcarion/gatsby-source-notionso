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

function parseMetaLine(line: string): [boolean, string, string] {
  const l1 = line.trim();
  if (!l1.startsWith(META_MARKER_TAGS)) {
    return [false, '', ''];
  }
  const l2 = l1.substring(1).trim();
  const pos = l2.indexOf(':');
  if (pos > 0) {
    return [
      true,
      l2
        .substring(0, pos)
        .trim()
        .toLowerCase(),
      l2.substring(pos + 1).trim(),
    ];
  }

  const pos2 = l2.indexOf(' ');
  if (pos2 > 0) {
    return [
      true,
      l2
        .substring(0, pos2)
        .trim()
        .toLowerCase(),
      l2.substring(pos2 + 1).trim(),
    ];
  }
  return [true, l2.toLowerCase(), ''];
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
    const [isMetaLine, keyword, value] = parseMetaLine(line);
    if (!isMetaLine) {
      return false;
    }
    let isMeta = true;
    if (keyword === 'draft') {
      meta.isDraft = parseBooleanValue(value);
    } else if (keyword === 'date') {
      meta.date = parseDateValue(value);
    } else if (keyword === META_MARKER_TAGS) {
      meta.excerpt = value;
    } else if (keyword === 'slug') {
      meta.slug = parseSlug(value);
    } else if (keyword === 'tags') {
      meta.tags = parseArrayString(value);
    } else {
      isMeta = false;
    }
    return isMeta;
  };
}
