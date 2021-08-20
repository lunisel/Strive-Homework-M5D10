import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const { readJSON, writeJSON, writeFile } = fs;

const mediaJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/media/media.json"
);

export const getMedia = () => readJSON(mediaJSONPath);
export const writeMedia = (content) => writeJSON(mediaJSONPath, content);
