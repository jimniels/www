export default function getHackerNewsPosts() {
  return fetch(
    "http://hn.algolia.com/api/v1/search?query=blog.jim-nielsen.com&restrictSearchableAttributes=url"
  )
    .then((res) => res.json())
    .then((json) => json.hits);
}
