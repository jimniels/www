import fs from "fs";
import Mustache from "mustache";
import express from "express";
import { getData } from "./scripts/get-data.js";
const IS_DEV = process.env.NODE_ENV !== "production";

const app = express();

console.log("re-rendered", IS_DEV);

if (IS_DEV) {
  app.use(express.static("src"));
  const port = 3000;

  app.get("/", async (req, res) => {
    console.log("re-rendered");
    const html = await getIndexHtml();
    res.send(html);
  });

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
} else {
  // build .mustache files and write to disk as .html files
  console.time("Build");
  getIndexHtml()
    .then((html) => {
      fs.writeFileSync("./src/index.html", html);
      console.timeEnd("Build");
    })
    .catch((e) => {
      console.error("Build failed:", e);
      process.exit(1);
    });
}

async function getIndexHtml() {
  let data = await getData();

  const html = Mustache.render(
    fs.readFileSync("./src/index.mustache").toString(),
    data
  );

  return html;
}
