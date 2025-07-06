export const ENV = {
    // En production sur Vercel, vous devrez définir ces variables d'environnement
    API_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-url.vercel.app/api' // Remplacez par votre URL backend
      : 'http://localhost:5000/api',
    
    CLOUDINARY: {
      cloudName: 'dh0ymxrfe', // Remplacez par votre Cloudinary cloud name
      uploadPreset: 'invoice_logos',
      folder: 'invoice-app/logos'
    }
  };