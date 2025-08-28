import { exportFileToLocalStorage } from '$lib/exportFileToLocalStorage.js';
import type { TPage } from '@/stores/sites';

export const pushSitesToLocalStorage = (allSites: {
  pages: TPage[];
  updatedAt?: number;
}) => {
  localStorage.removeItem('sites');
  localStorage.setItem('sites', JSON.stringify(allSites));
};

export const pushFileToLocalStorage = async (e: Event) => {
  e.preventDefault();
  await exportFileToLocalStorage(e, 'sites');
};
