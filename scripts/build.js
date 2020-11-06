import fs from "fs-extra";
import Mustache from "mustache";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import moment from "moment";
import YAML from "yamljs";
import slugifyFn from "slugify";

const requireJSON = (filepath) =>
  JSON.parse(fs.readFileSync(filepath).toString());

const slugify = (str) => slugifyFn(str, { remove: /['':;,]/g, lower: true });
const DATE_FORMAT = "MMM D, YYYY";
const __dirname = dirname(fileURLToPath(import.meta.url));

// main();

export async function getData() {
  return {
    /**
     * Dribbble
     * http://developer.dribbble.com/v2/shots/
     *
     * In:
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
     *   { shotUrl, imgUrl }
     * ]
     */
    dribbble: await (async () => {
      const cacheFile = join(__dirname, "../cache/dribbble.json");
      let data;

      if (fs.existsSync(cacheFile)) {
        data = requireJSON(cacheFile);
      } else {
        const ids = YAML.load(join(__dirname, "../data/dribbble.yml"));
        data = await Promise.all(
          ids.map((id) =>
            fetch(`https://api.dribbble.com/v2/shots/${id}`, {
              headers: {
                Authorization:
                  "Bearer 8379fd23942fcf12e4dfdb3d09293a1c01c19e7a577b35e78d48bb659480a21d",
                // This header is supposed to return a key name `description_text` where
                // HTML is stripped, but it's not for some reason. So we'll do it ourself.
                Accept: "application/vnd.dribbble.v2.text+json",
              },
            }).then((res) => res.json())
          )
        );
        fs.outputFileSync(cacheFile, JSON.stringify(data));
      }

      return data.map(({ html_url, images, title }) => ({
        href: html_url,
        src: images.hidpi ? images.hidpi : images.normal,
        title,
      }));
    })(),

    /**
     * Instagram
     * https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
     * Unfortunately these tokens only appear to last for 60 days. You can refresh them
     * but that seems like a hassle for our scenario here.
     * @TODO figure out a better way to refresh tokens
     * https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens
     * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens#refresh-a-long-lived-token
     * [
     *   {
     *     media_type,
     *     media_url,
     *     permalink
     *   }
     * ]
     */
    instagram: await (async () => {
      const file = join(__dirname, "../cache/instagram.json");
      if (fs.existsSync(file)) {
        return requireJSON(file);
      }

      const TOKEN = fs.readFileSync(
        join(__dirname, "../instagram-flyingjpies.token")
      );
      const URL = "https://graph.instagram.com";
      const USER_ID = "17841406109183572";

      const data = await fetch(
        `${URL}/${USER_ID}?fields=media&access_token=${TOKEN}`
      )
        .then((res) => res.json())
        .then((json) => {
          const {
            media: { data },
          } = json;
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
          res.items
            .filter((item, i) => i <= 5)
            .map((item) => ({
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
    publishings: YAML.load(join(__dirname, "../data/publishings.yml")).map(
      (item) => ({
        ...item,
        date: moment(item.date).format(DATE_FORMAT),
        thumbnail:
          slugify(item.title, { remove: /['':;,]/g, lower: true }) +
          "." +
          (item.imageType ? item.imageType : "png"),
      })
    ),

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
