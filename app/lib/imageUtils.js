// Image utilities
export const imageUtils = {
  // Redimensionner une image
  resize: async (file, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.9);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // Convertir fichier en base64
  toBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  // Obtenir les dimensions
  getDimensions: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            width: img.width,
            height: img.height,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // Valider les dimensions
  isValidDimensions: async (file, minWidth = 100, minHeight = 100) => {
    const dims = await imageUtils.getDimensions(file);
    return dims.width >= minWidth && dims.height >= minHeight;
  },

  // Compresser l'image
  compress: async (file, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },
};

// File utilities
export const fileUtils = {
  // Valider le type de fichier
  isValidType: (file, acceptedTypes) => {
    return acceptedTypes.includes(file.type);
  },

  // Valider la taille
  isValidSize: (file, maxSizeInMB) => {
    return file.size <= maxSizeInMB * 1024 * 1024;
  },

  // Obtenir le format humain de la taille
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  // Valider le fichier
  validateFile: (file, options = {}) => {
    const {
      acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
      maxSizeInMB = 5,
    } = options;

    const errors = [];

    if (!fileUtils.isValidType(file, acceptedTypes)) {
      errors.push('Type de fichier non autorisé');
    }

    if (!fileUtils.isValidSize(file, maxSizeInMB)) {
      errors.push(`La taille ne doit pas dépasser ${maxSizeInMB}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Télécharger un fichier
  download: (data, filename, type = 'application/json') => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Lire un fichier texte
  readAsText: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  },

  // Lire un fichier JSON
  readAsJSON: async (file) => {
    const text = await fileUtils.readAsText(file);
    return JSON.parse(text);
  },
};
