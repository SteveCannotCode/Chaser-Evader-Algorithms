"use strict";

(() => {
  const propertyOrder = ["empty", "wall", "chaser", "evader"];
  const propertyNames = {
    empty: "Empty",
    wall: "Wall",
    chaser: "Chaser",
    evader: "Evader"
  };
  const propertyMarks = { empty: "", wall: "W", chaser: "C", evader: "E" };
  const gridElement = document.querySelector("#grid");
  const resetGridButton = document.querySelector("#reset-grid");
  const columnsInput = document.querySelector("#grid-columns");
  const rowsInput = document.querySelector("#grid-rows");
  const gridStatus = document.querySelector("#grid-status");
  const gridSize = document.querySelector("#grid-size");
  const cellCount = document.querySelector("#cell-count");
  const countElements = {
    empty: document.querySelector("#empty-count"),
    wall: document.querySelector("#wall-count"),
    chaser: document.querySelector("#chaser-count"),
    evader: document.querySelector("#evader-count")
  };
  let columns = Number(columnsInput.value);
  let rows = Number(rowsInput.value);
  let cells = Array(columns * rows).fill("empty");

  function cellLabel(index, property) {
    const row = Math.floor(index / columns) + 1;
    const column = (index % columns) + 1;
    return `Row ${row}, column ${column}: ${propertyNames[property]}. Click to change cell.`;
  }

  function updateCellElement(element, index) {
    const property = cells[index];
    element.className = `cell cell-${property}`;
    element.textContent = propertyMarks[property];
    element.setAttribute("aria-label", cellLabel(index, property));
    element.title = cellLabel(index, property);
  }

  function updateCounts() {
    const counts = { empty: 0, wall: 0, chaser: 0, evader: 0 };
    for (const property of cells) counts[property] += 1;
    for (const property of propertyOrder) {
      countElements[property].textContent = String(counts[property]);
    }
  }

  function renderGrid() {
    const fragment = document.createDocumentFragment();
    gridElement.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
    gridElement.setAttribute("aria-label", `Editable ${columns} column by ${rows} row grid. Click a cell to cycle its property.`);
    cells.forEach((property, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `cell cell-${property}`;
      cell.dataset.index = String(index);
      cell.textContent = propertyMarks[property];
      cell.setAttribute("aria-label", cellLabel(index, property));
      cell.title = cellLabel(index, property);
      fragment.append(cell);
    });
    gridElement.replaceChildren(fragment);
    gridSize.textContent = `${columns} × ${rows}`;
    cellCount.textContent = `${columns * rows} cells`;
    updateCounts();
  }

  function nextProperty(index) {
    const currentPosition = propertyOrder.indexOf(cells[index]);
    for (let offset = 1; offset <= propertyOrder.length; offset += 1) {
      const candidate = propertyOrder[(currentPosition + offset) % propertyOrder.length];
      if (candidate === "chaser" || candidate === "evader") {
        const alreadyPlaced = cells.some((property, cellIndex) =>
          property === candidate && cellIndex !== index
        );
        if (alreadyPlaced) continue;
      }
      return candidate;
    }
    return cells[index];
  }

  function resizeGrid() {
    if (!columnsInput.reportValidity() || !rowsInput.reportValidity()) return;
    const nextColumns = Number(columnsInput.value);
    const nextRows = Number(rowsInput.value);
    const resizedCells = Array(nextColumns * nextRows).fill("empty");
    const seen = new Set();
    for (let row = 0; row < Math.min(rows, nextRows); row += 1) {
      for (let column = 0; column < Math.min(columns, nextColumns); column += 1) {
        const property = cells[row * columns + column];
        if ((property === "chaser" || property === "evader") && seen.has(property)) continue;
        resizedCells[row * nextColumns + column] = property;
        if (property === "chaser" || property === "evader") seen.add(property);
      }
    }
    columns = nextColumns;
    rows = nextRows;
    cells = resizedCells;
    renderGrid();
    gridStatus.textContent = `Grid resized to ${columns} columns by ${rows} rows.`;
  }

  gridElement.addEventListener("click", (event) => {
    const cell = event.target.closest("button[data-index]");
    if (!cell) return;
    const index = Number(cell.dataset.index);
    const property = nextProperty(index);
    cells[index] = property;
    updateCellElement(cell, index);
    updateCounts();
    gridStatus.textContent = `Row ${Math.floor(index / columns) + 1}, column ${(index % columns) + 1} changed to ${propertyNames[property]}.`;
  });

  columnsInput.addEventListener("change", resizeGrid);
  rowsInput.addEventListener("change", resizeGrid);
  resetGridButton.addEventListener("click", () => {
    cells = Array(columns * rows).fill("empty");
    renderGrid();
    gridStatus.textContent = `Grid reset. All ${columns * rows} cells are empty.`;
  });

  const delayInput = document.querySelector("#move-delay");
  const delayValue = document.querySelector("#move-delay-value");
  function updateDelay() {
    const value = Number(delayInput.value);
    delayValue.innerHTML = `${value.toFixed(1)} <span>sec</span>`;
    delayInput.style.background = `linear-gradient(90deg, #617ff0 0%, #617ff0 ${(value / 3) * 100}%, #e8ebf2 ${(value / 3) * 100}%)`;
  }
  delayInput.addEventListener("input", updateDelay);
  updateDelay();

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  function activateTab(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab)));
  document.querySelector('[role="tablist"]').addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(document.activeElement);
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activateTab(tabs[nextIndex], true);
  });

  renderGrid();
})();
