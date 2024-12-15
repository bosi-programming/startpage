import { writable } from "svelte/store";
import { getFromLocalStorage } from "$lib/getFromLocalStorage";

const allSites = getFromLocalStorage("sites") || null;

type TSite = {
  url: string,
  name: string,
}

export type TColumn = {
  title: string,
  subColumns?: TColumn[],
  sites?: TSite[],
}

export const sites = writable(allSites);

export function updateSites(newSites: string) {
  sites.update(() => JSON.parse(newSites));
}

export function searchSites(text: string) {
  let newSites = allSites.map((column: TColumn) => filterSitesByName(text, column));
  // Filter empty columns
  newSites = newSites.filter(
    (column: TColumn) =>
      (column.sites && column.sites.length !== 0) ||
      column.subColumns?.length !== 0
  );
  sites.update(() => newSites);
}

function filterSitesByName(name: string, columns: TColumn) {
  const clonedColumns = structuredClone(columns);
  if (clonedColumns.sites) {
    const filteredSites = clonedColumns.sites.filter((site) =>
      site.name?.toLowerCase().includes(name.toLowerCase())
    );
    clonedColumns.sites = filteredSites;
  }

  if (clonedColumns.subColumns) {
    clonedColumns.subColumns = clonedColumns.subColumns.map((subColumn) =>
      filterSitesByName(name, subColumn)
    );
    // Remove empty subColumns
    clonedColumns.subColumns = clonedColumns.subColumns.filter(
      (subColumn) => subColumn.sites?.length !== 0
    );
  }

  return clonedColumns;
}

export function updateColumn(newValue: string, index: number, field: string) {
  sites.update((oldSites) => {
    if (!oldSites[index]) {
      oldSites[index] = { sites: [] };
    }
    oldSites[index][field] = newValue;
    console.log(oldSites);
    return oldSites;
  });
}

export function addNewSite(selectedColumnIndex: number) {
  sites.update((oldSites) => {
    const newSites = oldSites;
    const selectedColumn = newSites[selectedColumnIndex];
    if (!selectedColumn) return;
    selectedColumn.sites.push({ url: "", name: "" });
    newSites[selectedColumnIndex] = selectedColumn;
    return newSites;
  });
}

export function deleteSite(siteIndex: number, selectedColumnIndex: number) {
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

export function updateSite(newValue: string, siteIndex: number, selectedColumnIndex: number, field: string) {
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
