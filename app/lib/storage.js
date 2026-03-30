// Local Storage Utilities
export const storage = {
  // Set item
  set: (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  // Get item
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  },

  // Remove item
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Check if key exists
  has: (key) => {
    return localStorage.getItem(key) !== null;
  },

  // Get all keys
  keys: () => {
    return Object.keys(localStorage);
  },
};

// IndexedDB Utilities (pour data plus grande)
export const db = {
  dbName: 'agilics-db',
  version: 1,
  stores: {
    detections: 'id',
    plants: 'id',
    cache: 'key',
  },

  // Initialiser la DB
  init: async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(db.dbName, db.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const database = event.target.result;

        // Créer les stores
        if (!database.objectStoreNames.contains('detections')) {
          database.createObjectStore('detections', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('plants')) {
          database.createObjectStore('plants', { keyPath: 'id' });
        }
        if (!database.objectStoreNames.contains('cache')) {
          database.createObjectStore('cache', { keyPath: 'key' });
        }
      };
    });
  },

  // Add item
  add: async (storeName, value) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // Get item
  get: async (storeName, id) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // Get all
  getAll: async (storeName) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // Update item
  put: async (storeName, value) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(value);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // Delete item
  delete: async (storeName, id) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },

  // Clear store
  clear: async (storeName) => {
    const database = await db.init();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  },
};

// Session Storage
export const sessionStorage = {
  set: (key, value) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  clear: () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing session storage:', error);
    }
  },
};
