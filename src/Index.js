const React = require("react");
const Page = require("./components/Page");

const Index = ({ sections, sectionsById }) => {
  return (
    <Page>
      <header class="header">
        <img src="/assets/img/logo.png" width="210" height="103" />

        <h1>Jim Nielsen: Problem Solver.</h1>
        <h2>Currently: Director of Design &amp; UI Architecture @ ICG.</h2>
        <p>
          My expertise is understanding principles that transcend specific
          implementations which enables me to execute on the myriad of tasks
          inherent to building professional web applications – from information
          architecture to visual design to code.
        </p>

        <nav>
          <ul>
            {sections.map(section => (
              <li>
                <a href={`#${section}`}>{sectionsById[section].title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {sections.map(section => {
        const { url, title, data } = sectionsById[section];
        return (
          <article class="section clearfix" id={section.id}>
            <h1 class="section__header">
              {url ? <a href={url}>{title}</a> : title}
            </h1>
            <ul class="section__content">
              {data && data.map(item => <li>{item.title}</li>)}
              {/* {section.id === 'dribbble' && <Dribbble />}
      {<Section id="dribble">} */}
            </ul>
          </article>
        );
      })}
    </Page>
  );
};

module.exports = Index;
