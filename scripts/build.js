const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const Mustache = require("mustache");
const striptags = require("striptags");
const YAML = require("yamljs");
const moment = require("moment");
const fse = require("fs-extra");
const slugify = require("./slugify");

const SRC = path.resolve(__dirname, "../src");
const PUBLIC = path.resolve(__dirname, "../public");
const BUILD = path.resolve(__dirname, "../build");

/**
 * Overview
 * Copy everthing in `./public` into `./build`
 * Then do any file processing in `.src/` you need to and place it in `./build`
 */
fse.copySync(PUBLIC, BUILD);

let sections = YAML.load(path.resolve(SRC, "data/sections.yml"));

// Kick it off by getting our data then doing something with it
try {
  require("./getData")(async function (data) {
    const out = Mustache.render(
      fs.readFileSync(path.resolve(SRC, "index.html")).toString(),
      data
    );

    fs.writeFileSync(path.resolve(BUILD, "index.html"), out);
    console.log("---> Done!");
  });
} catch (e) {
  console.log(e);
  console.log("---> Error");
}
