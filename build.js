import fs from "fs";
import html from "html";
import { getData } from "./scripts/get-data.js";

const template = fs.readFileSync("./test.html").toString();
const data = await getData();

console.log(evalTemplate(template, data));

function evalTemplate(templateStr, _) {
  const str = eval(`html\`${templateStr}\``);
  return str;
}
