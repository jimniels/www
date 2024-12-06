/**
 * @param {Object} _
 * @param {string} _.domain
 * @param {number|string} _.size
 */
export default ({ domain, size }) => {
  const sz = size !== undefined ? size : 64;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`;
};
