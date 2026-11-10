/**
 * Image Optimization & Compression Utility
 * Reduces upload size and keeps editor snapshots efficient by compressing
 * raw high-resolution images/photos to optimized lightweight data URLs (typically 40KB - 90KB).
 */

export async function optimizeImage(
  input: File | Blob | string,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82,
  preserveAlpha = false
): Promise<string> {
  // If it's an external URL (http/https) or relative asset, return as-is
  if (typeof input === 'string') {
    if (!input.startsWith('data:image/')) {
      return input;
    }
    // If it's already small (< 50KB), no need to compress further
    if (input.length < 50000) {
      return input;
    }
  }

  return new Promise((resolve) => {
    const processImage = (imgSrc: string) => {
      // Check for browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        resolve(imgSrc);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          let { width, height } = img;

          // Downscale if exceeds maxWidth or maxHeight while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          width = Math.max(1, width);
          height = Math.max(1, height);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(imgSrc);
            return;
          }

          if (!preserveAlpha) {
            // Handle white backdrop for photos
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          } else {
            ctx.clearRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          let output = '';
          if (preserveAlpha) {
            // Try WebP first for alpha support, fallback to PNG
            output = canvas.toDataURL('image/webp', quality);
            if (!output.startsWith('data:image/webp')) {
              output = canvas.toDataURL('image/png');
            }
          } else {
            // Try WebP first, fallback to JPEG
            output = canvas.toDataURL('image/webp', quality);
            if (!output.startsWith('data:image/webp')) {
              output = canvas.toDataURL('image/jpeg', quality);
            } else if (output.length > 200000) {
              output = canvas.toDataURL('image/jpeg', 0.72);
            }
          }

          resolve(output);
        } catch (err) {
          console.warn('Canvas optimization error, falling back:', err);
          resolve(imgSrc);
        }
      };

      img.onerror = () => {
        resolve(imgSrc);
      };

      img.src = imgSrc;
    };

    if (typeof input === 'string') {
      processImage(input);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          processImage(dataUrl);
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Calculates byte size of a JavaScript object when serialized to JSON
 */
export function estimateJsonSizeBytes(obj: unknown): number {
  try {
    const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return new Blob([str]).size;
  } catch {
    return 0;
  }
}
