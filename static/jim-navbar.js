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
    description: "My short-form writing: notes from others + my 2¢.",
  },
];

class jimNavbar extends HTMLElement {
  open = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = /*html*/ `
      <div id="root" class="collapsed">
        <button
          id="button"
          aria-label="Jim Nielsen’s websites (toggle dropdown)"
          title="Jim Nielsen’s Websites">
          <img
            src="https://www.jim-nielsen.com/.well-known/avatar"
            alt="Portrait photograph of Jim Nielsen"
            width="40"
            height="40"
          />
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
        </button>
        
        <div id="dropdown" aria-labelledby="button">
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
                      <span style="display: flex; font-weight: 700;">
                        <span>${title}</span>
                        <span style="opacity: .4;">jim-nielsen.com</span>
                      </span>
                      <span style="opacity: .7;">
                        ${description}
                      </span>
                    </a>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </div>
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

          :host * {
            box-sizing: border-box;
          }

          img {
            border-radius: 50%;
            transition: 0.15s ease opacity
          }

          svg {
            opacity: 0;
            width: 16px;
            height: 16px;
            color: white;
            transition: 1.2s ease opacity;
            position: absolute;
            top: 12px;
            left: 12px;
          }

          #dropdown {
            z-index: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: .3s ease opacity;
            width: 280px;
          }

          #root {
            color: white;
            font-size: 14px;
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          #root:before {
            content: "";
            position: absolute;
            
            background: #000;
            transition: .3s ease all;
          }

          #root.collapsed:before,
          #root.collapsing:before {
            bottom: -2px;
            right: -2px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }

          #root.collapsed #dropdown {
            display: none;
          }
          #root.expanded #dropdown {
            display: inherit;
          }

          #root.expanded:before,
          #root.expanding:before {
            width: calc(100% + 16px);
            height: calc(100% + 16px);
            bottom: -8px;
            right: -10px;
            border-radius: 13px;

            border: 2px solid #fff;
            box-shadow: 0 0 0 2px #000;
          }
          
          .collapsed #dropdown {
            visibility: hidden;
            opacity: 0;
          }
          .collapsed img {
            opacity: 1;
            transform: rotate(0deg);
          }
          .collapsed svg {
            opacity: 0;
            visibility: hidden;
          }            
        
          .expanding #dropdown,
          .expanded #dropdown {
            opacity: 0;
          }
          .expanding img,
          .expanded img {
            opacity: 0;
          }
          .expanding button,
          .expanded button {
            transform: rotate(-360deg);
          }
          .expanding svg,
          .expanded svg{
            opacity: 1;
          }
          
          .expanded #dropdown {
            opacity: 1;
            visibility: visible;
          }
          
          .collapsing #dropdown {
            opacity: 0;
          }
          .collapsing  img {
            opacity: 0;
          }
          
          
          ul {
            margin: 0;
            padding: 0;
          }
          ul li {
            list-style: none;
            margin: 0;
            padding: 0;
            position: relative;
            border-radius: 5px;
          }
          ul li:hover {
            background: #222;
          }

          ul li.active:after {
            content: "\\2713";
            color: #fff;
            position: absolute;
            top: 16px;
            left: 12px;
          }

          ul li a {
            padding: 16px 40px 16px 32px;
            color: white;
            text-decoration: none;
            display: flex;
            flex-direction: column;
          }
           

          button {
            background: none;
            padding: 0;
            margin: 0;
            outline: none;
            border: none;
            z-index: 10;
            transition: .6s ease transform;
            transform-origin: 50%;
            cursor: pointer;
            width: 40px;
            height: 40px;
            position: relative;
            z-index: 10;
            margin-left: auto;
            order: 1;
          }

          button:focus { outline: none }
          button:focus-visible { box-shadow: 0 0 0 3px blue; }
        

          @media screen and (min-width: 768px) {
            :host {
              bottom: initial;
              top: 1rem;
            }

            #root.collapsed:before,
            #root.collapsing:before {
              top: -2px;
              bottom: initial;
            }

            #root.expanded:before,
            #root.expanding:before {
              bottom: initial;
              top: -8px;
            }
            

            #dropdown {
              transform-origin: calc(100% - 20px) 20px;
              top: 0px;
              bottom: initial;
              padding-bottom: 0;
            }

            h2 {
              order: initial;
            }

            button {
              order: initial;
            }
          }
        </style>
      `;
  }

  connectedCallback() {
    const $root = this.shadowRoot.querySelector("#root");
    const $btn = this.shadowRoot.querySelector("button");

    const toggleDropdown = () => {
      if (this.open) {
        $root.classList.remove("expanded");
        $root.classList.add("collapsing");
      } else {
        $root.classList.remove("collapsed");
        $root.classList.add("expanding");
      }

      this.open = !this.open;

      setTimeout(() => {
        if (this.open) {
          $root.classList.remove("expanding");
          $root.classList.add("expanded");
        } else {
          $root.classList.remove("collapsing");
          $root.classList.add("collapsed");
        }
      }, 300);
    };
    $btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    document.addEventListener("click", (e) => {
      if (this.open) toggleDropdown();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.open) toggleDropdown();
    });
  }
}
customElements.define("jim-navbar", jimNavbar);
