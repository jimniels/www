import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import YAML from "yamljs";
import util from "util";
import stream from "stream";
const streamPipeline = util.promisify(stream.pipeline);

const { API_TOKEN_INSTAGRAM, API_TOKEN_DRIBBBLE } = process.env;
const __dirname = dirname(fileURLToPath(import.meta.url));
const getDataFilePath = (file) => join(__dirname, "../data", file);

// Kick-off data fetching and overwriting of cached files
Promise.all([cacheDribbble(), cacheInstagram()])
  .then(() => {
    console.log("Updated all cached files.");
  })
  .catch((e) => {
    console.error(e);
  });

/**
 * Dribbble
 * http://developer.dribbble.com/v2/shots/
 *
 */
async function cacheDribbble() {
  const ids = YAML.load(getDataFilePath("dribbble-shot-ids.yml"));
  const data = await Promise.all(
    ids.map((id) =>
      fetch(`https://api.dribbble.com/v2/shots/${id}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN_DRIBBBLE}`,
          // This header is supposed to return a key name `description_text` where
          // HTML is stripped, but it's not for some reason. So we'll do it ourself.
          Accept: "application/vnd.dribbble.v2.text+json",
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to cache dribbble data. Unexpected API response: ${res.status}, ${res.statusText}`
          );
        }
        return res.json();
      })
    )
  );
  fs.outputFileSync(
    getDataFilePath("dribbble-shots.json"),
    JSON.stringify(data)
  );
}

/**
 * Instagram
 * https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
 * Unfortunately these tokens only appear to last for 60 days. You can refresh them
 * but that seems like a hassle for our scenario here.
 * @TODO figure out a better way to refresh tokens
 * https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens
 * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens#refresh-a-long-lived-token
 */
async function cacheInstagram() {
  const URL = "https://graph.instagram.com";
  const USER_ID = "17841406109183572";

  const data = await fetch(
    `${URL}/${USER_ID}?fields=media&access_token=${API_TOKEN_INSTAGRAM}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(
          `Failed to cache instagram data. Unexpected API response: ${res.status}, ${res.statusText}`
        );
      }
      return res.json();
    })
    .then((json) => {
      const {
        media: { data },
      } = json;
      // media.paging.next is the URL for the next set of posts
      return Promise.all(
        data.map(({ id }) =>
          fetch(
            `${URL}/${id}?fields=media_type,media_url,permalink&access_token=${API_TOKEN_INSTAGRAM}`
          ).then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to paginate instagram data. ${res.status}: ${res.statusText}`
              );
            }
            return res.json();
          })
        )
      );
    })
    .then((posts) => {
      return posts.filter((post) => post.media_type !== "VIDEO").slice(0, 16);
    })
    .then(async (posts) => {
      // @TODO delete stuff in instagram folder and rewrite this stuff
      await Promise.all(
        posts.map((post, i) =>
          download(
            post.media_url,
            join(__dirname, `../src/assets/img/instagram/${i}.jpg`)
          )
        )
      );
      return posts;
    });
  fs.outputFileSync(
    getDataFilePath("instagram-posts.json"),
    JSON.stringify(data)
  );
}

async function download(remotePath, localPath) {
  const response = await fetch(remotePath);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  await streamPipeline(response.body, fs.createWriteStream(localPath));
}
