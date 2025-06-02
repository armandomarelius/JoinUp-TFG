import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración para imágenes de eventos
const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'joinup_events',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Configuración para avatares de usuario
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'joinup_avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' } // Optimizado para fotos de perfil
    ]
  }
});

// Configuraciones de Multer
const uploadEvent = multer({ storage: eventStorage });
const uploadAvatar = multer({ storage: avatarStorage });

export { uploadEvent, uploadAvatar, cloudinary };
