export const exportFileToLocalStorage = (event: Event, localStorageLocation: string) => {
  const element = event.currentTarget as HTMLInputElement;
  const files: FileList | null = element.files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.addEventListener("load", (readerEvent) => {
      const newMenus = readerEvent?.target?.result;
      if (newMenus && typeof newMenus === 'string') {
        try {
          JSON.parse(newMenus);
        } catch {
          console.error("Error with JSON file");
          return;
        }
        localStorage.removeItem(localStorageLocation);
        localStorage.setItem(localStorageLocation, newMenus);
      }
    });
    reader.readAsText(file);
  }
};
