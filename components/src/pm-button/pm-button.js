class PmButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        ${pmLoadCSS}
      </style>
      ${pmLoadHTML}
    `;
  }
}

customElements.define('pm-button', PmButton);
