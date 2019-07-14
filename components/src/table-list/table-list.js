import {registerActionListener} from "./utils.js";

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
          background-image: url(../../../img/table-list/delete.svg);
        }
        button.icon.delete:hover:after
        {
          background-image: url(../../../img/table-list//delete-hover.svg);
        }
        button.icon.edit:after
        {
          background-image: url(../../../img/table-list//edit.svg);
        }
        button.icon.edit:hover:after
        {
          background-image: url(../../../img/table-list//edit-hover.svg);
        }
        button.icon.whitelist:after
        {
          background-image: url(../../../img/table-list//check-mark.svg);
        }
        button.icon.whitelist:hover:after
        {
          opacity: .8;
        }
        [data-whitelist="true"] button.icon.whitelist:after
        {
          background-image: url(../../../img/table-list//check-mark-active.svg);
        }
        [data-whitelist="true"] [data-whitelist="true"] button.icon.whitelist:after
        {
          background-image: url(../../../img/table-list//check-mark-double-active.svg);
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

    registerActionListener(this, this._onAction);
    this._render();
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
    const {index} = this.indexOfAccessor(accessor);
    if (index >= 0)
    {
      this.items.splice(index, 1);
      if (this.loaded >= index)
      {
        this._onAction("next-sibling", this.listElem.children[index]);
        this.listElem.removeChild(this.listElem.children[index]);
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
    const {index} = this.indexOfAccessor(accessor);
    if (index === false)
      return false;

    const subListItemElem = this._itemFromTmpl(itemObj, this.listSubItemTemplate);
    const item = this.items[index];
    const listItemElem = this.listElem.children[index];

    if (!item.subItems || item.subItems.length == 0)
    {
      listItemElem.dataset.expanded = true;
      item.subItems = [];
      const subListElem = document.createElement("ul");
      subListElem.appendChild(subListItemElem);
      listItemElem.appendChild(subListElem);
      //TODO: Update selectItem() method to handle current casse
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
    const {index} = this.indexOfAccessor(parentAccessor);
    if (index === false)
      return false;

    const item = this.items[index];
    const listItemElem = this.listElem.children[index];
    const subListItemElem = listItemElem.querySelector("ul");

    for (let i = 0; i < item.subItems.length; i++)
    {
      if (item.subItems[i].dataset.access == accessor)
      {
        if (item.subItems.length == 1)
        {
          this._onAction("next-sibling", listItemElem);
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
  indexOfAccessor(accessor, _items)
  {
    if (!_items)
      _items = this.items;
    let index = -1;
    let subIndex = -1;
    for (let i = 0; i < _items.length; i++)
    {
      if (_items[i].dataset.subItems)
        subIndex = findItem(accessor, _items[i].dataset.subItems)
      if (_items[i].dataset.access == accessor)
        index = i;
      if (subIndex >= 0 || index >= 0)
        return {index, subIndex} // break?
    }
    if (!_items)
      return {index, subIndex};

    return -1;
  }

  /**
   * Getting the item
   * @param {String} accessor main item ID
   * @return {JSON} itemObj or false if doesn't exist
   */
  getItem(accessor)
  {
    const {index} = this.indexOfAccessor(accessor);
    if (index >= 0)
      return this.items[index];
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
    const {index} = this.indexOfAccessor(accessor);
    this.items[index] = newItemObj;

    if (this.loaded >= index)
      this._updateListElem(newItemObj, this.listElem.children[index]);
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
   * Managing focus of the element, can select item by ID or switch selection
   * @param {String} accessor Item to select ID, or currently selected ID
   * @param {String} type possible values "next", "previous", "end", "start"
   */
  selectItem(accessor, type)
  {
    const {index} = this.indexOfAccessor(accessor);
    this.getItem(accessor);
    const listElems = this.listElem.children;
    if (!type)
      listElems[index].focus();

    switch (type)
    {
      case "next":
        const nextElem = listElems[index + 1];
        if (!nextElem)
          this.selectItem(null, "start");
        else
          nextElem.focus();
        break;
      case "previous":
        const previousElem = listElems[index - 1];
        if (!previousElem)
          this.selectItem(null, "end");
        else
          previousElem.focus();
        break;
      case "start":
        listElems[0].focus();
        break;
      case "end":
        listElems[listElems.length - 1].focus();
        break;
    }
  }

  /**
   * Action listener
   * @param {String} action
   * @param {Node} element target
   */
  _onAction(action, element)
  {
    switch (action)
    {
      case "next-sibling":
        this.selectItem(element.dataset.access, "next");
        break;
      case "previouse-sibling":
        this.selectItem(element.dataset.access, "previous");
        break;
    }
  }

  _render() {
  }
}

customElements.define('table-list', SettingList);
