export default class SortableTable {
  element;
  subElements = {};

  onSortClick = (event) => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = (order) => {
      const orders = {
        asc: "desc",
        desc: "asc",
      };
      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      const sortedData = this.sortData(id, newOrder);
      const arrow = column.querySelector(".sortable-table__sort-arrow");

      column.dataset.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }

      this.subElements.body.innerHTML = this.getTableRows(sortedData);
    }

    return column;
  };

  constructor(headersConfig, { data = [], sorted = {} } = {}) {
    this.data = data;
    this.headerConfig = headersConfig;
    this.sorted = sorted;

    this.render();
  }

  render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement("div");
    const sortedData = this.sortData(id, order);

    wrapper.innerHTML = this.getTable(sortedData);

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener("pointerdown", this.onSortClick);
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find((item) => item.id === field);
    const { sortType } = column;
    const direction = order === "asc" ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case "number":
          return direction * (a[field] - b[field]);
        case "string":
          return direction * a[field].localeCompare(b[field], ["ru", "en"]);
        default:
          throw new Error(`Unknown type ${sortType}`);
      }
    });
  }

  getTable(data) {
    return `
      <div class="sortable-table">
      ${this.getTableHeader()}
      ${this.getTableBody(data)}     
      </div>
    `;
  }

  getTableHeader() {
    return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map((item) => this.getHeaderRow(item)).join("")}
    </div>
    `;
  }
  getHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : "asc";
    return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
      <span>${title}</span>
      ${this.getHeaderSortingArrow(id)}
    </div>`;
  }
  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : "";

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : "";
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>
    `;
  }
  getTableRows(data) {
    return data
      .map((item) => {
        return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)} 
        </a>
      `;
      })
      .join("");
  }
  getTableRow(product) {
    const cells = this.headerConfig.map(({ id, template }) => {
      return { id: id, template: template };
    });
    return cells
      .map(({ id, template }) => {
        return template
          ? template(product[id])
          : `<div class="sortable-table__cell">${product[id]}</div>`;
      })
      .join("");
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
