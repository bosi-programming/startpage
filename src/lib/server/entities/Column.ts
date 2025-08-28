export class SitesColumn {
  title: string;
  sites: { name: string; url: string }[];
  subcolumns?: SitesColumn[];
}
