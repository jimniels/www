//# node --env-file=../.env fetch-instagram-images.js

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
import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import util from "util";
import stream from "stream";
import os from "os";

const streamPipeline = util.promisify(stream.pipeline);

const URL = "https://graph.instagram.com";
const { API_TOKEN_INSTAGRAM } = process.env;
const __dirname = dirname(fileURLToPath(import.meta.url));
const homedir = os.homedir();
const OUTPUT_FOLDER = join(homedir, `Dropbox/instagram`);

try {
  await main();
  console.log("Complete!");
  // TODO: how many did you write?
} catch (e) {
  console.error(e);
}

async function main() {
  const mediaItems = await getAllUserMedia();
  console.log(mediaItems);
  return;

  // Write images to disk
  await Promise.all(
    mediaItems.map(({ timestamp, media_url }, i) => {
      // Convert `2017-08-31T18:10:00+0000` to `2017-08-31T18.10.00Z`
      // Because filenames on macos can't have colons
      const filename = timestamp.replaceAll(":", ".").replace("+0000", "Z");
      // TODO:
      // Does it already exist? If so, just skip it
      // Otherwise, write it
      return download(media_url, join(OUTPUT_FOLDER, `${filename}.jpg`));
    })
  );
}

async function download(remotePath, localPath) {
  // artificial delay
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
  const response = await fetch(remotePath);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  await streamPipeline(response.body, fs.createWriteStream(localPath));
}

/**
 * @returns {Promise<Array<MediaItem>}
 */
async function getAllUserMedia() {
  /** @type {Array<MediaItem>} */
  let media = [];
  let url = `${URL}/me/media?fields=media_type,media_url,permalink,timestamp&access_token=${API_TOKEN_INSTAGRAM}`;

  while (url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Failed to get user media. Unexpected API response: ${res.status}, ${res.statusText}`
      );
    }
    /** @type {{ data: Array<MediaItem>, paging: { next?: string }}} */
    const json = await res.json();
    media.push(...json.data.filter(({ media_type }) => media_type !== "VIDEO"));
    url = json.paging.next;
  }
  return media;
}

/**
 * @typedef {{
 *   media_type: string,
 *   media_url: string,
 *   permalink: string,
 *   timestamp: string
 * }} MediaItem
 */
