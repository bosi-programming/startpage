import { saveAs } from "file-saver";

export function saveSites(e: Event) {
	e.preventDefault();
  const sites = localStorage.getItem("sites");
  if(sites) {
  const blob = new Blob([sites], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, "sites.json");
}
}
