class PmTabPanel extends HTMLElement {
  constructor() {
    super();
    this.tabs = [];
    this.selectedTab = null;
  }
  connectedCallback()
  {
    this.tabs = [...this.querySelectorAll("pm-tab")];
    this.addEventListener("click", (e) =>
    {
      this.select(e.target.id);
    });

    this.addEventListener("keydown", ({key}) =>
    {
      if (key === "ArrowUp" || key === "ArrowRight")
        this.selectNextTab();
      if (key === "ArrowDown" || key === "ArrowLeft")
        this.selectPrevTab();
    });
  }

  select(id)
  {
    this.tabs.forEach((tab) =>
    {
      tab._hide();
      if (tab.id === id)
      {
        tab._show();
        this.selectedTab = tab;
      }
    });
  }

  _getSelectedTabIndex()
  {
    return this.tabs.indexOf(this.selectedTab);
  }

  selectNextTab()
  {
    const index = this._getSelectedTabIndex() + 1;
    this.select(this.tabs[index >= this.tabs.length ? 0 : index].id);
  }
  selectPrevTab()
  {
    const index = this._getSelectedTabIndex() - 1;
    this.select(this.tabs[index >= 0 ? index : this.tabs.length - 1].id);
  }
}

class PmTabs extends HTMLElement {
  constructor() {
    super(); 
  }
}

class PmTab extends HTMLElement {
  constructor() {
    super();
    this.panel = null;
  }

  connectedCallback()
  {
    this.setAttribute("role", "tab");
    this.panel = document.querySelector(`[aria-labelledby=${this.id}]`);
  }

  _show()
  {
    this.setAttribute("aria-selected", true);
    this.setAttribute("tabindex", "0");
    this.focus();
    this.panel._show();
  }

  _hide()
  {
    this.removeAttribute("aria-selected");
    this.setAttribute("tabindex", "-1");
    this.panel._hide();
  }
}

class PmPanels extends HTMLElement {
  constructor() {
    super();
  }
}

class PmPanel extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback()
  {
    this.setAttribute("role", "tabpanel");
    this.setAttribute("hidden", true);
  }

  _show()
  {
    this.removeAttribute("hidden");
  }

  _hide()
  {
    this.setAttribute("hidden", true);
  }
}

customElements.define('pm-tab-panel', PmTabPanel);
customElements.define('pm-tab', PmTab);
customElements.define('pm-tabs', PmTabs);
customElements.define('pm-panels', PmPanels);
customElements.define('pm-panel', PmPanel);
