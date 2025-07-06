
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const cloudinaryAPI = {
  uploadImage: async (file: File): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload de l\'image');
    }
    
    return response.json();
  },

  deleteImage: async (publicId: string): Promise<void> => {
    // Pour supprimer une image, vous devrez utiliser l'API admin de Cloudinary
    // qui nécessite une signature côté backend
    console.log('Suppression d\'image:', publicId);
  }
};