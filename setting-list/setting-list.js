class SettingList extends HTMLElement {
  constructor() {
    super();
    this.enabled = false;
    this.text = "";
    this.description = "";

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <label>
        <slot>Some default</slot>
        <input type="checkbox" />
      </label>
    `;
  }

  connectedCallback() {
    this._render();
  }

  _render() {
    this.shadowRoot.appendChild(this.shadowRoot.querySelector("label"));
  }
}

customElements.define('setting-list', SettingList);
