import { updateSites } from '@/stores/sites';

export const exportFileToLocalStorage = async (
  event: Event,
  localStorageLocation: string,
) => {
  const element = event.currentTarget as HTMLInputElement;
  const files: FileList | null = element.files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (readerEvent) => {
      const newMenus = readerEvent?.target?.result;
      if (newMenus && typeof newMenus === 'string') {
        try {
          JSON.parse(newMenus);
        } catch {
          console.error('Error with JSON file');
          return;
        }
        localStorage.removeItem(localStorageLocation);
        localStorage.setItem(
          localStorageLocation,
          `${newMenus.trim().slice(0, -1)}, "updatedAt": ${new Date().getTime()} }`,
        );
        await fetch('/api/config', {
          method: 'POST',
          body: newMenus,
          headers: {
            'content-type': 'application/json',
          },
        });
        updateSites(newMenus);
      }
    });
    reader.readAsText(file);
  }
};
