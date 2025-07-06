
export const CLOUDINARY_CONFIG = {
    cloudName: 'dh0ymxrfe', // Remplacez par votre cloud name Cloudinary
    uploadPreset: 'invoice_logos', // Preset que vous devrez créer dans Cloudinary
    folder: 'invoice-app/logos', // Dossier optionnel pour organiser vos images
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