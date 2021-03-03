import fs from "fs-extra";
import Mustache from "mustache";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import YAML from "yamljs";
import slugifyFn from "slugify";

const requireJSON = (filepath) =>
  JSON.parse(fs.readFileSync(filepath).toString());

const slugify = (str) => slugifyFn(str, { remove: /['':;,]/g, lower: true });
const DATE_FORMAT = "MMM D, YYYY";
const __dirname = dirname(fileURLToPath(import.meta.url));

// @TODO fetchIf() will look for a local cache file first and if it doesn't exist,
// it'll be fetched from the network. npm start will clear this cache each time you run

export async function getData() {
  return {
    /**
     * In (from cached API response):
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
     *
     * Out:
     * [
     *   { href, src, title }
     * ]
     */
    dribbble: requireJSON(join(__dirname, "../data/dribbble-shots.json")).map(
      ({ html_url, images, title }) => ({
        href: html_url,
        src: images.hidpi ? images.hidpi : images.normal,
        title,
      })
    ),

    /**
     * Instagram
     * In:
     * [
     *   {
     *     media_type,
     *     media_url,
     *     permalink
     *   }
     * ]
     *
     * Out:
     * [
     *   { href, src }
     * ]
     */
    instagram: requireJSON(join(__dirname, "../data/instagram-posts.json")).map(
      ({ media_url, permalink }, i) => ({
        href: permalink,
        src: `/assets/img/instagram/${i}.jpg`,
      })
    ),

    /**
     * Blog
     * [
     *   {
     *     title,
     *     url,
     *     date_published: "2020-10-19T19:00:00.000Z"
     *   }
     * ]
     */
    blogPosts: await (async () => {
      const data = await fetch("https://blog.jim-nielsen.com/feed.json")
        .then((res) => res.json())
        .then((res) =>
          res.items
            .filter((item, i) => i < 3)
            .map((item) => ({
              ...item,
              date_published: item.date_published.slice(0, 10),
            }))
        );
      return data;
    })(),
    blogPostsByTag: await (async () => {
      const data = await fetch(
        "https://blog.jim-nielsen.com/archive/index.json"
      )
        .then((res) => res.json())
        .then((posts) =>
          posts.map((post) => ({ ...post, date: post.date.slice(0, 10) }))
        )
        .then((posts) => {
          const postsByTag = posts.reduce((acc, post) => {
            if (post.tags && post.tags.length) {
              post.tags.forEach((tag) => {
                if (acc[tag]) {
                  if (acc[tag].length < 3) {
                    acc[tag].push(post);
                  }
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
    blogPostCitations2: YAML.load(
      join(__dirname, "../data/blog-post-citations-2.yml")
    ),
    blogPostCitations: YAML.load(
      join(__dirname, "../data/blog-post-citations.yml")
    ),
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
    iconGalleries: await (async () => {
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
      ]).then(
        (responses) => [
          {
            name: "iOS Icon Gallery",
            url: "https://www.iosicongallery.com",
            icons: responses[0],
          },
          {
            name: "macOS Icon Gallery",
            url: "https://www.macosicongallery.com",
            icons: responses[1],
          },
          {
            name: "watchOS Icon Gallery",
            url: "https://www.watchosicongallery.com",
            icons: responses[2],
          },
        ]
        // responses.flat().sort((a, b) => {
        //   return 0.5 - Math.random();
        // })
      );
      return data;
    })(),
    publishings: YAML.load(join(__dirname, "../data/publishings.yml")).map(
      (item) => ({
        ...item,
        date: item.date.toISOString().slice(0, 4),
        thumbnail:
          slugify(item.title, { remove: /['':;,]/g, lower: true }) +
          "." +
          (item.imageType ? item.imageType : "png"),
      })
    ),

    tweets: YAML.load(join(__dirname, "../data/tweets.yml")),

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
  };
}
