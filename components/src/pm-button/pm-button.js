const sheet = new CSSStyleSheet();
sheet.replaceSync(`${pmLoadCSS}`);

class PmButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      ${pmLoadHTML}
    `;
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}

customElements.define('pm-button', PmButton);
