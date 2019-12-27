type NotionTextAttributes = string[][];
type NotionText = [string, NotionTextAttributes?][];

interface NotionTextParsedttributes {
  isBold: boolean;
  isItalic: boolean;
  isStrikeThrough: boolean;
  isCode: boolean;
  isLink: boolean;
  withLink?: string;
}

type NotionTextParsed = [string, NotionTextParsedttributes][];
