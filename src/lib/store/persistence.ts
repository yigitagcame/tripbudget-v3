// State persistence utilities
export interface PersistenceConfig {
  key: string;
  storage?: 'localStorage' | 'sessionStorage';
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

export class StatePersistence {
  private static getStorage(type: 'localStorage' | 'sessionStorage' = 'localStorage') {
    if (typeof window === 'undefined') return null;
    return type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  static save<T>(key: string, value: T, config?: Partial<PersistenceConfig>): boolean {
    try {
      const storage = this.getStorage(config?.storage);
      if (!storage) return false;

      const serialized = config?.serialize 
        ? config.serialize(value)
        : JSON.stringify(value);
      
      storage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save state:', error);
      return false;
    }
  }

  static load<T>(key: string, defaultValue: T, config?: Partial<PersistenceConfig>): T {
    try {
      const storage = this.getStorage(config?.storage);
      if (!storage) return defaultValue;

      const serialized = storage.getItem(key);
      if (serialized === null) return defaultValue;

      return config?.deserialize 
        ? config.deserialize(serialized)
        : JSON.parse(serialized);
    } catch (error) {
      console.error('Failed to load state:', error);
      return defaultValue;
    }
  }

  static remove(key: string, config?: Partial<PersistenceConfig>): boolean {
    try {
      const storage = this.getStorage(config?.storage);
      if (!storage) return false;

      storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove state:', error);
      return false;
    }
  }

  static clear(config?: Partial<PersistenceConfig>): boolean {
    try {
      const storage = this.getStorage(config?.storage);
      if (!storage) return false;

      storage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear state:', error);
      return false;
    }
  }

  static has(key: string, config?: Partial<PersistenceConfig>): boolean {
    try {
      const storage = this.getStorage(config?.storage);
      if (!storage) return false;

      return storage.getItem(key) !== null;
    } catch (error) {
      console.error('Failed to check state existence:', error);
      return false;
    }
  }
}

// Predefined persistence configurations
export const persistenceConfigs = {
  user: {
    key: 'trip-budget-user',
    storage: 'localStorage' as const,
  },
  theme: {
    key: 'trip-budget-theme',
    storage: 'localStorage' as const,
  },
  messageCount: {
    key: 'trip-budget-message-count',
    storage: 'sessionStorage' as const,
  },
  ui: {
    key: 'trip-budget-ui',
    storage: 'localStorage' as const,
  },
} as const; 