require("dotenv").config();
const path = require("path");
const fetch = require("node-fetch");
const moment = require("moment");
const striptags = require("striptags");
const YAML = require("yamljs");
const slugify = require("./slugify");

const DATE_FORMAT = "MMM D, YYYY";
const { DRIBBBLE_BEARER_TOKEN, INSTAGRAM_ACCESS_TOKEN } = process.env;

async function getData(callback) {
  callback([
    /**
     * Dribbble
     * http://developer.dribbble.com/v2/shots/
     * [
     *   {
     *     description
     *     title
     *     html_url
     *     published_at
     *     images: {
     *       hidpi,
     *       normal,
     *       teaser
     *     }
     *   }
     * ]
     */
    {
      title: "Dribbble",
      url: "https://dribbble.com/jimniels",
      data: await fetch("https://api.dribbble.com/v2/user/shots", {
        headers: {
          Authorization: `Bearer ${DRIBBBLE_BEARER_TOKEN}`,
          // This header is supposed to return a key name `description_text` where
          // HTML is stripped, but it's not for some reason. So we'll do it ourself.
          Accept: "application/vnd.dribbble.v2.text+json"
        }
      })
        .then(res => res.json())
        .then(json =>
          json.map(item => ({
            ...item,
            published_at: moment(item.published_at).format(DATE_FORMAT),
            description: striptags(item.description)
          }))
        )
    },
    /**
     * Blog
     * [
     *   {
     *     title,
     *     url,
     *     date_published: "2018-09-12"
     *   }
     * ]
     */
    {
      title: "Blog",
      url: "https://blog.jim-nielsen.com/",
      data: await fetch("https://blog.jim-nielsen.com/feed.json")
        .then(res => res.json())
        .then(res =>
          res.items.map(item => ({
            ...item,
            date_published: moment(item.date_published).format(DATE_FORMAT)
          }))
        )
    },
    /**
     * FlyingJPies
     * {
     *   data: [
     *     {
     *       caption: {
     *         text,
     *         created_time - unix epoch string
     *       },
     *       link,
     *       images: {
     *         low_resolution: {
     *            url
     *         }
     *       }
     *     }
     *   ]
     * }
     */
    {
      title: "Pies",
      url: "https://www.instagram.com/flyingjpies/",
      data: await fetch(
        `https://api.instagram.com/v1/users/self/media/recent/?access_token=${INSTAGRAM_ACCESS_TOKEN}`
      )
        .then(res => res.json())
        .then(json =>
          json.data.map(post => ({
            description: post.caption.text,
            date: post.caption.created_time,
            imageUrl: post.images.low_resolution.url
          }))
        )
    },
    /**
     * Personal Projects
     */
    {
      title: "Personal Projects",
      data: YAML.load(
        path.resolve(__dirname, "../src/data/personal-projects.yml")
      )
    },
    {
      title: "Employment",
      data: YAML.load(
        path.resolve(__dirname, "../src/data/employment.yml")
      ).map(item => ({
        ...item,
        thumbnail: item.company.toLowerCase().replace(/ /g, "-") + ".png"
      }))
    },
    {
      title: "Publishings",
      data: YAML.load(
        path.resolve(__dirname, "../src/data/publishings.yml")
      ).map(item => ({
        ...item,
        date: moment(item.date).format(DATE_FORMAT),
        thumbnail:
          slugify(item.title, { remove: /['':;,]/g, lower: true }) +
          "." +
          (item.imageType ? item.imageType : "png")
      }))
    }
  ]);
}

module.exports = getData;
