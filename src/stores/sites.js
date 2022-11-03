import { writable } from "svelte/store";
import { getFromLocalStorage } from "../utils/getFromLocalStorage";

const allSites = getFromLocalStorage("sites") || null;

export const sites = writable(allSites);

export function updateSites(newSites) {
  sites.update(() => JSON.parse(newSites));
}

export function updateColumn(newValue, index, field) {
  sites.update((oldSites) => {
    if (!oldSites[index]) {
      oldSites[index] = { sites: [] };
    }
    oldSites[index][field] = newValue;
    console.log(oldSites);
    return oldSites;
  });
}

export function addNewSite(selectedColumnIndex) {
  sites.update((oldSites) => {
    const newSites = oldSites;
    const selectedColumn = newSites[selectedColumnIndex];
    if (!selectedColumn) return;
    selectedColumn.sites.push({ url: "", name: "" });
    newSites[selectedColumnIndex] = selectedColumn;
    return newSites;
  });
}

export function deleteSite(siteIndex, selectedColumnIndex) {
  sites.update((oldSites) => {
    const newSites = oldSites;
    const selectedColumn = newSites[selectedColumnIndex];
    const allSites = selectedColumn.sites;
    allSites.splice(siteIndex, 1);
    selectedColumn.sites = allSites;
    newSites[selectedColumnIndex] = selectedColumn;
    return newSites;
  });
}

export function updateSite(newValue, siteIndex, selectedColumnIndex, field) {
  sites.update((oldSites) => {
    const newSites = oldSites;
    const selectedColumn = oldSites[selectedColumnIndex];

    if (field) {
      selectedColumn.sites[siteIndex][field] = newValue;
    }

    newSites[selectedColumnIndex] = selectedColumn;
    return newSites;
  });
}
