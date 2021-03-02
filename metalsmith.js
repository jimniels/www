import fs from "fs";
import Metalsmith from "metalsmith";
import Mustache from "mustache";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getData } from "./scripts/build.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

Metalsmith(__dirname)
  .source("./src")
  .destination("./build")
  .frontmatter(false)
  .clean(true)
  .use(async (files, metalsmith, done) => {
    let data = await getData();
    data.css = fs.readFileSync(join(metalsmith.source(), "index.css"));

    // REnder template literal string
    // files["index.html"].contents = eval(
    //   "`" + files["index.html"].contents.toString() + "`"
    // );

    // REnder mustache template
    files["index.html"].contents = Mustache.render(
      files["index.html"].contents.toString(),
      data
    );
    done();
  })
  .build((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Done!");
    }
  });
