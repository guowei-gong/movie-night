import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ?? "public/data";
const required = ["manifest.json", "home.json", "search/index.json", "catalog/all/latest/1.json"];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) throw new Error(`Missing catalog file: ${relative}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
if (manifest.schemaVersion !== 1) throw new Error(`Unsupported schema version: ${manifest.schemaVersion}`);
if (!manifest.dataVersion) throw new Error("Manifest is missing dataVersion");
if (!manifest.playableTotal || !manifest.bucketSize) throw new Error("Manifest contains no playable catalog");

const jsonFiles = (folder) => fs.readdirSync(path.join(root, folder)).filter((file) => file.endsWith(".json"));
const detailFiles = jsonFiles("details");
const sourceFiles = jsonFiles("sources");
if (!detailFiles.length || detailFiles.length !== sourceFiles.length) {
  throw new Error(`Detail/source bucket mismatch: ${detailFiles.length}/${sourceFiles.length}`);
}

for (const category of manifest.categories.filter((item) => item.count > 0)) {
  const firstPage = path.join(root, "catalog", category.slug, "latest", "1.json");
  if (!fs.existsSync(firstPage)) throw new Error(`Missing first page for ${category.name}`);
}

const home = JSON.parse(fs.readFileSync(path.join(root, "home.json"), "utf8"));
if (!home.hero?.id || !Array.isArray(home.hot) || !Array.isArray(home.latest)) {
  throw new Error("Home payload is incomplete");
}

console.log(JSON.stringify({
  dataVersion: manifest.dataVersion,
  playable: manifest.playableTotal,
  episodes: manifest.episodeTotal,
  buckets: detailFiles.length,
}));
