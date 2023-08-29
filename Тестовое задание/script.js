const calendarContainer = document.querySelector(".contribution-graph");
const infoOverlay = document.querySelector(".info-overlay");
const infoDate = document.querySelector(".info-date");
const infoContributions = document.querySelector(".info-contributions");

// Загрузка данных с сервера
async function loadData() {
    try {
        const response = await fetch("https://dpg.gg/test/calendar.json");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        return [];
    }
}

// Создание ячейки с соответствующим классом цвета
function createCell(contributions) {
    const cell = document.createElement("div");
    cell.className = getCellClass(contributions);
    return cell;
}

// Определение класса цвета ячейки на основе количества контрибуций
function getCellClass(contributions) {
    if (contributions === 0) return "cell-no-contributions";
    if (contributions >= 1 && contributions <= 9) return "cell-low-contributions";
    if (contributions >= 10 && contributions <= 19) return "cell-medium-contributions";
    if (contributions >= 20 && contributions <= 29) return "cell-high-contributions";
    return "cell-very-high-contributions";
}

// Отрисовка графика
async function drawGraph() {
    const data = await loadData();

    for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 51; col++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - (51 - col - 1) * 7 + row);
            const dateString = currentDate.toISOString().split("T")[0];
            const contributions = data[dateString] || 0;

            const cell = createCell(contributions);
            calendarContainer.appendChild(cell);

            // Добавьте обработчик события нажатия на клетку
            cell.addEventListener("click", (event) => {
                showInfoOverlay(currentDate.toDateString(), contributions, event.clientX, event.clientY);
            });
        }
    }
}

// Показать информацию о дате и контрибуциях
function showInfoOverlay(date, contributions, x, y) {
    infoDate.textContent = "Дата: " + date;
    infoContributions.textContent = "Контрибуции: " + contributions;
    infoOverlay.style.display = "block";
    infoOverlay.style.left = (x + 10) + "px"; /* Позиционирование по горизонтали */
    infoOverlay.style.top = (y + 10) + "px"; /* Позиционирование по вертикали */
}

// Закрыть информационный оверлей
infoOverlay.addEventListener("click", () => {
    infoOverlay.style.display = "none";
});

// Запуск отрисовки при загрузке страницы
drawGraph();
