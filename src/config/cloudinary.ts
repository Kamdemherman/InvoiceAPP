
import { ENV } from './environment';

export const CLOUDINARY_CONFIG = {
  cloudName: ENV.CLOUDINARY.cloudName,
  uploadPreset: ENV.CLOUDINARY.uploadPreset,
  folder: ENV.CLOUDINARY.folder,
};

// Fonction utilitaire pour générer des URLs optimisées
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
} = {}) => {
  const { width = 200, height = 200, quality = 'auto', format = 'auto' } = options;
  
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_fit,q_${quality},f_${format}/${publicId}`;
};