/**
 * Utility functions for local file uploads, image optimization,
 * data URL generation, and preset assets for company profiles.
 */

export interface ProcessedLocalFile {
  id: string;
  name: string;
  size: string;
  type: string;
  dataUrl: string;
  uploadedAt: string;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Reads and optionally compresses a local image file into an optimized base64 data URL.
 * Automatically constrains dimensions using Canvas to keep Firestore document payloads light (< 300KB).
 */
export async function readAndOptimizeImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 900,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's SVG, read directly as data URL to preserve vector fidelity
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Resize proportionally if dimensions exceed targets
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Draw image with smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp or jpeg
        const outputMime = file.type === 'image/png' && file.size < 500 * 1024 ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw data url
        resolve(readerEvent.target?.result as string);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Reads any local file (documents, source files, archives) as data URL with metadata.
 */
export async function readLocalSourceFile(file: File): Promise<ProcessedLocalFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'application/octet-stream',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      });
    };
    reader.onerror = () => reject(new Error('Failed to read local source file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Curated preset cover banners for high-impact company profiles
 */
export const PRESET_COMPANY_BANNERS = [
  {
    id: 'banner-tech-office',
    label: 'Modern Tech HQ',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    category: 'Workplace',
  },
  {
    id: 'banner-skyline-blue',
    label: 'Cyber Cityscape',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    category: 'Enterprise',
  },
  {
    id: 'banner-creative-studio',
    label: 'Creative Collaboration',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
    category: 'Culture',
  },
  {
    id: 'banner-gradient-mesh',
    label: 'Aurora Spectrum',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    category: 'Abstract',
  },
  {
    id: 'banner-code-matrix',
    label: 'Engineering Lab',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80',
    category: 'Engineering',
  },
  {
    id: 'banner-minimal-wood',
    label: 'Minimalist Architecture',
    url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80',
    category: 'Studio',
  },
];

/**
 * Curated preset corporate logos & avatars
 */
export const PRESET_COMPANY_LOGOS = [
  {
    id: 'logo-acro',
    label: 'Nexus Hexagon',
    url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'logo-tech-orbit',
    label: 'Quantum Sphere',
    url: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'logo-cloud-pulse',
    label: 'Hyperlink Prism',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 'logo-crest',
    label: 'Crown Symbol',
    url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=240&q=80',
  },
];

/**
 * Company profile theme accents
 */
export const BRAND_ACCENTS = [
  { id: 'blue', label: 'Sapphire Blue', color: '#2563eb', border: 'border-blue-500', bg: 'bg-blue-600', text: 'text-blue-600' },
  { id: 'indigo', label: 'Royal Indigo', color: '#4f46e5', border: 'border-indigo-500', bg: 'bg-indigo-600', text: 'text-indigo-600' },
  { id: 'purple', label: 'Electric Violet', color: '#9333ea', border: 'border-purple-500', bg: 'bg-purple-600', text: 'text-purple-600' },
  { id: 'emerald', label: 'Emerald Mint', color: '#059669', border: 'border-emerald-500', bg: 'bg-emerald-600', text: 'text-emerald-600' },
  { id: 'rose', label: 'Crimson Rose', color: '#e11d48', border: 'border-rose-500', bg: 'bg-rose-600', text: 'text-rose-600' },
  { id: 'amber', label: 'Warm Amber', color: '#d97706', border: 'border-amber-500', bg: 'bg-amber-600', text: 'text-amber-600' },
  { id: 'cyan', label: 'Deep Cyan', color: '#0891b2', border: 'border-cyan-500', bg: 'bg-cyan-600', text: 'text-cyan-600' },
];
