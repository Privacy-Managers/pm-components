class SettingList extends HTMLElement {
  constructor() {
    super();

    this.items = [];
    // TODO: add setSort method.
    this.sort = (a, b) => a.dataset.access.localeCompare(b.dataset.access);
    this.listElem = null;
    this.listItemTemplate = null;
    this.listSubItemTemplate = null;
    this.loaded = 0;
    this.loadAmount = 50;
    this.scrollLoadPercentage = 0.8;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        .tableList,
        .tableList ul
        {
          list-style: none;
          font-size: 13px;
          overflow: auto;
          padding: 0px;
        }

        .tableList
        {
          height: 270px;
        }

        .tableList ul
        {
          padding-bottom: 10px;
        }

        .tableList li > div
        {
          display: flex;
          padding: 5px 5px;
          align-items: center;
          cursor: pointer;
        }

        .tableList li > div:hover
        {
          background-color: #cee0c2;
        }

        .tableList li[data-expanded="true"] > ul
        {
          border-top: 1px solid #324B2C;
        }

        .tableList li .data-container
        {
          flex-grow: 1;
        }

        .tableList li span
        {
          display: inline-block;
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
          background-image: url(delete.svg);
        }
        button.icon.delete:hover:after
        {
          background-image: url(delete-hover.svg);
        }
        button.icon.edit:after
        {
          background-image: url(edit.svg);
        }
        button.icon.edit:hover:after
        {
          background-image: url(edit-hover.svg);
        }
        button.icon.whitelist:after
        {
          background-image: url(check-mark.svg);
        }
        button.icon.whitelist:hover:after
        {
          opacity: .8;
        }
        [data-whitelist="true"] button.icon.whitelist:after
        {
          background-image: url(check-mark-active.svg);
        }
        [data-whitelist="true"] [data-whitelist="true"] button.icon.whitelist:after
        {
          background-image: url(check-mark-double-active.svg);
        }
        .tableList .domainName
        {
          width: 300px
        }
        .tableList .cookieName
        {
          width: 280px;
        }
        .tableList .cookieValue
        {
          width: 100px;
          white-space: pre;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
      <ul class="tableList "></ul>
    `;
  }

  connectedCallback()
  {
    this.listItemTemplate = document.querySelector("#cookiesListTemplate"); // TODO: make this dynamic
    this.listSubItemTemplate = document.querySelector("#cookiesSubListTemplate");
    this.listElem = this.shadowRoot.querySelector("ul");
    this.listElem.addEventListener("scroll", this._onScroll.bind(this), false);

    this.listElem.addEventListener("keydown", function(ev)
    {
      // Prevent the scrollable list from scrolling
      if (ev.key == "ArrowDown" || ev.key == "ArrowUp")
      {
        ev.preventDefault();
      }
    }, false);

    // registerActionListener(this.listElem, this.onAction.bind(this));
    this._render();
  }

  attributeChangedCallback(name, oldValue, newValue)
  {
  }

  static get observedAttributes()
  {
    return [];
  }

  /**
   * Add items to the Table list
   * @param {Array} itemObjs array of itemObj:
   * {
   *   dataset:  { access: "example.com", datasetname: "/" },
   *   texts: {data-text-value: "example.com", data-text-value: "3 Cookies"}
   * }
   */
  addItems(itemObjs)
  {
    this.items = this.items.concat(itemObjs);

    if (this.sort)
      this.items.sort(this.sort);

    for (let i = 0; i < itemObjs.length; i++)
    {
      const itemObj = itemObjs[i];
      const itemIndex = this.items.indexOf(itemObj);
  
      if (itemIndex < this.loaded || itemIndex <= this.loadAmount)
        this._loadItem(itemObj);
    }
  }

  /**
   * Load item into the view
   * @param  {JSON} itemObj as specified in addItems
   */
  _loadItem(itemObj)
  {
    if (!itemObj.dataset)
      itemObj.dataset = {};

    if (!itemObj.dataset.access)
      itemObj.dataset.access = this.items.indexOf(itemObj);

    const listItem = this._itemFromTmpl(itemObj, this.listItemTemplate);
    const itemIndex = this.items.indexOf(itemObj);
    const elemAfter = this.listElem.children[itemIndex];

    if (elemAfter)
      this.listElem.insertBefore(listItem, elemAfter);
    else
      this.listElem.appendChild(listItem);

    this.loaded++;
  }

  /**
   * Scroll bar event handler
   */
  _onScroll()
  {
    const listClientScrollBottom = this.listElem.scrollTop +
      this.listElem.clientHeight;
    const percentage = listClientScrollBottom / this.listElem.scrollHeight;
    if (percentage > this.scrollLoadPercentage && this.loaded < this.items.length)
    {
      const loadLimit = this.loaded + this.loadAmount;
      for (let i = this.loaded; i < loadLimit && i < this.items.length; i++)
      {
        this._loadItem(this.items[i]);
      }
    }
  }

  /**
   * Remove main item by ID
   * @param {String} accessor main item ID
   * @param {Boolean} result
   */
  removeItem(accessor)
  {
    const itemIndex = this.indexOfAccessor(accessor);
    if (itemIndex >= 0)
    {
      this.items.splice(itemIndex, 1);
      if (this.loaded >= itemIndex)
      {
        this.onAction("next-sibling", this.listElem.children[itemIndex]);
        this.listElem.removeChild(this.listElem.children[itemIndex]);
      }
      return true;
    }
    return false;
  }

  /**
   * Add subitem
   * @param {JSON} itemObj as specified in addItems
   * @param {String} accessor item ID
   */
  addSubItem(itemObj, accessor)
  {
    const itemIndex = this.indexOfAccessor(accessor);
    if (itemIndex === false)
      return false;

    const subListItemElem = this._itemFromTmpl(itemObj, this.listSubItemTemplate);
    const item = this.items[itemIndex];
    const listItemElem = this.listElem.children[itemIndex];

    if (!item.subItems || item.subItems.length == 0)
    {
      listItemElem.dataset.expanded = true;
      item.subItems = [];
      const subListElem = document.createElement("ul");
      subListElem.appendChild(subListItemElem);
      listItemElem.appendChild(subListElem);
      this.focusEdgeElem(subListElem, true);
    }
    else
    {
      listItemElem.querySelector("ul").appendChild(subListItemElem);
    }
    item.subItems.push(itemObj);
  }

  /**
   * Remove subitem
   * @param {String} parentAccessor main item ID
   * @param {String} accessor subItem ID
   */
  removeSubItem(parentAccessor, accessor)
  {
    const itemIndex = this.indexOfAccessor(parentAccessor);
    if (itemIndex === false)
      return false;

    const item = this.items[itemIndex];
    const listItemElem = this.listElem.children[itemIndex];
    const subListItemElem = listItemElem.querySelector("ul");

    for (let i = 0; i < item.subItems.length; i++)
    {
      if (item.subItems[i].dataset.access == accessor)
      {
        if (item.subItems.length == 1)
        {
          this.onAction("next-sibling", listItemElem);
          listItemElem.removeChild(subListItemElem);
        }
        else
        {
          subListItemElem.children[i].parentElement.removeChild(
            subListItemElem.children[i]);
        }
        item.subItems.splice(i, 1);
      }
    }
  }

  /**
   * Remove All sub items
   * @param {String} accessor main item ID
   */
  removeAllSubItems(accessor)
  {
    const item = this.getItem(accessor);
    if (!item)
      return false;

    let i = item.subItems.length;
    while (i--) // Avoide re-indexing
      this.removeSubItem(item.dataset.access, item.subItems[i].dataset.access);

    delete item.subItems;
  }

  /**
   * Check for subItem existance
   * @param {String} accessor main item ID
   * @param {String} accessor subItem ID
   * @return {Boolean} result
   */
  hasSubItem(parentAccessor, accessor)
  {
    const parentItem = this.getItem(parentAccessor);
    if (!parentItem || !parentItem.subItems)
      return false;

    for (let i = 0; i < parentItem.subItems.length; i++)
    {
      if (parentItem.subItems[i].dataset.access == accessor)
        return true;
    }
    return false;
  }

  /**
   * Update list element using itemObj
   * @param {JSON} itemObj
   * @param {Node} listElem target <li> element
   */
  _updateListElem(itemObj, listElem)
  {
    const datasetObj = itemObj.dataset;
    for (const name in datasetObj)
      listElem.dataset[name] = datasetObj[name];

    const textsObj = itemObj.texts;
    for (const name in textsObj)
    {
      const textElement = listElem.querySelector("[data-text='"+ name +"']");
      if (textElement)
        textElement.textContent = textsObj[name];
    }
    const titleObjs = itemObj.titles;
    for (const title in titleObjs)
    {
      const titleElement = listElem.querySelector("[data-text='"+ title +"']");
      if (titleElement)
        titleElement.title = titleObjs[title];
    }

    // Set default tabindex to the first list Element
    if (this.listElem.childElementCount == 0)
      listElem.setAttribute("tabindex", "0");
    else
      listElem.setAttribute("tabindex", "-1");
  }

  /**
   * Create list element from template
   * @param {JSON} itemObj
   * @param {Template} template
   * @return {Node} node
   */
  _itemFromTmpl(itemObj, template)
  {
    const tmpContent = template.content;
    const tmpList = tmpContent.querySelector("li");

    this._updateListElem(itemObj, tmpList);
    return document.importNode(tmpContent, true);
  }

  /**
   * Empty data and view
   */
  empty()
  {
    this.items = [];
    this.listElem.innerHTML = "";
  }

  /**
   * Get the index (position) of the item
   * @param {String} accessor
   * @return {Number} index of the item or false if can't find
   */
  indexOfAccessor(accessor)
  {
    for (let i = 0; i < this.items.length; i++)
    {
      if (this.items[i].dataset.access == accessor)
        return i;
    }
    return false;
  }

  /**
   * Getting the item
   * @param {String} accessor main item ID
   * @return {JSON} itemObj or false if doesn't exist
   */
  getItem(accessor)
  {
    const itemIndex = this.indexOfAccessor(accessor);
    if (itemIndex >= 0)
      return this.items[itemIndex];
    else
      return false;
  }

  /**
   * Update the item and DOM
   * @param {JSON} newItemObj
   * @param {String} accessor ID of the main Item
   */
  updateItem(newItemObj, accessor)
  {
    const itemIndex = this.indexOfAccessor(accessor);
    this.items[itemIndex] = newItemObj;

    if (this.loaded >= itemIndex)
      this._updateListElem(newItemObj, this.listElem.children[itemIndex]);
  }

  /**
   * Reverse focus first or last list item
   * @param {Node} parentElement list item parent element
   * @param {Boolean} isFirst focus first if true otherwise last element
   */
  focusEdgeElem(parentElement, isFirst)
  {
    //TODO: use utils method instead 
    let childElem = isFirst ? parentElement.firstChild : parentElement.lastChild;
    while(childElem != null && childElem.nodeType == 3)
      childElem = isFirst ? childElem.nextSibling : childElem.previousSibling;

    if (childElem)
      childElem.focus();
  }

  /**
   * Action listener
   * @param {String} action
   * @param {Node} element target
   */
  onAction(action, element)
  {
    switch (action)
    {
      case "next-sibling":
        const isNext = true;
        break;
      case "previouse-sibling":
        let sibling = isNext ? element.nextSibling : element.previousSibling;
        while (sibling && sibling.nodeType != 1)
          sibling = isNext ? sibling.nextSibling : sibling.previousSibling;

        if (sibling)
          sibling.focus();
        else
          this.focusEdgeElem(element.parentNode, isNext);
        break;
    }
  }

  _render() {
  }
}

customElements.define('table-list', SettingList);
