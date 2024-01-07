import * as cheerio from "cheerio";
import fs from "fs";
import Mustache from "mustache";

// Read in source HTML
const htmlIn = fs.readFileSync("./static/index.html").toString();
const $ = cheerio.load(htmlIn);

// Get the JSON data
const data = JSON.parse($("script[type=application/json]").text());

// Remove the stuff we use for development
$("#development").remove();

// Template
const htmlOut = Mustache.render($.html(), data);

// Copy source dir and overwrite index.html
fs.rmSync("./build", { recursive: true, force: true });
fs.cpSync("./static", "./build", { recursive: true });
fs.writeFileSync("./build/index.html", htmlOut);
