import { sites, type TPage } from "@/stores/sites";

export const config: { allSites: { pages: TPage[], updatedAt?: number }} = $state({ allSites: { pages: [] }});

sites.subscribe((value) => {
  config.allSites = value;
});


