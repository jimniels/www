import fs from "fs";
import Mustache from "mustache";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getData } from "./get-data.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

console.time("Build");

getData()
  .then((data) => {
    const mustache = fs
      .readFileSync(join(__dirname, "../src/index.mustache"))
      .toString();
    // REnder template literal string
    // files["index.html"].contents = eval(
    //   "`" + files["index.html"].contents.toString() + "`"
    // );
    // REnder mustache template
    const html = Mustache.render(mustache, data);
    fs.writeFileSync(join(__dirname, "../src/index.html"), html);
  })
  .catch((e) => {
    console.error("Failed to build site", e);
  })
  .finally(() => {
    console.timeEnd("Build");
  });
