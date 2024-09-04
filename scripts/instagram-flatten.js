// ori "@copy scripts/instagram-flatten.js(package:@weborigami/instagram(token)), @files/archive"
// flatten.js

import { Tree } from "@weborigami/async-tree";

export default async function flatten(treelike) {
  const result = {};
  // Loop over the outer (top-level) key/values
  for (const [outerKey, outerValue] of await Tree.entries(treelike)) {
    if (Tree.isTreelike(outerValue)) {
      // Subfolder: loop over the inner key/values
      for (const [innerKey, innerValue] of await Tree.entries(outerValue)) {
        const key = `${outerKey}--${innerKey}`;
        result[key] = innerValue;
      }
    } else {
      // Regular top-level value, add as is
      result[outerKey] = outerValue;
    }
  }
  return result;
}
