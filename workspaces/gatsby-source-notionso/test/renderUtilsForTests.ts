import { RenderUtils } from '../src/renderer/renderUtils';
export default function(): RenderUtils {
  return {
    publicUrl(_imageUrl: string): string | null {
      return 'https://dev.null';
    },
  };
}
