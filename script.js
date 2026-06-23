const API_URL = "https://script.google.com/macros/s/AKfycbwosgR2q2u7MBUhHGO69fEE2dEGpmd1IHXZSTwzqmk3ch48xqlKtiN1T5JTxS_b_VXtpQ/exec";

let productionData = [];
let currentSort = {
    key: null,
    direction: "asc"
};

async function loadProductionData() {
    const table = document.getElementById("productionTable");

    table.innerHTML = `
        <div style="padding:20px;">
            Loading production data...
        </div>
    `;

    try {
        const response = await fetch(API_URL);
        productionData = await response.json();
        renderTable(productionData);
    } catch (error) {
        console.error(error);
        table.innerHTML = `
            <div style="padding:20px;color:red;">
                Unable to load production data.
            </div>
        `;
    }
}

function renderTable(data) {
    const table = document.getElementById("productionTable");
    table.innerHTML = "";

    data.forEach((item, index) => {
        const rowWrap = document.createElement("div");
        rowWrap.className = "row-wrap";

        const rowColorClass =
            item.unitId &&
            item.unitId.toLowerCase().includes("unassigned")
                ? "inventory-row"
                : "production-row";

        rowWrap.innerHTML = `
            <div class="row-cells ${rowColorClass}">
                <div>${formatDate(item.dateRequested)}</div>
                <div>${item.unitId || ""}</div>
                <div>${item.sku || ""}</div>
                <div>${item.qty || ""}</div>
                <div>
                    <span class="status ${getStatusClass(item.status)}">
                        ${item.status || ""}
                    </span>
                </div>
            </div>

            <div class="details-link">
                <a href="#" onclick="openModal(${index}); return false;">
                    See Details >
                </a>
            </div>
        `;

        table.appendChild(rowWrap);
    });
}

function sortTable(key) {
    if (currentSort.key === key) {
        currentSort.direction =
            currentSort.direction === "asc" ? "desc" : "asc";
    } else {
        currentSort.key = key;
        currentSort.direction = "asc";
    }

    productionData.sort((a, b) => {
        let valueA = a[key] || "";
        let valueB = b[key] || "";

        if (key === "dateRequested") {
            valueA = new Date(valueA);
            valueB = new Date(valueB);
        }

        if (key === "qty") {
            valueA = Number(valueA);
            valueB = Number(valueB);
        }

        if (valueA < valueB) {
            return currentSort.direction === "asc" ? -1 : 1;
        }

        if (valueA > valueB) {
            return currentSort.direction === "asc" ? 1 : -1;
        }

        return 0;
    });

    renderTable(productionData);
}

function openModal(index) {
    const item = productionData[index];

    document.getElementById("modalOrderId").textContent = item.unitId || "";
    document.getElementById("modalSku").textContent = item.sku || "";
    document.getElementById("modalQty").textContent = "QTY " + (item.qty || "");
    document.getElementById("modalStatus").textContent = item.status || "";
    document.getElementById("modalStatus").className =
        `status large ${getStatusClass(item.status)}`;

    document.getElementById("modalRedlight").textContent =
        item.redlightConfiguration || "";

    document.getElementById("modalSeat").textContent =
        item.seatType || "";

    document.getElementById("modalPlug").textContent =
        item.plugType || "";

    document.getElementById("modalOxygen").textContent =
        item.oxygen || "";

    document.getElementById("modalNotes").textContent =
        item.notes || "None";

    document.getElementById("detailsModal").classList.add("open");
}

function closeModal() {
    document.getElementById("detailsModal").classList.remove("open");
}

function getStatusClass(status) {
    if (!status) return "";

    const value = status.toLowerCase();

    if (value.includes("new")) return "new";
    if (value.includes("ready")) return "ready";
    if (value.includes("production")) return "production";

    return "production";
}

function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (isNaN(date)) {
        return value;
    }

    return `${date.getMonth() + 1}/${date.getDate()}`;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

document.addEventListener("click", function(event) {
    const modal = document.getElementById("detailsModal");

    if (modal && event.target === modal) {
        closeModal();
    }
});

window.onload = function() {
    document.querySelector(".table-header div:nth-child(1)").onclick = () => sortTable("dateRequested");
    document.querySelector(".table-header div:nth-child(2)").onclick = () => sortTable("unitId");
    document.querySelector(".table-header div:nth-child(3)").onclick = () => sortTable("sku");
    document.querySelector(".table-header div:nth-child(4)").onclick = () => sortTable("qty");
    document.querySelector(".table-header div:nth-child(5)").onclick = () => sortTable("status");

    loadProductionData();
};