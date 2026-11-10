export type SupportedImageExtension = 'jpg' | 'png' | 'webp' | 'gif';
export type SupportedImageMime = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';

export interface DetectedImageType {
  ext: SupportedImageExtension;
  mime: SupportedImageMime;
}

export interface StoredImage {
  storageName: string;
  absolutePath: string;
  publicUrl: string;
  mimeType: SupportedImageMime;
  sizeBytes: number;
}
