class SettingList extends HTMLElement {
  constructor() {
    super();

    this.shadowRoot.innerHTML = `
      <style>
        :host
        {
          --color-primary: #679c16;
          --color-secondary: #989898;
        }
      </style>
      <div>
        
      </div>
    `;
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

  static get observedAttributes() {
    return [];
  }


  _render() {
  }
}

customElements.define('table-list', SettingList);
