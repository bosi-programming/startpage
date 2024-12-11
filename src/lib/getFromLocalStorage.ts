export const getFromLocalStorage = (localStorageName: string) => {
  const localStorageItem = localStorage.getItem(localStorageName);
  if (localStorageItem && localStorageItem !== 'undefined') {
    return JSON.parse(localStorageItem);
  }
};
