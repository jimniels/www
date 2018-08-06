const React = require("react");

const Page = ({ children }) => {
  return (
    <React.Fragment>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Jim Nielsen: designer, developer, problem solver.</title>
          <meta name="description" content="Personal website of Jim Nielsen" />
          <meta name="author" content="Jim Nielsen" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="/assets/css/reset.css" />
          <link rel="stylesheet" href="/assets/css/styles.css" />
        </head>
        <body>
          <section class="wrapper">
            <div class="main">{children}</div>
          </section>

          <aside class="wrapper">
            <div class="skills">
              <strong>[ ~ ] ls -skills</strong>
              <ul>
                {/* {% for skill in site.data.skills %}
        <li class='{% if skill.divider %}divider{% endif %}'>
          <span>-{{ skill.capability }}</span>
          <span>jim-nielsen</span>
          <span>{{ skill.name }}</span>
        </li>
        {% endfor %} */}
              </ul>
            </div>
          </aside>

          <footer class="wrapper footer">
            <p>
              Want to contact me? Email{" "}
              <a href="mailto:jimniels@gmail.com">jimniels at gmail</a> or tweet{" "}
              <a href="http://twitter.com/jimniels">@jimniels</a>
            </p>
          </footer>
        </body>
      </html>
    </React.Fragment>
  );
};

module.exports = Page;
