// ui.js
class UI {
    constructor(game) {
        this.game = game;

        this.rotateBtn = document.getElementById("rotate-btn");
        this.deleteBtn = document.getElementById("delete-btn");
        this.interiorBtn = document.getElementById("interior-btn");
        this.tray = document.getElementById("bottom-tray");
        this.progress = document.getElementById("progress-indicator");

        this.interiorMode = false;

        this.bindButtons();
        this.populateTray();
        this.updateProgress();
    }

    bindButtons() {
        this.rotateBtn.addEventListener("click", () => {
            this.game.camera.rotateClockwise();
        });

        this.deleteBtn.addEventListener("click", () => {
            const sel = this.game.grid.selected;
            if (!sel) return;

            this.game.grid.clearTile(sel.x, sel.y);
            this.game.requirements.update();
            this.updateProgress();
        });

        this.interiorBtn.addEventListener("click", () => {
            this.interiorMode = !this.interiorMode;
            this.interiorBtn.style.background = this.interiorMode ? "#ffd27f" : "#fff";
        });
    }

    populateTray() {
        this.tray.innerHTML = "";

        for (const key in this.game.items) {
            const item = this.game.items[key];

            const el = document.createElement("div");
            el.className = "tray-item";
            el.dataset.item = key;

            el.style.width = "80px";
            el.style.height = "80px";
            el.style.margin = "10px";
            el.style.borderRadius = "8px";
            el.style.background = "#fff";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
            el.style.cursor = "pointer";

            const img = document.createElement("img");
            img.src = item.icon;
            img.style.width = "64px";
            img.style.height = "64px";

            el.appendChild(img);
            this.tray.appendChild(el);
        }
    }

    updateProgress() {
        const percent = this.game.requirements.getPercent();
        this.progress.textContent = `${percent}%`;
    }
}
