//# node --env-file=../.env cache-instagram.js

/**
 * Instagram
 *
 * How to authenticate:
 * https://chatgpt.com/share/7a4c9866-a001-4c8b-85f4-13b11b5f313a
 *
 * Media API docs:
 * https://developers.facebook.com/docs/instagram-basic-display-api/reference/media/
 *
 * Unfortunately long-lived access tokens for testers (that you create for yourself)
 * only last for 60 days. Then you have to swap them out for a new one.
 * So if you don't run this at least once every 60 days, it'll stop working.
 *
 * https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens
 * https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens#refresh-a-long-lived-token
 */
import fs from "fs-extra";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import util from "util";
import stream from "stream";
const streamPipeline = util.promisify(stream.pipeline);

const URL = "https://graph.instagram.com";
const USER_ID = "17841406109183572";
const { API_TOKEN_INSTAGRAM } = process.env;
const __dirname = dirname(fileURLToPath(import.meta.url));

try {
  main();
  console.log("Complete!");
} catch (e) {
  console.error(e);
}

async function main() {
  const mediaIds = await getUserMediaIds();
  const photos = await getPhotos(mediaIds);

  // Write images to disk
  await Promise.all(
    photos.map((photo, i) => {
      // Convert `2017-08-31T18:10:00+0000` to `2017-08-31T18.10.00Z`
      // Because filenames on macos can't have colons
      const filename = photo.timestamp
        .replaceAll(":", ".")
        .replace("+0000", "Z");
      return download(
        photo.media_url,
        join(__dirname, `../src/instagram/${filename}.jpg`)
      );
    })
  );

  fs.outputFileSync(
    join(__dirname, "../src/data/instagram-posts.json"),
    JSON.stringify(photos)
  );
}

async function download(remotePath, localPath) {
  const response = await fetch(remotePath);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  await streamPipeline(response.body, fs.createWriteStream(localPath));
}

/**
 * Gets the media for a particular user
 * @returns {Promise<Array<string>}
 */
async function getUserMediaIds() {
  return (
    fetch(`${URL}/${USER_ID}?fields=media&access_token=${API_TOKEN_INSTAGRAM}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to get user media. Unexpected API response: ${res.status}, ${res.statusText}`
          );
        }
        return res.json();
      })
      /**
       * {{
       *   media: {
       *     data: Array<{ id: string }>
       *     paging: { cursors: Array<Object>, next: string }
       *   },
       *   id: string
       * }}
       */
      .then((json) => {
        // media.paging.next is the URL for the next set of posts if you want it
        return json.media.data.map(({ id }) => id);
      })
  );
}

/**
 * @typedef {{
 *  media_type: string,
 *   media_url: string,
 *   permalink: string,
 *   timestamp: string
 * }} MediaItem
 */

/**
 * @param {Array<string>} mediaIds
 * @returns {Array<MediaItem>}
 */
async function getPhotos(mediaIds) {
  /**
   * @param {string} mediaId
   * @returns {Promise<MediaItem>}
   */
  const fetchMediaById = async (mediaId) => {
    const res = await fetch(
      `${URL}/${mediaId}?fields=media_type,media_url,permalink,timestamp&access_token=${API_TOKEN_INSTAGRAM}`
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch media ${mediaId}. ${res.status}: ${res.statusText}`
      );
    }
    return res.json();
  };

  /** @type {Array<MediaItem>} */
  const mediaItems = await Promise.all(mediaIds.map(fetchMediaById));

  // Filter out any videos so we just have photos
  return mediaItems.filter((item) => item.media_type !== "VIDEO");
}
