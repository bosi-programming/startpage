import { browser } from "$app/environment";

export const getFromLocalStorage = (localStorageName: string) => {
  if(browser) {
  const localStorageItem = localStorage.getItem(localStorageName);
  if (localStorageItem && localStorageItem !== 'undefined') {
    return JSON.parse(localStorageItem);
  }
  }
};
