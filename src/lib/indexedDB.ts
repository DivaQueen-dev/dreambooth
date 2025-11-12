import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface PhotoDB extends DBSchema {
  memories: {
    key: string;
    value: {
      id: string;
      image: string;
      caption: string;
      reflection?: string;
      isFavorite?: boolean;
      mood?: string;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<PhotoDB>> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<PhotoDB>('photo-booth-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('memories')) {
          db.createObjectStore('memories', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveMemories = async (memories: Array<{ id: string; image: string; caption: string; reflection?: string; mood?: string }>) => {
  try {
    const db = await getDB();
    const tx = db.transaction('memories', 'readwrite');
    
    await Promise.all(
      memories.map((memory) =>
        tx.store.put({
          ...memory,
          timestamp: Date.now(),
        })
      )
    );
    
    await tx.done;
  } catch (error) {
    console.error('Error saving memories to IndexedDB:', error);
    throw error;
  }
};

export const loadMemories = async () => {
  try {
    const db = await getDB();
    const memories = await db.getAll('memories');
    return memories.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error loading memories from IndexedDB:', error);
    return [];
  }
};

export const deleteMemory = async (id: string) => {
  try {
    const db = await getDB();
    await db.delete('memories', id);
  } catch (error) {
    console.error('Error deleting memory from IndexedDB:', error);
    throw error;
  }
};

export const updateMemory = async (id: string, updates: Partial<{ caption: string; reflection: string; isFavorite: boolean; mood: string }>) => {
  try {
    const db = await getDB();
    const memory = await db.get('memories', id);
    if (!memory) throw new Error('Memory not found');
    
    await db.put('memories', {
      ...memory,
      ...updates,
    });
  } catch (error) {
    console.error('Error updating memory in IndexedDB:', error);
    throw error;
  }
};
