const sites = [
  {
    title: "www.",
    description: "My home page: contact info, side projects, etc.",
  },
  {
    title: "blog.",
    description: "My long-form writing: personal musings on making websites.",
  },
  {
    title: "notes.",
    description: "My short-form writing: notes from others’ writing + my 2¢.",
  },
];

class jimNavbar extends HTMLElement {
  open = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = /*html*/ `
        <button
          id="button"
          aria-label="Toggle navigation dropdown"
          title="Jim Nielsen’s Websites">
          <img
            src="https://www.jim-nielsen.com/.well-known/avatar"
            width="40"
            height="40"
          />
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>
        <div id="dropdown" aria-labelledby="button">
          <h2>
            jim-nielsen.com
          </h2>
          <ul>
            ${sites
              .map(({ title, description }, i) => {
                const isActive = window.location.origin.includes("localhost")
                  ? i === 0
                  : window.location.origin.includes(title);
                return /*html*/ `
                  <li
                    class="${isActive ? "active" : ""}">
                    <a href="https://${title}jim-nielsen.com">
                      <span style="font-weight: 700;">${title}</span>
                      <span style="opacity: .6;">
                        ${description}
                      </span>
                    </a>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </div>
        <style>
          :host {
            display: flex;
            align-items: center;
            justify-content: center;            
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            line-height: 1.4;
            z-index: 1000;
          }

          img {
            border-radius: 50%;
            transition: 0.3s ease opacity
          }

          svg {
            opacity: 0;
            width: 18px;
            height: 18px;
            color: white;
            transition: 1.2s ease opacity;
            position: absolute;
            top: 12px;
            left: 12px;
          }

          #dropdown {
            transform: scale(0);
            transition: .3s ease transform;
            transform-origin: calc(100% - 20px) calc(100% - 20px);
            position: absolute;
            width: 280px;
            padding: 0;
            background: #000;
            color: white;
            bottom: -6px;
            right: -6px;
            font-size: 14px;
            border-radius: 14px;
            z-index: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            border: 1px solid #222
          }
          
          ul {
            margin: 0;
            padding: 0;

            li {
              list-style: none;
              margin: 0;
              padding: 0;
              border-bottom: 1px solid #222;
              position: relative;

              &:hover {
                background: #222;
              }

              &.active:after {
                content: "\\2713";
                color: #fff;
                position: absolute;
                top: 16px;
                left: 12px;
              }

              a {
                padding: 16px 40px 16px 32px;
                color: white;
                text-decoration: none;
                display: flex;
                flex-direction: column;
              }
            }
          }

          h2 {
            padding: 0 16px 0 32px;
            margin: 0;
            font-size: 14px;
            height: 56px;
            display: flex;
            align-items: center;
            order: 2;

            &:before {
              content: '_____.';
              opacity: .3;
            }
          }
 
          button {
            background: none;
            padding: 0;
            margin: 0;
            outline: none;
            border-radius: 50%;
            border: 2px solid transparent;
            z-index: 10;
            transition: .6s ease transform;
            transform-origin: 50%;
            cursor: pointer;
            width: 44px;
            height: 44px;
            box-shadow: 0 0 0 1px #000;

            &:focus { outline: none }
            :focus-visible { box-shadow: 0 0 0 2px blue; }
          }

          @media screen and (min-width: 768px) {
            :host {
              bottom: initial;
              top: 1rem;
            }

            #dropdown {
              transform-origin: calc(100% - 20px) 20px;
              top: -6px;
              bottom: initial;
            }

            h2 {
              order: initial;
            }

            ul li {
              border-bottom: 0;
              border-top: 1px solid #222;
            }
          }
        </style>
      `;
  }

  connectedCallback() {
    const $dropdown = this.shadowRoot.querySelector("#dropdown");
    const $btn = this.shadowRoot.querySelector("button");
    const $img = $btn.querySelector("img");
    const $svg = $btn.querySelector("svg");

    const toggleDropdown = () => {
      $dropdown.style.transform = this.open ? "scale(0)" : "scale(1)";
      $btn.style.transform = this.open ? "rotate(0deg)" : "rotate(-360deg)";
      $img.style.opacity = this.open ? "1" : "0";
      $svg.style.opacity = this.open ? "0" : ".6";
      this.open = !this.open;
    };
    $btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (this.open) toggleDropdown();
    });
  }
}
customElements.define("jim-navbar", jimNavbar);
