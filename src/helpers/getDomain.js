import psl from "psl";

export default function getDomain(urlString) {
  const url = new URL(urlString);
  const parsed = psl.parse(url.hostname);
  return parsed.domain;
}
