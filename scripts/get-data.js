import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import YAML from "yamljs";
import slugifyFn from "slugify";
import sizeOf from "image-size";

const requireJSON = (filepath) =>
  JSON.parse(fs.readFileSync(filepath).toString());

const slugify = (str) => slugifyFn(str, { remove: /['':;,]/g, lower: true });
const DATE_FORMAT = "MMM D, YYYY";
const __dirname = dirname(fileURLToPath(import.meta.url));

// @TODO fetchIf() will look for a local cache file first and if it doesn't exist,
// it'll be fetched from the network. npm start will clear this cache each time you run
// getData()
//   .then((data) => {
//     fs.outputFile("./data.json", JSON.stringify(data, null, 2));
//     console.log(JSON.stringify(data));
//   })
//   .catch((e) => {
//     console.log({ error: "failed to get data" + e });
//   });
export async function getData() {
  return {
    svgs: fs
      .readdirSync(join(__dirname, "../src/images"))
      .reduce((acc, file) => {
        acc[file.replace(".svg", "")] = fs
          .readFileSync(join(__dirname, "../src/images", file))
          .toString();
        return acc;
      }, {}),
    css: fs.readFileSync(join(__dirname, "../src/simple.css")).toString(),
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
    // dribbble: requireJSON(
    //   join(__dirname, "../src/data/dribbble-shots.json")
    // ).map(({ html_url, images, title }) => ({
    //   href: html_url,
    //   src: images.hidpi ? images.hidpi : images.normal,
    //   title,
    // })),

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
    // instagram: requireJSON(join(__dirname, "../src/data/instagram-posts.json"))
    //   .map(({ media_url, permalink }, i) => ({
    //     href: permalink,
    //     src: `/assets/img/instagram/${i}.jpg`,
    //   }))
    //   .filter((post, i) => i < 12),

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
          res.items.map((item) => ({
            ...item,
            date_published: item.date_published.slice(0, 10),
          }))
        );
      return data.slice(0, 3);
    })(),
    blogPostsByTag: await (async () => {
      const data = await fetch(
        "https://blog.jim-nielsen.com/archive/index.json"
      )
        .then((res) => res.json())
        .then((posts) =>
          posts.map((post) => ({
            ...post,
            date_published: post.date.slice(0, 10),
          }))
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
    blogPostCitations: YAML.load(
      join(__dirname, "../src/data/blog-post-citations.yml")
    ).slice(0, 5),
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
      ]).then((responses) => responses.map((arr, i) => arr.slice(0, 7)));

      return data;
    })(),
    publishings: YAML.load(join(__dirname, "../src/data/publishings.yml"))
      .map((item) => ({
        ...item,
        date: item.date.toISOString().slice(0, 4),
      }))
      .reduce(
        (acc, item, i) => {
          if (i < 8) {
            acc.visible.push(item);
            return acc;
          } else {
            acc.hidden.push(item);
          }
          return acc;
        },
        { visible: [], hidden: [] }
      ),

    tweets: YAML.load(join(__dirname, "../src/data/tweets.yml")),

    employment: [...Array(10).keys()].map((key) => key + 1),

    logos: [
      [
        {
          id: "hackernews",
          url: "https://hn.algolia.com/?q=blog.jim-nielsen.com",
        },
        { id: "css-tricks", url: "" },
        {
          id: "sidebar",
          url: "https://sidebar.io/domain/blog.jim-nielsen.com",
        },
        {
          id: "changelog",
          url: "https://changelog.com/news/the-optional-chaining-operator-modern-browsers-and-my-mom-Lpyn",
        },
        { id: "shoptalk", url: "https://shoptalkshow.com/504/" },
        {
          id: "heydesigner",
          url: "https://heydesigner.com/newsletter/daily-issues/2021-82/",
        },
      ],
      [
        { id: "frontend-focus", url: "https://frontendfoc.us/issues/525" },
        {
          id: "event-apart",
          url: "https://twitter.com/aneventapart/status/1496973472416755716",
        },
        {
          id: "smashing-magazine",
          url: "https://www.smashingmagazine.com/the-smashing-newsletter/smashing-newsletter-issue-362/",
        },
        {
          id: "javascript-weekly",
          url: "https://javascriptweekly.com/issues/573",
        },
      ],
      [
        { id: "dave", url: "" },
        { id: "sara", url: "" },
        { id: "chris", url: "" },
        { id: "rich", url: "" },
        { id: "stephanie", url: "" },
        { id: "guillermo", url: "" },
        { id: "chris-l", url: "" },
      ],
    ].map((arr) =>
      arr.map(({ id, url }, i) => {
        const { width, height } = sizeOf(
          join(__dirname, `../static/logo-${id}.png`)
        );
        return {
          src: `/logo-${id}.png`,
          href: url,
          width: width / 2,
          height: height / 2,
        };
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
