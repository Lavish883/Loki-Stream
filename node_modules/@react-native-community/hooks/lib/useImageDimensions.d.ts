import { ImageRequireSource } from 'react-native';
export interface URISource {
    uri: string;
}
export declare type ImageDimensionsSource = ImageRequireSource | URISource;
export interface ImageDimensions {
    width: number;
    height: number;
    aspectRatio: number;
}
export interface ImageDimensionsResult {
    dimensions?: ImageDimensions;
    error?: Error;
    loading: boolean;
}
/**
 * @param source either a remote URL or a local file resource.
 * @returns original image dimensions (width, height and aspect ratio).
 */
export declare function useImageDimensions(source: ImageDimensionsSource): ImageDimensionsResult;
//# sourceMappingURL=useImageDimensions.d.ts.map