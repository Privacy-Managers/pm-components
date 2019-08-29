class ModalDialog extends HTMLElement {
  constructor() {
    super();
    
    this.modalTitle = "";
    this.fields = [];

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host
        {
          --color-primary: #679c16;
        }
        #dialog
        {
          position: absolute;
          display: flex;
          top: 0px;
          width: 100%;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          background-color: rgba(219, 226, 221, 0.5);
          transition: all 0.2s;
        }
        /* Dialog animation */
        #dialog[aria-hidden="true"]
        {
          opacity: 0;
          transform: scale(0.5, 0.5);
          visibility: hidden;
        }
        /* Dialog animation */
        #dialog[aria-hidden="false"]
        {
          transform: scale(1, 1);
          visibility: visible;
          opacity: 1;
        }
        #dialog > div:first-child
        {
          width: 90%;
          background-color: #f3f3f3;
          border-radius: 10px;
          box-shadow: 0 4px 23px -3px black;
          margin: auto;
        }
        header
        {
          display: flex;
          background-color: var(--color-primary);
          padding: 5px;
          color: #fff;
          font-size: 14px;
        }
        header span
        {
          padding: 5px;
          flex-grow: 1;
        }
        #dialog #body
        {
          padding: 10px;
          font-size: 12px;
          line-height: 16px;
        }
        #dialog .fieldset-container
        {
          display: flex;
          justify-content: space-between;
        }
        #dialog form label
        {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          flex-wrap: wrap;
          padding: 0px 20px;
        }
        #dialog form label span
        {
          padding: 0px 10px;
        }
        #dialog form input[type="text"],
        #dialog form input[type="date"],
        #dialog form input[type="time"]
        {
          width: 150px;
        }
        #dialog form input[type="number"]
        {
          width: 30px;
        }
        #dialog .controls
        {
          padding: 0px 10px;
        }
        button.icon
        {
          background-color: transparent;
          border: none;
          width: 20px;
          padding: 0px;
          cursor: default;
        }
        button.icon:after
        {
          display: inline-block;
          content: "";
          width: 10px;
          height: 10px;
          margin: 0px auto;
        }
        button.icon.delete:after
        {
          background-image: url(../../../img/pm-dialog/delete.svg);
        }

        button.icon.delete:hover:after
        {
          background-image: url(../../../img/pm-dialog/delete-hover.svg);
        }
      </style>
      <div id="dialog" data-keyQuite="close-dialog" role="dialog" aria-hidden="true">
        <div>
          <header>
            <span></span>
            <button data-action="close-dialog" class="icon delete"></button>
          </header>
          <div id="body"></div>
        </div>
      </div>
    `;
  }

  /**
   * Invoked each time the custom element is appended into a DOM element
   */
  connectedCallback()
  {
    this.shadowRoot.querySelector("#body").appendChild(document.importNode(this.querySelector("template").content, true));
    this._render();
  }

  setData(item)
  {
    if (item.title)
      this.modalTitle = item.title;
    if (item.fields)
      this.fields = item.fields;
    this._render();
  }

  showDialog()
  {
    this.shadowRoot.querySelector("[role='dialog']").setAttribute("aria-hidden", false);
  }

  closeDialod()
  {
    this.shadowRoot.querySelector("[role='dialog']").setAttribute("aria-hidden", true);
  }

  /**
   * Called each time an attribute on the custom element is changed
   * @param {String} name attribute name
   * @param {String} oldValue Old value of the attribute
   * @param {String} newValue New value of the attribute
   */
  attributeChangedCallback(name, oldValue, newValue)
  {
    if (oldValue === newValue) {
      return;
    }
    // TODO: Check for values
    if (this.connected)
      this._render();
  }

  static get observedAttributes() {
    // TODO: Add observables
    return [];
  }

  /**
   * Render method to be called after each state change
   */
  _render() {
    this.shadowRoot.querySelector("header span").textContent = this.modalTitle;
    for (const dataset in this.fields)
    {
      const value = this.fields[dataset];
      const element = this.shadowRoot.querySelector(`[data-${dataset}]`);
      if (element)
        element.textContent = value;
    }
  }
}

customElements.define('pm-dialog', ModalDialog);
