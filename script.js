// script.js

function openModal() {
    const modal = document.getElementById("detailsModal");
    modal.classList.add("open");
}

function closeModal() {
    const modal = document.getElementById("detailsModal");
    modal.classList.remove("open");
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

document.getElementById("detailsModal").addEventListener("click", function (event) {
    if (event.target.id === "detailsModal") {
        closeModal();
    }
});
