// UI.js
class UI {
    constructor() {
        this.tray = document.getElementById("itemTray");
        this.createButtons();
        this.attachRotateButton();   // <-- correct place
    }

    createButtons() {
        for (const key in window.Items) {
            const item = window.Items[key];

            const btn = document.createElement("div");
            btn.className = "itemButton";

            const img = document.createElement("img");
            img.src = "assets/" + item.icon;
            btn.appendChild(img);

            btn.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                window.input.startDraggingItem(item);
            });

            this.tray.appendChild(btn);
        }
    }

    attachRotateButton() {
        const rotateBtn = document.getElementById("rotateBtn");
        if (!rotateBtn) return;

        rotateBtn.addEventListener("pointerdown", () => {
            window.input.rotateCurrentItem();
        });
    }
}

window.ui = new UI();

