/**
 * Utility functions for detecting and embedding media & video URLs (YouTube, Vimeo, MP4)
 */

export interface VideoEmbedInfo {
  isVideo: boolean;
  provider: 'youtube' | 'vimeo' | 'direct' | 'none';
  embedUrl: string;
  videoId?: string;
}

export function getVideoEmbedInfo(url?: string): VideoEmbedInfo {
  if (!url || typeof url !== 'string') {
    return { isVideo: false, provider: 'none', embedUrl: '' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isVideo: false, provider: 'none', embedUrl: '' };
  }

  // YouTube Patterns:
  // 1. https://www.youtube.com/watch?v=VIDEO_ID
  // 2. https://youtu.be/VIDEO_ID
  // 3. https://www.youtube.com/embed/VIDEO_ID
  // 4. https://www.youtube.com/shorts/VIDEO_ID
  const youtubeMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      isVideo: true,
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`,
      videoId
    };
  }

  // Vimeo Pattern:
  // https://vimeo.com/VIDEO_ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1];
    return {
      isVideo: true,
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`,
      videoId
    };
  }

  // Direct Video files (.mp4, .webm, .ogg, .mov, blob:, data:video)
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:video') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) ||
    trimmed.includes('commondatastorage.googleapis.com') ||
    trimmed.includes('storage.googleapis.com') ||
    trimmed.includes('/sample/')
  ) {
    return {
      isVideo: true,
      provider: 'direct',
      embedUrl: trimmed
    };
  }

  return { isVideo: false, provider: 'none', embedUrl: '' };
}

/**
 * Specifically parses brand & showcase looping videos with full continuous loop support
 */
export function getBrandVideoEmbedInfo(url?: string, loop: boolean = true): VideoEmbedInfo {
  if (!url || typeof url !== 'string') {
    return { isVideo: false, provider: 'none', embedUrl: '' };
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return { isVideo: false, provider: 'none', embedUrl: '' };
  }

  // YouTube match
  const youtubeMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    // Notice: playlist=${videoId}&loop=1 is strictly needed for seamless continuous YouTube looping
    const loopParam = loop ? `&loop=1&playlist=${videoId}` : '';
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1${loopParam}&controls=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
    return {
      isVideo: true,
      provider: 'youtube',
      embedUrl,
      videoId
    };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1])) {
    const videoId = vimeoMatch[3] || vimeoMatch[2] || vimeoMatch[1];
    return {
      isVideo: true,
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=${loop ? 1 : 0}&muted=1&autopause=0&playsinline=1`,
      videoId
    };
  }

  // Direct video
  return {
    isVideo: true,
    provider: 'direct',
    embedUrl: trimmed
  };
}

/**
 * Curated high-resolution guidance and technology loop videos
 */
export const GUIDANCE_VIDEO_PRESETS = [
  {
    id: 'tech_transformation',
    title: 'فيديو إرشادي: التحول الرقمي والذكاء الاصطناعي',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    description: 'مشاهد تقنية ديناميكية توضح أحدث معايير الأتمتة وهندسة الحلول.'
  },
  {
    id: 'architecture_engineering',
    title: 'فيديو إرشادي: المعمارية السحابية وتكامل النظم',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'توضيح استشاري لبناء المنصات المستقرة وتصميم الواجهات المتقدمة.'
  },
  {
    id: 'youtube_sample',
    title: 'نموذج يوتيوب: عرض تقديمي تقني (YouTube Loop)',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'رابط يوتيوب عالي الدقة يوضح كيفية تكرار الفيديو بشكل مستمر وتفاعلي.'
  }
];

export function isValidUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('javascript:')) return false;
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('#');
}

/**
 * Compresses and resizes an image DataURL using HTML5 canvas
 * Keeps previews compact for fast transfer (~50-100KB WebP/JPEG)
 */
export async function optimizeImage(
  dataUrl: string, 
  maxWidth: number = 1200, 
  maxHeight: number = 1200, 
  quality: number = 0.82
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Try webp first, fallback to jpeg
      let result = canvas.toDataURL('image/webp', quality);
      if (!result || !result.startsWith('data:image/webp')) {
        result = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(result);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

