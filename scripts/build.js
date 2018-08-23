const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const ejs = require("ejs");
const striptags = require("striptags");
const YAML = require("yamljs");
const moment = require("moment");
const slugify = require("./slugify");

const PATH_TO_DATA = path.resolve(__dirname, "../src/data/");
let sections = YAML.load(path.resolve(PATH_TO_DATA, "sections.yml"));

// Kick it off by getting our data then doing something with it
try {
  require("./getData")(async function(data) {
    // Generate an id for every item
    const sections = data.map(item => ({
      ...item,
      id: slugify(item.title)
    }));

    const template = fs
      .readFileSync(path.resolve(__dirname, "../src/index.ejs"))
      .toString();

    const out = ejs.render(
      template,
      {
        sections,
        skills: YAML.load(path.resolve(PATH_TO_DATA, "skills.yml"))
      },
      { filename: path.join(__dirname, "../src/index.ejs") }
    );
    // const out =
    //   "<!DOCTYPE html>" +
    //   ReactDOMServer.renderToStaticMarkup(
    //     React.createElement(Index, {
    //       // @TODO add order to these
    //       sections: Object.keys(sections).sort(),
    //       sectionsById: sections
    //     })
    //   );

    fs.writeFileSync(path.resolve(__dirname, "../index.html"), out);
    // console.log(out);
    console.log("---> Done!");
  });
} catch (e) {
  console.log(e);
  console.log("---> Error");
}
