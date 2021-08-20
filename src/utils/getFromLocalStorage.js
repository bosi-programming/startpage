export const getFromLocalStorage = (localStorageName) => {
  const localStorageItem = localStorage.getItem(localStorageName);
  if (localStorageItem && localStorageItem !== 'undefined') {
    return JSON.parse(localStorageItem);
  }
  return;
};
