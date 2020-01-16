import { NotionImageNodes } from '../types/notion';

export interface RenderUtils {
  publicUrl(arg: string): string | null;
}

export default function(imageNodes: NotionImageNodes[]): RenderUtils {
  return {
    publicUrl(imageUrl: string): string | null {
      const node = imageNodes.find(i => i.imageUrl === imageUrl);
      if (!node) {
        return null;
      }
      return node.localFile && node.localFile.publicURL;
    },
  };
}
