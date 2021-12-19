Array.from(document.querySelectorAll("[data-js-truncate]")).forEach(($el) => {
  const limit = Number($el.getAttribute("data-js-truncate")) + 1;
  const surplusElements = Array.from(
    $el.querySelectorAll("li:nth-child(n+" + limit + ")")
  );
  /* @TODO maybe be smart like if limit is 3, but we have 4, just show 4 */
  if (surplusElements.length) {
    surplusElements.forEach(($el) => {
      $el.setAttribute("hidden", true);
    });

    let $li = document.createElement("li");
    $li.classList.add("show-more");
    $li.innerHTML = "<button class='link js-truncate-show-more'>More…</button>";
    $el.appendChild($li);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("js-truncate-show-more")) {
    const $li = e.target.parentNode;
    const $ul = e.target.parentNode.parentNode;

    $li.remove();

    Array.from($ul.querySelectorAll("li[hidden]")).forEach(($li) => {
      $li.removeAttribute("hidden");
    });
  }
});

// "Show more..." functionality
Array.from(document.querySelectorAll(".js-show-more")).forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(el, el.parentNode);
    el.parentNode.parentNode.querySelectorAll("[hidden]").forEach((li) => {
      li.removeAttribute("hidden");
    });
    el.parentNode.remove();
  });
});
