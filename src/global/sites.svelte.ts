import { sites, type TColumn } from "@/stores/sites";

export const allSites: { allSites: TColumn[] } = $state({ allSites: [] });

sites.subscribe((value) => {
  allSites.allSites = value;
});


