// UI.js
class UI {
    constructor() {
        this.tray = document.getElementById("tray");
        this.createTrayButtons();
    }

    // ---------------------------------------------------------
    // CREATE ITEM BUTTONS
    // ---------------------------------------------------------
    createTrayButtons() {
        for (const key in window.Items) {
            const item = window.Items[key];

            const btn = document.createElement("div");
            btn.className = "tray-button";

            // icon
            const img = document.createElement("img");
            img.src = "assets/" + item.icon;
            img.className = "tray-icon";
            btn.appendChild(img);

            // label
            const label = document.createElement("div");
            label.className = "tray-label";
            label.innerText = key;
            btn.appendChild(label);

            // drag start
            btn.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                window.input.startDraggingItem(item);
            });

            this.tray.appendChild(btn);
        }
    }
}

// Create UI
window.ui = new UI();


