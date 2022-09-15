import html from "html";
import { getData } from "../scripts/get-data.js";

const { svgs, css, logos, blogPostCitations, blogPosts } = await getData();

const template = () => html`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Jim Nielsen</title>
      <meta name="description" content="The personal website of Jim Nielsen." />
      <meta name="author" content="Jim Nielsen" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <meta property="og:title" content="Jim Nielsen" />
      <meta
        property="og:description"
        content="The personal website of Jim Nielsen."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.jim-nielsen.com" />
      <meta property="og:image" content="https://www.jim-nielsen.com/og.png" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@jimniels" />
      <meta name="twitter:title" content="Jim Nielsen" />
      <meta
        name="twitter:description"
        content="The personal website of Jim Nielsen."
      />
      <meta name="twitter:image" content="https://www.jim-nielsen.com/og.png" />

      <!-- Inline our CSS -->
      <style>
        ${css}
      </style>
    </head>
    <body>
      <!------------------------------------------------------------------------->
      <section id="intro">
        <div class="hero">
          <img
            src="/1-portrait.png"
            width="396"
            height="497"
            alt=""
            style="
            position: absolute;
            right: -24px;
            bottom: -24px;
            border-radius: 18px;
            transform: rotate(1deg);
          "
          />
          <img
            src="/1-signature.svg"
            width="681"
            height="438"
            alt=""
            style="position: absolute; top: 22%; left: -24px"
          />
        </div>

        <h1>Jim Nielsen: lover of food &amp; websites.</h1>

        <p style="font-family: var(--serif); font-size: 1.25rem">
          I am designer, front-end developer, & writer with decades of
          experience building on the web.
        </p>

        <p>
          You can find me on: <a href="mailto:jimniels@gmail.com">Email</a>,
          <a href="https://twitter.com/jimniels">Twitter</a>,
          <a href="https://github.com/jimniels">GitHub</a>,
          <a href="https://dribbble.com/jimniels">Dribbble</a>, or
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            title="I once heard someone say, “people who are good at what they do don’t have a LinkedIn”."
            >LinkedIn</a
          >.
        </p>

        <p>
          Below are some personal projects, or jump to
          <a href="#employment">profressional employment history</a>.
        </p>
      </section>

      <!-------------------------------------------------------------------------->
      <section id="blog">
        <div class="hero hero--singles">
          ${logos.map(
            (_) => html`
              <div>
                ${_.map(
                  ({ href, src, width, height }) => html`
                    <a href="${href}">
                      <img src="${src}" width="${width}" height="${height}" />
                    </a>
                  `
                )}
              </div>
            `
          )}
        </div>
        <h1>
          <a href="https://blog.jim-nielsen.com/">My blog</a>
          <time>(2012–Now)</time>
        </h1>

        <p>
          I write to seek clarity and improve my thinking–a form of QA before my
          thoughts go to prod as words out of my mouth.
        </p>

        <p>Praise:</p>

        <ul class="citations">
          ${blogPostCitations.map(
            ({ name, url, quote }) => html`
              <li><a href="${url}">${name}:</a> ${quote}</li>
            `
          )}
        </ul>

        <p>Latest posts:</p>

        <ul>
          ${blogPosts.map(
            ({ url, title, date_published }) => html`
              <li>
                <a href="${url}">${title}</a>
                <time>(${date_published})</time>
              </li>
            `
          )}
        </ul>

        <p>Podcast:</p>
        <ul>
          <li>
            <a href="https://shoptalkshow.com/504/">ShopTalkShow #504</a>
          </li>
        </ul>
      </section>

      <!------------------------------------------------------------------------->
      <style>
        #icon-galleries .hero > div:nth-child(1) {
          top: 124px;
        }
        #icon-galleries .hero > div:nth-child(2) {
          top: 50%;
        }
        #icon-galleries .hero > div:nth-child(3) {
          bottom: 16px;
        }
        #icon-galleries .hero > div {
          list-style-type: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 -64px;
          position: absolute;
          left: -24px;
          right: -24px;
          padding: 0;
        }
        #icon-galleries .hero > div a {
        }
      </style>
      <section id="icon-galleries">
        <div class="hero hero--singles">
          {{#icons}}
          <div>
            {{#.}}
            <a href="{{permalink}}" style="border: none">
              <img
                src="{{artworkUrl}}"
                alt="{{title}} app icon"
                width="128"
                height="128"
                class="type--{{type}}"
              />
            </a>
            {{/.}}
          </div>
          {{/icons}}
        </div>
        <h1>
          <a href="https://www.iosicongallery.com">iOS</a>,
          <a href="https://www.macosicongallery.com">macOS</a>, and
          <a href="https://www.watchosicongallery.com">watchOS</a> Icon
          Galleries
          <time>(2010–Now)</time>
        </h1>

        <p>
          For over a decade I’ve been designing, developing, and curating a
          gallery of beautiful icons from Apple’s ecosystem.
        </p>

        <p>Praise:</p>

        <ul class="citations">
          {{#tweets.iconGalleries}}
          <li>
            <a href="https://twitter.com/user/status/{{id}}"
              >{{author.name}}:</a
            >
            “{{content}}”
          </li>
          {{/tweets.iconGalleries}}
        </ul>

        <p>Latest writeups:</p>

        <ul class="list">
          {{#blogPostsByTag.iconGalleries}}
          <li>
            <a href="{{permalink}}">{{title}}</a>
            <time>({{date_published}})</time>
          </li>
          {{/blogPostsByTag.iconGalleries}}
        </ul>
      </section>

      <!------------------------------------------------------------------------->
      <section id="appiconbook">
        <a href="https://www.appiconbook.com/" class="hero">
          <img
            src="/4-app-icon-book.png"
            width="896"
            height="639"
            alt=""
            style="position: absolute; top: -36px; max-width: 100%; height: auto"
          />
        </a>

        <h1>
          <a href="https://www.appiconbook.com/">The App Icon Book</a>
          <time>(2018–Now)</time>
        </h1>
        <p>
          With the world-class iconist
          <a href="https://twitter.com/flarup">Michael Flarup</a>, I helped
          create this book to celebrate the history and art of iOS app icon
          design.
        </p>

        <p>Praise:</p>

        <ul class="citations">
          <li>
            <a
              href="https://daringfireball.net/linked/2021/11/12/the-ios-app-icon-book"
              >John Gruber via Daring Fireball</a
            >: “Take my money — I can’t wait to devour this book. It looks so
            good.”
          </li>
          <li>
            <a href="https://twitter.com/khoi/status/1458457639067734020?s=20"
              >Khoi Vinh</a
            >: “[The App Icon Book] looks amazing.”
          </li>
          <li>
            <a
              href="https://twitter.com/themikestern/status/1458085983203872776?s=21"
              >Mike Stern</a
            >: “I’m looking forward to getting a copy”
          </li>
          <li>
            <a href="https://sixcolors.com/link/2021/11/the-ios-app-icon-book/"
              >Jason Snell via sixcolors</a
            >: “It looks to be a gorgeous art book/coffee table book that
            preserves the history of iOS app icon art.”
          </li>
          <!-- <li>
          <a
            href="https://www.macstories.net/linked/michael-flarup-announces-the-ios-app-icon-book/"
            >John Voorhees via macstories</a
          >: “I’ve been following…progress on The iOS App Icon Book since its
          earliest stages, and I’m excited”
        </li> -->
        </ul>

        <p>Writeups:</p>

        <ul class="list">
          {{#blogPostsByTag.iconGalleriesBook}}
          <li>
            <a href="{{permalink}}">{{title}}</a>
            <time>({{date_published}})</time>
          </li>
          {{/blogPostsByTag.iconGalleriesBook}}
        </ul>

        <p>Podcast:</p>
        <ul class="list">
          <li>
            <a
              href="https://postlight.com/podcast/iconic-design-with-jim-nielsen-and-michael-flarup"
              >Postlight Podcast #314: (Icon)ic Design</a
            >
            <time>(2022-01-11)</time>
          </li>
        </ul>
      </section>

      <!------------------------------------------------------------------------->
      <section id="pies">
        <a href="#pies">{{{svgs.pies}}}</a>
        <h1>
          <a href="https://instagram.com/flyingjpies">Flying J Pies</a>
          <time>(2017–Now)</time>
        </h1>
        <p>I love a good pie.</p>
        <p>
          Like anything you care about to a level others might deem absurd: if
          you want it done right, you’ve got to do it yourself. So I make my own
          pies and document each one.
        </p>
        <p>Go salivate.</p>
      </section>

      <!------------------------------------------------------------------------->
      <section id="canistilluse">
        <a href="https://www.canistilluse.com" class="hero hero--website">
          <img
            src="/6-canistilluse.png"
            width="994"
            height="914"
            alt=""
            style="position: absolute; left: 0px; top: 0px"
          />
        </a>
        <h1>
          canistilluse.com
          <time>(2021)</time>
        </h1>
        <p>
          A satirical website made to illustrate the problems of a world where
          habitul breakage on the web platform becomes accepted as the price of
          progress.
        </p>
        <p>Praise:</p>
        <ul>
          <li>
            <a href="https://adactio.com/links/18383">Jeremy Keith</a>: “It’s
            weirdly gratifying to see a hastily-written sarcastic quip tuned
            into something real.”
          </li>
        </ul>
        <p>Writeup:</p>
        <ul>
          <li>
            <a href="https://blog.jim-nielsen.com/2021/canistilluse.com/"
              >canistilluse.com</a
            >
            <time>(2021-08-16)</time>
          </li>
          <!-- <li>
          <a href="https://news.ycombinator.com/item?id=28309885">HackerNews</a>
        </li> -->
        </ul>
      </section>

      <section id="sassme">
        <a href="https://sassme.jim-nielsen.com" class="hero hero--website">
          <img
            src="/7-sassme.png"
            width="1148"
            height="933"
            alt=""
            style="position: absolute; left: 0; top: 0px"
          />
        </a>
        <h1>
          <a href="https://sassme.jim-nielsen.com">SassMe</a>
          <time>(2012)</time>
        </h1>
        <p>
          A tool to visualize Sass color functions in real-time, no compilation
          required.
        </p>
        <p>Praise:</p>
        <ul class="citations">
          {{#tweets.sassme}}
          <li>
            <a href="https://twitter.com/user/status/{{id}}"
              >{{author.name}}:</a
            >
            “{{content}}”
          </li>
          {{/tweets.sassme}}
        </ul>
        <p>Writeup:</p>
        <ul>
          <li>
            <a href="https://blog.jim-nielsen.com/2016/sassme-v2/"
              >SassMe v2.0</a
            >
            <time>(2016-09-27)</time>
          </li>
        </ul>
      </section>

      <section id="readlists">
        <a href="https://readlists.jim-nielsen.com" class="hero hero--website">
          <img
            src="/8-readlists.png"
            width="1104"
            height="913"
            alt=""
            style="position: absolute; left: 0; top: 0px"
          />
        </a>
        <h1>
          <a href="https://readlists.jim-nielsen.com">Readlists</a>
          <time>(2021)</time>
        </h1>
        <p>
          Recreating the idea behind a now defunct (but once incredibly useful)
          service: Readlists. All design and development, bugs and features,
          credit and blame goes directly to me.
        </p>

        <p>Writeup:</p>
        <ul>
          <li>
            <a href="https://blog.jim-nielsen.com/2021/reintroducing-readlists/"
              >(Re)Introducing Readlists</a
            >
            <time>(2021-05-10)</time>
          </li>
        </ul>
      </section>

      <section id="teamcolors">
        <a href="https://teamcolors.jim-nielsen.com" class="hero hero--website">
          <img
            src="/9-teamcolors.png"
            width="1262"
            height="1055"
            alt=""
            style="position: absolute; left: 0; top: 0px"
          />
        </a>
        <h1>
          <a href="https://teamcolors.jim-nielsen.com">TeamColors</a>
          <time>(2015)</time>
        </h1>
        <p>
          A color reference for favorite sporting teams across various
          profressional leagues.
        </p>
        <p>Praise:</p>
        <ul class="citations">
          {{#tweets.teamcolors}}
          <li>
            <a href="https://twitter.com/user/status/{{id}}"
              >{{author.name}}:</a
            >
            “{{content}}”
          </li>
          {{/tweets.teamcolors}}
        </ul>
        <p>Writeups:</p>
        <ul>
          <li>
            <a href="https://blog.jim-nielsen.com/2015/team-colors-2-0/"
              >Team Colors 2.0</a
            >
            <time>(2015-01-16)</time>
          </li>
          <li>
            <a href="https://blog.jim-nielsen.com/2013/teamcolors/"
              >Team Color Codes</a
            >
            <time>(2013-02-19)</time>
          </li>
        </ul>
      </section>

      <section id="published-articles">
        <a href="#published-articles">{{{svgs.published-articles}}}</a>
        <h1>Published Articles <time>(2012–2018)</time></h1>
        <p>
          I wrote for others’ blogs more frequently, but now I prefer to be my
          own publisher. I keep these for archival purposes.
        </p>
        <ul>
          {{#publishings.visible}}
          <li>
            <a href="{{link}}">{{title}}</a>
            <time>({{publisherDomain}}, {{date}})</time>
          </li>
          {{/publishings.visible}}
        </ul>
        <details>
          <summary>View all</summary>
          <ul>
            {{#publishings.hidden}}
            <li>
              <a href="{{link}}">{{title}}</a>
              <time>({{publisherDomain}}, {{date}})</time>
            </li>
            {{/publishings.hidden}}
          </ul>
        </details>
      </section>

      <section id="logo-integrity">
        <a
          href="https://logo-integrity.jim-nielsen.com"
          class="hero hero--website"
        >
          <img
            src="/10-logo-integrity.png"
            width="1104"
            height="913"
            alt=""
            style="position: absolute; left: 0; top: 0px"
          />
        </a>

        <h1>
          <a href="https://logo-integrity.jim-nielsen.com">Logo Integrity</a>
          <time>(2014)</time>
        </h1>
        <p>
          In <i>A Designer’s Art</i>, Paul Rand asks: “How far out of focus can
          an image be and still be recognized?” For fun, I built an experiment
          to find out.
        </p>
        <p>Writeups:</p>

        <ul>
          <li>
            <a href="https://blog.jim-nielsen.com/2014/logo-integrity/"
              >Logo Integrity Brought into Focus</a
            >
            <time>(2014-09-02)</time>
          </li>
          <li>
            <a href="https://blog.jim-nielsen.com/2018/cabin-of-logo-integrity/"
              >My Little Cabin in the Woods of Logo Integrity</a
            >
            <time>(2018-08-09)</time>
          </li>
        </ul>
      </section>

      <section id="gimmiedaticon">
        <a
          href="https://gimmiedaticon.jim-nielsen.com"
          class="hero hero--website"
        >
          <img
            src="/11-gimmiedaticon.png"
            width="1104"
            height="1012"
            alt=""
            style="position: absolute; left: 0; top: 0px"
          />
        </a>
        <h1>
          <a href="https://gimmiedaticon.jim-nielsen.com">Gimmie Dat iCon</a>
          <time>(2015)</time>
        </h1>
        <p>
          A tool to retrieve full-sized icon artwork for any app in the App
          Store (based on a tutorial published for Web Design Tuts+).
        </p>
        <p>Writeup:</p>
        <ul>
          <li>
            <a
              href="https://webdesign.tutsplus.com/series/building-a-mini-api-driven-web-app--cms-866"
              >Building a Mini, API-Driven Web App</a
            >
            <time>(webdesign.tutsplus.com, 2015-08)</time>
          </li>
        </ul>
      </section>

      <hr />

      <section id="employment">
        <a href="#employment">{{{svgs.employment}}}</a>
        <h1>Employment</h1>

        <p>
          More than any job title, project, or company, I’m proud of the
          <em>people</em>
          with whom I’ve worked—
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
          <a href="https://twitter.com/darrenhoyt" title="Darren">honest</a>,
          <a href="https://mayamashkovich.com" title="Maya">delightful</a>, and
          <a href="https://tylergaw.com" title="the gaw">sincere</a> people.
        </p>

        <p>
          Now, here are a few <em>places</em> I’ve worked. Click the company
          name to read writeups on my blog from my time there.
        </p>

        <ul>
          <li>
            Director of Design,
            <a href="https://blog.jim-nielsen.com/tags#remix">Remix</a>
            <time>(2022–Present, Remote)</time>
          </li>
          <li>
            Director of Design,
            <a href="https://blog.jim-nielsen.com/tags#sagesure">SageSure</a>
            <time>(2016–2022, Remote)</time>
          </li>
          <li>
            UI Engineer,
            <a href="https://blog.jim-nielsen.com/tags#timshel">Timshel</a>
            <time>(2016, Remote)</time>
          </li>
          <li>
            Designer & Front-end Engineer,
            <a href="https://blog.jim-nielsen.com/tags#postlight">Postlight</a>
            <time>(2016, Remote)</time>
          </li>
          <li>
            Lead Designer,
            <a href="https://blog.jim-nielsen.com/tags#kindling">Kindling</a>
            <time>(2012–2016, Remote)</time>
          </li>
          <li>
            Web Designer,
            <a href="https://blog.jim-nielsen.com/tags#arc90">Arc90</a>
            <time>(2012, Remote)</time>
          </li>
        </ul>
        <p>
          Sometimes you just want a keyword dump of tools and technologies.
          These are the ones I love—and if I’m honest, some are a love/hate:
        </p>

        <ul class="list-condensed list-condensed--cols">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>RSS</li>
          <li>Markdown</li>
          <li>URLs</li>
          <li>Jekyll</li>
          <li>Figma</li>
          <li>Sketch</li>
          <li>Photoshop</li>
          <li>InDesign</li>
          <li>Sass</li>
          <li>CSS Modules</li>
          <li>jQuery</li>
          <li>Mustache</li>
          <li>Node.js</li>
          <li>Deno</li>
          <li>React</li>
          <li>Preact</li>
          <li>Redux</li>
          <li>Astro</li>
          <li>Metalsmith</li>
          <li>Git</li>
          <li>Prettier</li>
        </ul>
      </section>

      <footer>Thank you for visiting a personal website 🙏</footer>
    </body>
  </html>`;

console.log(template());
