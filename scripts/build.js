const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const ejs = require("ejs");
const striptags = require("striptags");
const YAML = require("yamljs");

const PATH_TO_DATA = path.resolve(__dirname, "../src/data/");

let sections = YAML.load(path.resolve(PATH_TO_DATA, "sections.yml"));

main();

async function main() {
  try {
    for (const [index, section] of sections.entries()) {
      const { id } = section;
      if (id === "dribbble") {
        sections[index].data = await getDribbblePosts();
      } else if (id === "blog") {
        sections[index].data = await getBlogPosts();
      } else {
        sections[index].data = YAML.load(
          path.resolve(PATH_TO_DATA, `${id}.yml`)
        );
      }
    }

    const template = fs
      .readFileSync(path.resolve(__dirname, "../src/index.ejs"))
      .toString();

    const out = ejs.render(template, {
      sections,
      skills: YAML.load(path.resolve(PATH_TO_DATA, "skills.yml"))
    });
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
  } catch (e) {
    console.log(e);
    console.log("---> Error");
  }
}

async function getBlogPosts() {
  return await fetch("http://jim-nielsen.com/blog/feed.json")
    .then(res => res.json())
    .then(res => res.items);
}

/*
async function getRemoteFile(fn, file) {
  const file = path.resolve(__dirname, "../_data/blog.json");

  if (fs.existsSync(file)) {
    const f = fs.readFileSync(file).toString();
    return new Promise(resolve => resolve(JSON.parse(f)));
  } else {
    const json = await fetch("http://jim-nielsen.com/blog/feed.json")
      .then(res => res.json())
      .then(res => res.items);
    fs.writeFileSync(file, JSON.stringify(json));
    return new Promise(resolve => resolve(json));
  }
}
*/

/**
 * http://developer.dribbble.com/v2/shots/
 * [
 *   {
 *     description
 *     title
 *     html_url
 *     images: {
 *       hidpi,
 *       normal,
 *       teaser
 *     }
 *   }
 * ]
 */
async function getDribbblePosts() {
  return fetch("https://api.dribbble.com/v2/user/shots", {
    headers: {
      Authorization:
        "Bearer 8379fd23942fcf12e4dfdb3d09293a1c01c19e7a577b35e78d48bb659480a21d",
      // This header is supposed to return a key name `description_text` where
      // HTML is stripped, but it's not for some reason. So we'll do it ourself.
      Accept: "application/vnd.dribbble.v2.text+json"
    }
  })
    .then(res => res.json())
    .then(json =>
      json.map(item => ({
        ...item,
        description: striptags(item.description)
      }))
    );
}
