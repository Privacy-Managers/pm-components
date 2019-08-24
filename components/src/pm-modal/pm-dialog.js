class SettingList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
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

        #dialog .body > div,
        #dialog .header > span,
        #dialog[data-dialog="cookie-add"] #cookie-edit-control,
        #dialog[data-dialog="cookie-edit"] #cookie-add-control
        {
          display: none;
        }

        #dialog[data-dialog="cookie-add"] #dialog-header-cookie-add,
        #dialog[data-dialog="cookie-edit"] #dialog-header-cookie-edit,
        #dialog[data-dialog="cookies-delete-all"] #dialog-header-cookie-delete-all,
        #dialog[data-dialog="setting-info"] #dialog-header-setting-info,
        #dialog[data-dialog="cookie-add"] #dialog-content-cookie-form,
        #dialog[data-dialog="cookie-edit"] #dialog-content-cookie-form,
        #dialog[data-dialog="cookies-delete-all"] #dialog-content-cookie-delete-all,
        #dialog[data-dialog="setting-info"] #dialog-content-setting-info
        {
          display: block;
        }

        #dialog > div:first-child
        {
          width: 90%;
          background-color: #f3f3f3;
          border-radius: 10px;
          box-shadow: 0 4px 23px -3px black;
          margin: auto;
        }

        #dialog .header
        {
          display: flex;
          background-color: var(--color-primary);
          padding: 5px;
          color: #fff;
          font-size: 14px;
        }

        #dialog .header span
        {
          padding: 5px;
          flex-grow: 1;
        }

        #dialog .body
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
      </style>
      <div>
        <span id="label" tabindex="0"><slot>Some default</slot></span>
        <button aria-labelledby="label" role="checkbox" type="button">
          <span id="btn-on-label">On</span>
          <span id="btn-off-label">Off</span>
        </button>
      </div>
    `;
  }

  /**
   * Invoked each time the custom element is appended into a DOM element
   */
  connectedCallback()
  {
    // TODO: Add actions on connection
    this._render();
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

  }
}

customElements.define('setting-list', SettingList);
