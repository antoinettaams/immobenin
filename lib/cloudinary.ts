// lib/cloudinary.ts - CORRIGÉ COMPLET
import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Fonction pour générer un nom de fichier unique
function generateUniqueFilename(originalName?: string, options?: { bienId?: string; index?: number }): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  
  if (options?.bienId && options.index !== undefined) {
    // Format organisé: bien_{id}_img{index}_{timestamp}
    return `bien_${options.bienId}_img${options.index + 1}_${timestamp}`;
  }
  
  if (originalName) {
    // Extraire l'extension
    const extension = originalName.split('.').pop() || 'jpg';
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '_');
    return `${nameWithoutExt}_${timestamp}_${randomStr}.${extension}`;
  }
  
  // Nom générique
  return `immo_${timestamp}_${randomStr}.jpg`;
}

// Fonction principale d'upload
export async function uploadBufferToCloudinary(
  buffer: Buffer, 
  options?: {
    filename?: string;
    bienId?: string;
    index?: number;
    isPublic?: boolean;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const { filename, bienId, index } = options || {};
    
    // Générer un nom unique
    const publicId = generateUniqueFilename(filename, { bienId, index });
    
    console.log(`📤 Cloudinary upload: ${publicId}`);
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "immo_biens",
        public_id: publicId,
        resource_type: "image",
        unique_filename: true,
        overwrite: false,
        use_filename: false,
        transformation: [
          { width: 1600, crop: "limit" }, // Largeur max 1600px
          { quality: "auto:good" } // Qualité optimisée
        ],
        context: `filename=${filename || 'upload'}|bienId=${bienId || 'unknown'}`
      },
      (error, result) => {
        if (error) {
          console.error('❌ Erreur Cloudinary:', error);
          reject(error);
        } else if (result?.secure_url) {
          console.log(`✅ Upload réussi: ${result.secure_url.substring(0, 80)}...`);
          
          // Retourner l'URL avec versioning
          const versionedUrl = result.secure_url.includes('upload/') 
            ? result.secure_url.replace('/upload/', `/upload/q_auto,f_auto/`)
            : result.secure_url;
            
          resolve(versionedUrl);
        } else {
          reject(new Error('Cloudinary a retourné un résultat vide'));
        }
      }
    );
    
    uploadStream.end(buffer);
  });
}

// Fonction pour supprimer une image (optionnel)
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Image ${publicId} supprimée:`, result);
    return result.result === 'ok';
  } catch (error) {
    console.error('❌ Erreur suppression Cloudinary:', error);
    return false;
  }
}

// Fonction pour lister les images d'un bien (optionnel)
export async function listBienImages(bienId: string) {
  try {
    const result = await cloudinary.search
      .expression(`folder:immo_biens AND context.bienId=${bienId}`)
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();
    
    return result.resources || [];
  } catch (error) {
    console.error('❌ Erreur liste images:', error);
    return [];
  }
}