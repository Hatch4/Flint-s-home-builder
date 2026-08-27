// ui.js
class UI {
    constructor(game) {
        this.game = game;

        this.tray = document.getElementById("bottom-tray");
        this.progressIndicator = document.getElementById("progress-indicator");
        this.flintFace = document.getElementById("flint-face");

        this.rotateBtn = document.getElementById("rotate-btn");
        this.deleteBtn = document.getElementById("delete-btn");
        this.interiorBtn = document.getElementById("interior-btn");

        this.selectedTile = null;

        this.populateTray();
        this.bindButtons();
    }

    // ---------------------------------------------------------
    // Populate bottom tray with items from Items.js
    // ---------------------------------------------------------
    populateTray() {
        this.tray.innerHTML = "";

        for (let key in Items) {
            const item = Items[key];

            const el = document.createElement("div");
            el.className = "tray-item";
            el.dataset.item = key;

            el.style.width = "80px";
            el.style.height = "80px";
            el.style.margin = "10px";
            el.style.display = "flex";
            el.style.alignItems = "center";
            el.style.justifyContent = "center";
            el.style.flexShrink = "0";
            el.style.borderRadius = "10px";
            el.style.background = "rgba(255,255,255,0.9)";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

            const img = document.createElement("img");
            img.src = item.icon;
            img.style.maxWidth = "70px";
            img.style.maxHeight = "70px";

            el.appendChild(img);
            this.tray.appendChild(el);
        }
    }

    // ---------------------------------------------------------
    // Bind buttons (rotate, delete, interior/exterior)
    // ---------------------------------------------------------
    bindButtons() {
        this.rotateBtn.addEventListener("click", () => {
            if (!this.game.grid.selectedTile) return;

            const { x, y } = this.game.grid.selectedTile;
            const tile = this.game.grid.tiles[y][x];

            if (tile.wall) {
                tile.wall.rotation = (tile.wall.rotation || 0) + 90;
            }
        });

        this.deleteBtn.addEventListener("click", () => {
            if (!this.game.grid.selectedTile) return;

            const { x, y } = this.game.grid.selectedTile;
            this.game.grid.removeItem(x, y);
            this.game.requirements.update();
        });

        this.interiorBtn.addEventListener("click", () => {
            this.game.camera.toggleInterior();
        });
    }

    // ---------------------------------------------------------
    // Update progress indicator + Flint reactions
    // ---------------------------------------------------------
    updateProgress(percent) {
        this.progressIndicator.textContent = percent + "%";

        if (percent < 20) {
            this.flintFace.src = "assets/ui/flint_default.png";
        } else if (percent < 60) {
            this.flintFace.src = "assets/ui/flint_happy.png";
        } else if (percent < 100) {
            this.flintFace.src = "assets/ui/flint_excited.png";
        } else {
            this.flintFace.src = "assets/ui/flint_celebrate.png";
        }
    }
}
