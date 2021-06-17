import fs from "fs";
import fetch from "node-fetch";
import html from "html";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getData } from "../scripts/get-data.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const template = (_) => html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Jim Nielsen</title>
      <meta name="description" content="Personal website of Jim Nielsen." />
      <meta name="author" content="Jim Nielsen" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <!-- @TODO meta tags for og:, twitter, etc. -->

      <!-- Inline our CSS -->
      <link
        rel="stylesheet"
        href="https://unpkg.com/modern-normalize@1.0.0/modern-normalize.css"
      />
      <link
        rel="stylesheet"
        href="https://blog.jim-nielsen.com/assets/css/base.css"
      />

      <style>
        ${_.css}
      </style>

      <style>
        /* body:after {
        content: "";
        background: #000 url(/assets/img/profile.jpg) no-repeat 0 100%;
        width: 400px;
        height: 100%;
        position: fixed;
        right: 0;
        top: 0;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      } */
      </style>
    </head>
    <body class="wrapper">
      <!-- @TODO
    <section
      style="
        overflow: hidden;
        background: #0a0607;
        border-radius: 50px;
        margin-bottom: 60px;
        height: 650px;

        padding-top: 20px;
        display: flex;
      "
    >
      <img
        src="/assets/img/jim.jpg"
        style="max-height: 100%; align-self: flex-end"
      />
    </section>
    -->
      
      <nav>
        <a href="#writing">Writing</a>
        <!-- <a href="#icon-galleries">Icon Galleries</a> -->
        <!-- <a href="#dribbble">Dribbble</a> -->
        <!-- <a href="#pies">Pies</a> -->
        <a href="#side-projects">Side Projects</a>
        <a href="#employment">Employment</a>
        <a href="#contact">Contact</a>
      </nav>

      <section class="copy">
        <h1>Jim Nielsen</h1>
        <h2>Dad, designer, developer — in that order.</h2>
        <!-- <h3>
          Currently: Director of Design & UI Architecture at
          <a href="https://www.sagesure.com/">SageSure</a>
        </h3> -->

        <p>
          <em>Who are you?</em> To be reductive: I’m a designer
          who codes and does product thinking. I’m trying not to define myself
          by my profession or website—and yet here we are.
        </p>
        <p>
          <em>What’s your expertise?</em> Synthesizing knowledge to work across
          perceivedly disparate boundaries—design, engineering, product,
          leadership.
        </p>
        <p>
          <em>What are your hard skills?</em> Visual design (i.e. Figma, Sketch,
          Photoshop), front-end code (i.e. HTML, CSS, JS—in all its flavors),
          product thinking (i.e. shaping, scoping, vision), and writing (i.e.
          articulating, reasoning, influencing).
        </p>

        <p>
          <em>What are your soft skills?</em> To quote a peer as I departed a
          previous employer: “Gonna be a real bummer here w/o you. You bring a
          lot of great design, and a lot of not-being-an-asshole-ness.”
        </p>

        <p>
          <em>Anything else to say?</em> I’ve worked with some
          <a href="https://twitter.com/jenniferdary" title="Jen">inpsiring</a>,
          <a href="https://about.me/timmeaney" title="Tim">charismatic</a>,
          <a href="https://ashby.io" title="Ashby">curious</a>,
          <a href="http://www.garrettkalleberg.com" title="Garrett">endearing</a
          >,
          <a href="https://twitter.com/cshoe_" title="shoe">introspective</a>,
          <a href="https://darrennewton.com" title="d_run">wise</a>,
          <a href="https://jws.io/" title="justinn">unassuming</a>,
          <a href="https://imnikkilee.com" title="Nikki">artistic</a>,
          <a href="https://github.com/bowmanb" title="B-bow">amiable</a>,
          <a href="https://github.com/damassi" title="chrispy">selfless</a>,
          <a href="https://www.benbailes.net" title="Ben">humane</a>,
          <a href="https://mayamashkovich.com/design" title="Maya">delightful</a
          >, and
          <a href="https://tylergaw.com" title="the gaw">sincere</a> people. And
          I didn’t use the word “talented” because they all are! More than any
          project, I’m proud of the people I’ve worked with and learned from.
          Maybe I’ll get that chance with you someday, dear reader.
        </p>
        <p>— Jim Nielsen, 2021-03-19</p>
        <img src="https://cdn.jim-nielsen.com/shared/jim-nielsen-portrait.jpg" width=200 height=200>
      </section>

      <section class="copy">
        <img src="/assets/img/drawing-writing-icon.svg" />

        <h1 id="writing">Writing <a href="#writing">🔗</a></h1>

        <p>
          I enjoy writing as a practice of seeking clarity and
          <a
            href="https://blog.jim-nielsen.com/2018/writing-as-iterative-problem-solving/"
            >iteratively improving my thinking</a
          >. It’s like QA, but for my thoughts. Until I can accurately,
          concisely, and comprehensibly articulate my thoughts to another
          person, I don’t know what I think I know.
        </p>

        <h2>My Blog</h2>

        <p>
          I started blogging circa 2008—those first few years being nonsensical
          and ephemeral—and I’m still finding my voice.
        </p>

        <p>My most recent posts:</p>

        <ul class="copy-full-width" data-js-truncate="3">
          ${_.blogPosts.map(
            ({ url, title, date_published }, i) => html`
              <li>
                <a href="${url}">${title}</a>
                <time class="small">${date_published}</time>
              </li>
            `
          )}
          <li>
            View all posts on
            <a href="https://blog.jim-nielsen.com"
              >blog.jim-nielsen.com →</a
            >
          </li>
        </ul>

        <p>My writing’s resonance with folks online:</p>

        <ul data-js-truncate="8">
          ${_.blogPostCitations.map(
            ({ name, quote, url }, i) => html`
              <li><a href="${url}">${name}</a>${quote && `: “${quote}”`}</li>
            `
          )}
        </ul>

        <!-- @TODO 
      <h3>Others</h3>
      <details>
        <summary>
          View links I’ve tracked to my writing from across the web…
        </summary>
        <ul>
          <li>Sidebar.io</li>
        </ul>
      </details>
      -->

        <h2>Published Articles</h2>
        <p>
          I used to publish articles to industry sites, but tackle other things
          of interest now (see “Pies” below). I keep an archive for posterity:
        </p>

        <ul class="copy-full-width posts-lis">
          ${_.publishings.map(
            ({ date, link, publisherDomain, title }) => html`<li>
              <a href="${link}">${title}</a>
              <span class="small"
                >${publisherDomain}, <time>${date}</time></span
              >
            </li>`
          )}
        </ul>
        <!--
      <style>
        #publishings img {
          border-radius: 8px;
        }
        .pub-container {
          list-style-type: none;
          padding: 0;
        }
        .pub {
          display: flex;
          margin-bottom: calc(1.618rem / 2);
        }
        .pub__img {
          display: flex;
          align-items: center;
          margin-right: calc(1.618rem / 2);
        }
        .pub__meta a {
          display: block;
        }

        .pub__meta p {
          margin: 0;
          opacity: 0.5;
          font-size: 0.666rem;
          display: flex;
        }
        .pub__meta li:after {
          content: "·";
          padding-left: calc(1.618rem / 4);
          margin-right: calc(1.618rem / 4);
        }
        .pub__meta li:last-child:after {
          display: none;
        }
      </style>
      -->
      </section>

      <section class="copy">
        <img src="/assets/img/drawing-icon-galleries.svg" />

        <h1 id="icon-galleries">
          Passion Project: My Icon Galleries <a href="#icon-galleries">🔗</a>
        </h1>

        <p>
          I’ve been curating these galleries as a hobby since ~2010. They
          showcase the art of icon design for apps in Apple’s ecosystem.
        </p>

        <p>
          Additionally, I’m working with the incredibly talented icon designer
          Michael Flarup to create
          <a href="https://www.appiconbook.com/">a printed book</a> showcasing
          many of the icons I’ve collected over the years, along with more.
        </p>

        ${_.iconGalleries.map(
          ({ name, url, icons }) => html`
            <p><a href="${url}">${name} →</a></p>
            <ul class="copy-full-width" id="icons">
              ${icons.map(
                ({ artworkUrl, title, type }) => html`
                  <li data-icon-type="${type}">
                    <img
                      src="${artworkUrl}"
                      alt="${title} icon"
                      width="128"
                      height="128"
                      loading="lazy"
                    />
                  </li>
                `
              )}
            </ul>
          `
        )}

        <style>
          #icons {
            margin: 0;
            padding: 0;
            list-style-type: none;
            display: flex;
            flex-wrap: wrap;
            max-width: 1800px;
          }
          #icons li {
            margin-right: 1.618rem;
            margin-bottom: 1.618rem;
          }
          #icons img {
            width: 100px;
            height: 100px;
          }
          [data-icon-type="ios"] img {
            border-radius: 22.5%;
          }
          [data-icon-type="watchos"] img {
            border-radius: 50%;
          }
          [data-icon-type="ios"] img,
          [data-icon-type="watchos"] img {
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          }
        </style>

        <p>
          These sites are designed, engineered, and curated by me. I
          occasionally write about the process on my blog. Here are some recent
          posts:
        </p>
        <ul class="copy-full-width" data-js-truncate="3">
          ${_.blogPostsByTag.iconGalleries.map(
            ({ date, permalink, title }, i) => html`
              <li>
                <a href="${permalink}">${title}</a>
                <time class="small">${date}</time>
              </li>

              ${i === _.blogPostsByTag.iconGalleries.length - 1 &&
              html` <li>
                View all on
                <a href="https://blog.jim-nielsen.com/tags/#iconGalleries"
                  >blog.jim-nielsen.com →</a
                >
              </li>`}
            `
          )}
        </ul>
      </section>

      <section class="copy" id="side-projects">
        <h1 id="side-projects">
          Side Projects <a href="#side-projects">🔗</a>
        </h1>

        <h2 id="pies">
          <a href="https://instagram.com/flyingjpies">@flyingjpies</a>: taking a photo of every bake.
        </h2>
        <p>
          Growing up, my Mom made pies. At the time, I didn’t know they were
          <em>the best</em> pies. As I grew into my teenage years, I noticed I
          didn’t enjoy pies from a restaurant or store like the other kids.
          Those weren’t real pies.
        </p>
        <p>
          In my mid-twenties, I moved to New York City and figured if I could
          buy a good pie anywhere in the world, surely it would be in NYC. Alas,
          I found myself in want for a good pie like Mom used to make.
        </p>
        <p>
          So I figured, if you want something done right, you gotta do it
          yourself.
        </p>
        <p>
          I asked my Mom for her recipe and began making my own pies. While my
          pie obsession was born out of a drive to <em>eat</em> good pie, now
          it’s just as much driven by a desire to <em>make</em> good pie. Making
          is now half the fun!
        </p>

        <div class="copy-full-width" id="instagram">
          ${_.instagram.map(
            ({ src, href }) => html`
              <a href="${href}">
                <img
                  src="${src}"
                  alt="Photo from @flyingjpies on Instagram"
                  width="300"
                  height="300"
                  loading="lazy"
                />
              </a>
            `
          )}
        </div>
        <style>
          #instagram {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            max-width: 1200px;
            grid-gap: 8px;
            /*display: flex;
          flex-wrap: wrap;
          max-width: 1800px;*/
          }
          #instagram a:hover {
            filter: none;
          }
          #instagram img {
            display: block;
            border-radius: 8px;
          }
          #instagram img:hover {
            box-shadow: 0 0 0 2px var(--c-bg), 0 0 0 5px rgba(var(--c-blue-rgb), 1);
          }
        </style>

        <h2>
          <a href="https://www.dribbble.com/jimniels">Dribbble</a>: shots from my baller days.
        </h2>
        
        <p>
          I used to Dribbble, but I don’t do as much “production” design work
          anymore. However I still find my stuff from the past interesting, so I
          keep it here for nostalgia.
        </p>
        <div class="copy-full-width" id="dribbble-shots">
          ${_.dribbble.map(
            ({ href, src, title }) => html`
              <a href="${href}">
                <img
                  src="${src}"
                  alt="${title}"
                  title="${title} on Dribbble"
                  width="400"
                  height="300"
                  loading="lazy"
                />
              </a>
            `
          )}
        </div>
        <style>
          #dribbble-shots {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            max-width: 1200px;
            grid-gap: 8px;
            /*display: flex;
          flex-wrap: wrap;
          max-width: 1800px;*/
          }
          #dribbble-shots a:hover {
            filter: none;
          }
          #dribbble-shots img {
            display: block;
            transition: 0.2s ease all;
            box-shadow: 0 0px 0 1px rgba(0, 0, 0, 0.075);
            border-radius: 8px;
          }
          #dribbble-shots img:hover {
            /* transform: scale(1.025); */
            /* transform: translateY(-2px); */
            
            box-shadow: 0 0px 0 1px rgba(0, 0, 0, 0.075), 0 0 0 2px var(--c-bg), 0 0 0 5px rgba(var(--c-blue-rgb), 1);
          }
        </style>

        <h2>
          <a href="https://sassme.jim-nielsen.com">SassMe</a>: visualize Sass color functions in real-time, no compilation necessary.
        </h2>

        <p>
          I first conceived of this idea when I worked at Arc90 (circa 2012),
          where it later became a company lab project which others helped me
          design and build. It sprung out of the question: when I write
          <code>darken(#123456, 5%)</code> what does that look like?
        </p>
        <p>It resonated with a lot of folks online, including these praises:</p>

        <ul>
          ${_.tweets.sassme.map(
            ({ id, author, content }) => html`
              <li>
                <a href="https://twitter.com/user/status/${id}"
                  >${author.name} (@${author.handle})</a
                >: “${content}”
              </li>
            `
          )}
        </ul>

        <video width="920" autoplay loop style="max-width: 100%">
          <source src="/assets/video/sassme.mp4" type="video/mp4">

          Sorry, your browser doesn't support embedded videos.
        </video>
        <!-- 
      {{#tweets.sassme}}
      <blockquote>
        <p>
          {{content}} –
          <a href="https://twitter.com/user/status/{{id}}"
            >{{author.name}} (@{{author.handle}})</a
          >
        </p>
      </blockquote>
      {{/tweets.sassme}}
      -->

        <!-- @TODO consider enhanced design here
      <ul class="tweets copy-full-width">
        {{#tweets.sassme}}
        <li class="tweet">
          <a href="https://twitter.com/user/status/{{ id }}">
            <h3>{{author.name}} <small>@{{author.handle}}</small></h3>
            <p>{{content}}</p>
          </a>
        </li>

        {{/tweets.sassme}}
      </ul> 

      <style>
        .tweets {
          font-size: 0.66666rem;
          list-style-type: none;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
        }
        .tweet {
          padding: 0;
          margin: 0 calc(1.618rem / 2) calc(1.618rem / 2) 0;
          /* background-color: var(--color-gray-6);  */
          border-radius: 7px;
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          width: 100%;
          max-width: 21rem;
          position: relative;
        }
        .tweet a {
          text-decoration: none;
          color: inherit;
        }
        .tweet h3,
        .tweet p {
          color: inherit;
          text-decoration: none;
          margin: 0;
        }
        .tweet h3 {
          font-size: inherit;
          font-weight: 700;
          margin-bottom: 0.0833rem;
        }
        .tweet h3 small {
          font-weight: 400;
          opacity: 0.5;
        }
        .tweet:before {
          content: "“";
          position: absolute;
          top: 0.625rem;
          left: calc(1.25rem / -2);
          width: 1.25rem;
          height: 1.25rem;
          background: var(--color-gray-6);
          border-radius: 50%;
          color: var(--color-gray);
          font-size: 1.618rem;
          font-family: serif;
          display: flex;
          text-align: center;
          line-height: 1.25;
          justify-content: center;
        }
      </style> -->

        <h2>
          <a href="https://logo-integrity.jim-nielsen.com">Logo Integrity</a>: a visual experiment on ubiquitos logos.</h3>
        <p>
          In <em>A Designer’s Art</em>, Paul Rand asks: “How far out of focus
          can an image be and still be recognized?” He proposes that a
          well-designed logo retains its form and recognizability under the
          duress of real-world use and abuse.
        </p>
        <p>
          For fun, I decided to subject some contemporary logos to a form of
          visual stress and see how well people still recognized them. You can

          <a href="https://blog.jim-nielsen.com/2014/logo-integrity/"
            >read my introductory blog post to the project</a
          >
          as well as
          <a href="https://blog.jim-nielsen.com/2018/cabin-of-logo-integrity/"
            >my round up of opinions when it hit designer news</a
          >.
        </p>

        <p class="copy-full-width">
          <img
            src="/assets/img/personal-projects/logo-integrity.png"
            alt="An collection of popular logos, each of which is displayed multiple times and each one gets progressively blurrier."
            loading="lazy"
            width="1000"
            height="666"
          />
        </p>
      </section>

      <section class="copy">
        <h1 id="employment">Employment <a href="#employment">🔗</a></h1>

        <h2>
          Director of Design & UI Architecture @
          <a href="https://www.sagesure.com">SageSure</a> (Remote)
        </h2>
        <p>Summary:</p>
        <dl class="employment-list">
          <dt>Dates employed:</dt>
          <dd>2016 - present (remote).</dd>
          <dt>Hats worn:</dt>
          <dd>Design, front-end, product, leadership.</dd>
          <dt>Tools used:</dt>
          <dd>You name it—Sketch, Invision, Figma, HTML, CSS, JS, React, Keynote,
            Outlook, and more.
          </dt>
          <dt>
            Other notes:</dt><dd>I really should write more, but honestly too busy.
            <a href="#contact">Hit me up</a> if you want to know more.
          </dd>
        </dl>
        <style>
          .employment-list dt {
            float: left;
            margin-right: .25em;
            font-weight: 500;
          }
        </style>
        <p>Related posts from my weblog:</p>
        ${PostsList(_.blogPostsByTag.insight)}

        <h2>2016: UI Engineer @ Timshel (Remote)</h2>

        <p>
          Worked on the front-end team doing engineering, design, and product
          management for a variety of web applicaitons and services. In other
          words, when stuff needed to be built, we built and shipped it.
          Project: Admin Web interface for clients administering their account
          on The Groundwork platform. Handled creating, designing, and
          engineering various features for the application’s view layer. Tools:
          Sketch, Sass, CSS Modules, Radium, Javascript, React.js, Redux,
          Bootstrap, Material UI, Git.
        </p>

        <p>Related posts from my weblog:</p>
        ${PostsList(_.blogPostsByTag.timshel)}

        <h2>
          2016: Designer & Front-end Developer @
          <a href="https://postlight.com">Postlight</a> (Remote, Freelance)
        </h2>
        <p>
          Succeeded in consulting, designing, and building internal web
          applications (on tight deadlines) for one of Postlight’s biggest
          clients: Time Inc. Project: Assignment Desk Part one in a series of
          internal web applications for Time Inc. Handled sketching,
          wireframeing, and mocking the UI/UX of the application while
          simultaneously engineering the view layer. Tools: Sketch, Sass,
          Javascript, React.js, Redux, Bootstrap, Git. Project: Digital Content
          Production Designed and built based on the Assignment Desk application
          framework. Handled everything from UI/UX to product management to
          front-end development. Tools: Sketch, Invision, Sass, Javascript,
          React.js, Redux, Bootstrap, Git.
        </p>

        <p>Related posts from my weblog:</p>
        ${PostsList(_.blogPostsByTag.postlight)}
      </section>

      <section class="copy"><h1 id="contact">Contact <a href="#contact">🔗</a></h1>
        <p>
          Want to get in touch? I’d love to hear from you! You can reach out to
          me on:
        </p>
        <ul>
          <li>
            Email: <a href="mailto:jimniels@gmail.com">jimniels@gmail.com</a>
          </li>
          <li>Twitter: <a href="https://twitter.com/jimniels">@jimniels</a></li>
          <li>Github: <a href="https://github.com/jimniels">@jimniels</a></li>
        </ul>
      </section>

      <script>
      Array.from(document.querySelectorAll("[data-js-truncate]")).forEach(($el) => {
        const limit = Number($el.getAttribute("data-js-truncate")) + 1;
        const surplusElements = Array.from($el.querySelectorAll("li:nth-child(n+" + limit + ")"))
        /* @TODO maybe be smart like if limit is 3, but we have 4, just show 4 */
        if (surplusElements.length) {
          surplusElements.forEach($el => {
            $el.setAttribute("hidden", true);
          });
          
          let $li = document.createElement("li");
          $li.innerHTML = "<button class='link js-truncate-show-more'>Show more...</button>";
          $el.appendChild($li);
        }
      });

      document.addEventListener("click", e => {
        if (e.target.classList.contains("js-truncate-show-more")) {
          const $li = e.target.parentNode;
          const $ul = e.target.parentNode.parentNode;

          $li.remove();
          
          Array.from($ul.querySelectorAll("li[hidden]")).forEach($li => {
            $li.removeAttribute("hidden");
          })
        }
      });
      </script>

      <script>
        // "Show more..." functionality
        Array.from(document.querySelectorAll(".js-show-more")).forEach((el) => {
          el.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(el, el.parentNode);
            el.parentNode.parentNode
              .querySelectorAll("[hidden]")
              .forEach((li) => {
                li.removeAttribute("hidden");
              });
            el.parentNode.remove();
          });
        });
      </script>
    </body>
  </html>`;

function ShowMore() {
  return html`<li><a href="#" class="js-show-more">Show more…</a></li>`;
}

function PostsList(list) {
  // @TODO view all on blog.jim-nielsen.com
  return html`<ul data-js-truncate="3">
    ${list.map(
      (item) =>
        html`<li>
          <a href="${item.permalink}">${item.title}</a>
          <time class="small">${item.date}</time>
        </li>`
    )}
  </ul>`;
}

console.time("Build time");
getData()
  .then((data) => {
    fs.writeFileSync(join(__dirname, "index.html"), template(data));
  })
  .catch((e) => {
    console.error("Build failed:", e);
  })
  .finally(() => {
    console.timeEnd("Build time");
  });
