export const exportFileToLocalStorage = (event, localStorageLocation) => {
  const file = event.srcElement.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    const newMenus = event.target.result;
    localStorage.removeItem(localStorageLocation);
    localStorage.setItem(localStorageLocation, newMenus);
  });
  reader.readAsText(file);
};
