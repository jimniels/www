const slugify = require("slugify");

module.exports = str => slugify(str, { remove: /['':;,]/g, lower: true });
