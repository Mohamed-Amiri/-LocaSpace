export class StorageUtils {
  /**
   * Get item from localStorage with error handling
   */
  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  /**
   * Set item in localStorage with error handling
   */
  static setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return false;
    }
  }

  /**
   * Remove item from localStorage with error handling
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all items from localStorage
   */
  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Get object from localStorage with JSON parsing
   */
  static getObject<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting object from localStorage:', error);
      return null;
    }
  }

  /**
   * Set object in localStorage with JSON stringification
   */
  static setObject(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting object in localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size in bytes
   */
  static getStorageSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}