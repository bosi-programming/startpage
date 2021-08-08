export const getFromLocalStorage = (localStorageName) => {
  const localStorageItem = localStorage.getItem(localStorageName);
  if (localStorageItem) {
    return JSON.parse(localStorageItem);
  }
  return;
};
