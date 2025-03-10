document.addEventListener("DOMContentLoaded", () => {
  const tableId = "custom_table"; // ID таблицы
  const storageKey = "tableData"; // Ключ для LocalStorage
  const draggableCells = document.querySelectorAll("td[draggable='true']");

  let draggedCell = null;

  // Функция для сохранения данных таблицы в localStorage
  function saveTableData() {
    const tableData = [];
    document.querySelectorAll("td[draggable='true']").forEach((cell) => {
      tableData.push(cell.innerText.trim());
    });
    localStorage.setItem(storageKey, JSON.stringify(tableData));
  }

  // Функция для загрузки данных таблицы из localStorage
  function loadTableData() {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const tableData = JSON.parse(savedData);
      document.querySelectorAll("td[draggable='true']").forEach((cell, index) => {
        if (tableData[index] !== undefined) {
          cell.innerText = tableData[index];
        }
      });
    }
  }

  // Включаем редактирование текста по двойному клику
  draggableCells.forEach((cell) => {
    cell.addEventListener("dblclick", () => {
      const currentText = cell.innerText;
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentText;
      input.classList.add("edit-input");

      input.addEventListener("blur", () => {
        cell.innerText = input.value;
        saveTableData(); // Сохраняем после редактирования
      });

      cell.innerText = "";
      cell.appendChild(input);
      input.focus();
    });

    // Настройка перетаскивания
    cell.addEventListener("dragstart", (e) => {
      draggedCell = cell;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", cell.innerText);
      cell.classList.add("dragging");
    });

    cell.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    cell.addEventListener("drop", (e) => {
      e.preventDefault();
      if (draggedCell !== cell) {
        const temp = draggedCell.innerText;
        draggedCell.innerText = cell.innerText;
        cell.innerText = temp;
        saveTableData(); // Сохраняем после перетаскивания
      }
      draggedCell.classList.remove("dragging");
    });

    cell.addEventListener("dragend", () => {
      if (draggedCell) {
        draggedCell.classList.remove("dragging");
      }
    });
  });

  // Загружаем данные при загрузке страницы
  loadTableData();
});
