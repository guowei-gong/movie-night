import fs from "node:fs";

const file = process.argv[2] ?? "public/data/manifest.json";
const manifest = JSON.parse(fs.readFileSync(file, "utf8"));
const generatedAt = manifest.generatedAt || new Date().toISOString();
const dataVersion = String(generatedAt).replace(/\D/g, "").slice(0, 14) || String(Date.now());

fs.writeFileSync(file, `${JSON.stringify({ ...manifest, schemaVersion: 1, dataVersion })}\n`);
console.log(JSON.stringify({ schemaVersion: 1, dataVersion }));
