export const storageAdapter = {
  get: <T>(key: string): T => {
    const stroredVal = localStorage.getItem(key);
    return stroredVal ? JSON.parse(stroredVal) : null;
  },
  save: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  delete: (key: string): void => {
    localStorage.removeItem(key);
  },
  clear: (): void => {
    localStorage.clear();
  },
};
