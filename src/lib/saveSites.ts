import { saveAs } from "file-saver";

export function saveSites() {
  const sites = localStorage.getItem("sites");
  if(sites) {
  var blob = new Blob([sites], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, "sites.json");
}
}
