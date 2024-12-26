import { exportFileToLocalStorage } from '$lib/exportFileToLocalStorage.js';
import type { TColumn } from '@/stores/sites';

export const pushSitesToLocalStorage = (e: Event, allSites: TColumn[]) => {
  e.preventDefault();
  localStorage.removeItem('sites');
  localStorage.setItem('sites', JSON.stringify(allSites));
};

export const pushFileToLocalStorage = (e: Event) => {
  e.preventDefault();
  exportFileToLocalStorage(e, 'sites');
  location.reload();
};


