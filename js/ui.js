// UI.js
class UI {
    constructor(game) {
        this.game = game;

        this.tray = document.getElementById("itemTray");
        this.rotateBtn = document.getElementById("rotateBtn");
        this.deleteBtn = document.getElementById("delete-btn");
        this.interiorBtn = document.getElementById("interior-btn");

        this.saveBtn = document.getElementById("save-btn");
        this.loadBtn = document.getElementById("load-btn");
        this.loadFile = document.getElementById("load-file");

        this.dragGhost = document.getElementById("drag-ghost");

        this.buildTray();
        this.attachEvents();
    }

    // ---------------------------------------------------------
    // BUILD ITEM TRAY
    // ---------------------------------------------------------
    buildTray() {
        this.tray.innerHTML = "";

        for (const key in window.Items) {
            const item = window.Items[key];

            const btn = document.createElement("div");
            btn.className = "itemButton";
            btn.dataset.item = key;

            const img = document.createElement("img");
            img.src = "assets/" + item.icon;
            img.draggable = false;

            btn.appendChild(img);

          btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Prevent accidental re-drag after placement
    if (window.input.draggingItem !== null) return;

    // Touch: ensure the tap is actually inside the button
    if (e.pointerType === "touch") {
        const rect = btn.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) {
            return;
        }
    }

    // Mouse: only left-click
    if (e.pointerType === "mouse" && e.buttons !== 1) return;

    window.input.startDraggingItem(item);
    window.placementpreview.clear();
});

            this.tray.appendChild(btn);
        }
    }

    // ---------------------------------------------------------
    // UI EVENTS
    // ---------------------------------------------------------
    attachEvents() {

        // ROTATE BUTTON
        this.rotateBtn.addEventListener("pointerdown", () => {
            window.input.rotateCurrentItem();
        });

        // DELETE MODE
        this.deleteBtn.addEventListener("pointerdown", () => {
            window.input.toggleDeleteMode();
            this.updateModeButtons();
        });

        // INTERIOR MODE (placeholder)
        this.interiorBtn.addEventListener("pointerdown", () => {
            window.input.toggleInteriorMode();
            this.updateModeButtons();
        });

        // SAVE
        this.saveBtn.addEventListener("pointerdown", () => {
            window.saveSystem.saveToFile();
        });

        // LOAD
        this.loadBtn.addEventListener("pointerdown", () => {
            this.loadFile.click();
        });

        this.loadFile.addEventListener("change", (e) => {
            window.saveSystem.loadFromFile(e.target.files[0]);
        });

        // DRAG GHOST FOLLOW MOUSE
        window.addEventListener("pointermove", (e) => {
            if (!window.input.draggingItem) {
                this.dragGhost.style.opacity = 0;
                return;
            }

            const item = window.input.draggingItem;
            this.dragGhost.innerHTML = `<img src="assets/${item.icon}" style="width:64px;height:64px;">`;

            this.dragGhost.style.left = e.clientX + "px";
            this.dragGhost.style.top = e.clientY + "px";
            this.dragGhost.style.opacity = 1;
        });

        window.addEventListener("pointerup", () => {
            this.dragGhost.style.opacity = 0;
        });
    }

    // ---------------------------------------------------------
    // UPDATE MODE BUTTON STATES
    // ---------------------------------------------------------
    updateModeButtons() {
        this.deleteBtn.classList.toggle("active", window.input.deleteMode);
        this.interiorBtn.classList.toggle("active", window.input.interiorMode);
    }
}
