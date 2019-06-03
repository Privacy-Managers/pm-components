class SettingList extends HTMLElement {
  constructor() {
    super();
    this.text = "btn-txt";
    this.description = "btn-desc";
    this.checkboxElem = null;
    this.containerElem = null;
    this.labelElem = null;
    this.connected = false;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host
        {
          --color-primary: #679c16;
          --color-secondary: #989898;
        }
        div
        {
          display: flex;
          align-items: center;
        }
        #label
        {
          display: flex;
          flex-grow: 1;
          font-size: 13px;
          padding-bottom: 4px;
          vertical-align: top;
          word-wrap: break-word;
          margin-right: 10px;
          align-items: center;
        }
        #label::after
        {
          content: "";
          border: none;
          display: inline-block;
          width: 12px;
          height: 12px;
          background: url(info.svg) center no-repeat transparent;
          margin: 0px 3px;
        }
        button[role="checkbox"]
        {
          font-size: 0px; /* Fighting the Space Between Inline Block Elements */
          background: none;
          border: 0px;
          cursor: pointer;
          padding: 0px;
          display: flex;
        }
        button[role="checkbox"] > span
        {
          font-size: 12px;
          line-height: 19px;
          padding: 0 6px;
          border: 1px solid var(--color-secondary);
        }
        /*#7f7f7f #8abc25 #f8f8f8 */
        button[role="checkbox"] > span:first-child
        {
          border-radius: 5px 0px 0px 5px;
          border-right: 0px;
        }
        button[role="checkbox"] > span:last-child
        {
          border-radius: 0px 5px 5px 0px;
          background-color: var(--color-secondary);
          color: #fff;
        }
        :host([checked]) button[role="checkbox"] > span:first-child
        {
          background-color: var(--color-primary);
          color: #fff;
        }
        :host([checked]) button[role="checkbox"] > span:last-child
        {
          color: #000;
          background: none;
        }
      </style>
      <div>
        <span id="label"><slot>Some default</slot></span>
        <button aria-labelledby="label" role="checkbox">
          <span id="btn-on-label">On</span>
          <span id="btn-off-label">Off</span>
        </button>
      </div>
    `;
  }

  connectedCallback() {
    this.connected = true;
    this.toggleElem = this.shadowRoot.querySelector("button");
    this.containerElem = this.shadowRoot.querySelector("div");
    this.labelElem = this.shadowRoot.querySelector("#label");
    this.setAttribute("checked", "");
    if (this.dataset.msg)
      this.text = this.dataset.msg;
    if (this.dataset.desc)
      this.description = this.dataset.desc;

    this.labelElem.addEventListener("click", (e) =>
    {
      e.preventDefault();
    });

    this.toggleElem.addEventListener("click", (e) =>
    {
      const changed = new CustomEvent("change");
      this.dispatchEvent(changed);
    });

    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === "text") {
      this.text = newValue;
    }
    else if (name === "description") {
      this.description = newValue;
    }
    if (this.connected)
      this._render();
  }

  static get observedAttributes() {
    return ["text", "description"];
  }

  _getMsg(id)
  {
    // Mock data
    const data = 
    {
      "btn-txt": "Label text",
      "btn-desc": "Longer, more informative description of the toggle button"
    };

    return data[id] || id;
  }

  isEnabled()
  {
    return this.checkboxElem.checked;
  }

  setEnabled(status)
  {
    this.checkboxElem.checked = status;
  }

  toggle()
  {
    this.checkboxElem.checked = !this.checkboxElem.checked;
  }

  _render() {
    this.labelElem.textContent = this._getMsg(this.text);
    this.containerElem.setAttribute("title", this._getMsg(this.description));
    this.shadowRoot.appendChild(this.containerElem);
  }
}

customElements.define('setting-list', SettingList);
