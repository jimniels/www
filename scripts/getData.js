const path = require("path");
const fetch = require("node-fetch");
const moment = require("moment");
const striptags = require("striptags");
const YAML = require("yamljs");
const slugify = require("./slugify");
const fs = require("fs-extra");

const DATE_FORMAT = "MMM D, YYYY";

async function getData(callback) {
  callback({
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
    dribbble: await (async () => {
      const file = path.join(__dirname, "../cache/dribbble.json");
      if (fs.existsSync(file)) {
        return require(file);
      }

      const data = await fetch("https://api.dribbble.com/v2/user/shots", {
        headers: {
          Authorization:
            "Bearer 8379fd23942fcf12e4dfdb3d09293a1c01c19e7a577b35e78d48bb659480a21d",
          // This header is supposed to return a key name `description_text` where
          // HTML is stripped, but it's not for some reason. So we'll do it ourself.
          Accept: "application/vnd.dribbble.v2.text+json",
        },
      })
        .then((res) => res.json())
        .then((json) =>
          json.map((item) => ({
            ...item,
            published_at: moment(item.published_at).format(DATE_FORMAT),
            description: striptags(item.description),
          }))
        );
      fs.outputFileSync(file, JSON.stringify(data));
      return data;
    })(),

    /**
     * Instagram
     * https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
     * [
     *   {
     *     media_type,
     *     media_url,
     *     permalink
     *   }
     * ]
     */
    instagram: await (async () => {
      const file = path.join(__dirname, "../cache/instagram.json");
      if (fs.existsSync(file)) {
        return require(file);
      }

      const TOKEN = fs.readFileSync(
        path.join(__dirname, "../instagram-flyingjpies.token")
      );
      const URL = "https://graph.instagram.com";
      const USER_ID = "17841406109183572";

      const data = await fetch(
        `${URL}/${USER_ID}?fields=media&access_token=${TOKEN}`
      )
        .then((res) => res.json())
        .then(({ media: { data } }) => {
          // media.paging.next is the URL for the next set of posts
          return Promise.all(
            data.map(({ id }) =>
              fetch(
                `${URL}/${id}?fields=media_type,media_url,permalink&access_token=${TOKEN}`
              ).then((res) => res.json())
            )
          );
        })
        .then((posts) => {
          return posts
            .filter((post) => post.media_type !== "VIDEO")
            .slice(0, 12);
        });
      fs.outputFileSync(file, JSON.stringify(data));
      return data;
    })(),

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
    blogPosts: await (async () => {
      const data = await fetch("https://blog.jim-nielsen.com/feed.json")
        .then((res) => res.json())
        .then((res) =>
          res.items.map((item) => ({
            ...item,
            date_published: moment(item.date_published).format(DATE_FORMAT),
          }))
        );
      return data;
    })(),
    blogPostsByTag: await (async () => {
      const data = await fetch(
        "https://blog.jim-nielsen.com/archive/index.json"
      )
        .then((res) => res.json())
        .then((posts) => {
          const postsByTag = posts.reduce((acc, post) => {
            if (post.tags && post.tags.length) {
              post.tags.forEach((tag) => {
                if (acc[tag]) {
                  acc[tag].push(post);
                } else {
                  acc[tag] = [post];
                }
              });
            }
            return acc;
          }, {});

          return postsByTag;
        });
      return data;
    })(),
    /**
     * Icons
     * [
     *   {
     *     type: ios|macos|watchos
     *     title
     *     permalink
     *     artworkUrl
     *   }
     * ]
     */
    icons: await (async () => {
      const handleResponse = (res, type) => {
        return res.json().then((json) => {
          return json.items.map((icon) => ({
            ...icon,
            type,
            permalink: icon.url,
            artworkUrl: icon.attachments[0].url.replace("512", "128"),
          }));
        });
      };
      const data = await Promise.all([
        fetch("https://www.iosicongallery.com/feed.json").then((res) =>
          handleResponse(res, "ios")
        ),
        fetch("https://www.macosicongallery.com/feed.json").then((res) =>
          handleResponse(res, "macos")
        ),
        fetch("https://www.watchosicongallery.com/feed.json").then((res) =>
          handleResponse(res, "watchos")
        ),
      ]).then((responses) =>
        responses.flat().sort((a, b) => {
          return 0.5 - Math.random();
        })
      );
      return data;
    })(),
    publishings: YAML.load(
      path.resolve(__dirname, "../src/data/publishings.yml")
    ).map((item) => ({
      ...item,
      date: moment(item.date).format(DATE_FORMAT),
      thumbnail:
        slugify(item.title, { remove: /['':;,]/g, lower: true }) +
        "." +
        (item.imageType ? item.imageType : "png"),
    })),

    /**
     * Personal Projects
     */

    // {
    //   title: "Employment",
    //   data: YAML.load(
    //     path.resolve(__dirname, "../src/data/employment.yml")
    //   ).map((item) => ({
    //     ...item,
    //     thumbnail: item.company.toLowerCase().replace(/ /g, "-") + ".png",
    //   })),
    // },
  });
}

module.exports = getData;
