export interface StoredVideoResponse {
  publicUrl: string;
  mimeType: string;
}

/** Only update the editable draft after a durable server response. Publishing is separate. */
export const persistBrandVideoFile = async (
  file: File,
  upload: (file: File) => Promise<StoredVideoResponse>,
  setDraftUrl: (url: string) => void,
  onStored: (message: string) => void,
): Promise<boolean> => {
  try {
    const stored = await upload(file);
    if (!/^\/media\/[a-f\d-]+\.(mp4|webm)$/i.test(stored.publicUrl) || !stored.mimeType.startsWith('video/')) {
      return false;
    }
    setDraftUrl(stored.publicUrl);
    onStored('تم رفع الفيديو إلى التخزين الدائم. احفظ المسودة ثم انشرها لإظهاره للزوار.');
    return true;
  } catch {
    return false;
  }
};
