class PmButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host
{
  --color-primary: #679c16;
  --color-secondary: #989898;
}
button
{
  cursor: pointer;
  line-height: 12px;
  color: #fff;
  font-weight: bold;
  border-radius: 2px;
  display: inline-block;
  width: auto;
  margin: 5px;
  padding: 7px;
  background-color: var(--color-primary);
  border: solid 1px transparent;
}

button:hover
{
  box-shadow: 0px 0px 1px #000;
}

button:after
{
  margin-left: 5px;
}
      </style>
      <button type="button"><slot></slot></button>
    `;
  }
}

customElements.define('pm-button', PmButton);
