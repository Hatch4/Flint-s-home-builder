class UI {
    constructor(game) {
        this.game = game;

        this.tray = document.getElementById("tray");
        this.deleteBtn = document.getElementById("deleteBtn");
        this.interiorBtn = document.getElementById("interiorBtn");

        this.dragGhost = document.createElement("div");
        this.dragGhost.style.position = "fixed";
        this.dragGhost.style.pointerEvents = "none";
        this.dragGhost.style.opacity = 0;
        this.dragGhost.style.zIndex = 9999;
        document.body.appendChild(this.dragGhost);

        this.buildTray();
        this.bindButtons();
        this.bindGhost();
    }

    // ---------------------------------------------------------
    // BUILD TRAY
    // ---------------------------------------------------------
    buildTray() {
        this.tray.innerHTML = "";

        for (const key in this.game.items) {
            const item = this.game.items[key];

            const btn = document.createElement("div");
            btn.className = "trayItem";
            btn.innerHTML = `<img src="assets/${item.icon}" class="trayIcon">`;

            btn.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();

                if (window.input.draggingItem !== null) return;

                // Only start drag on actual click/tap
                if (e.pointerType === "mouse" && e.buttons !== 1) return;

                window.input.startDraggingItem(item);
                window.placementpreview.clear();
            });

            this.tray.appendChild(btn);
        }
    }

    // ---------------------------------------------------------
    // BUTTONS (DELETE / INTERIOR)
    // ---------------------------------------------------------
    bindButtons() {
        this.deleteBtn.addEventListener("click", () => {
            window.input.toggleDeleteMode();
            this.deleteBtn.classList.toggle("active", window.input.deleteMode);
        });

        this.interiorBtn.addEventListener("click", () => {
            window.input.toggleInteriorMode();
            this.interiorBtn.classList.toggle("active", window.input.interiorMode);
        });
    }

    // ---------------------------------------------------------
    // GHOST FOLLOWING POINTER
    // ---------------------------------------------------------
    bindGhost() {
        window.addEventListener("pointermove", (e) => {
            const dragging = window.input.draggingItem;

            if (!dragging) {
                this.dragGhost.style.opacity = 0;
                return;
            }

            this.dragGhost.innerHTML =
                `<img src="assets/${dragging.icon}" style="width:64px;height:64px;">`;

            this.dragGhost.style.left = `${e.clientX}px`;
            this.dragGhost.style.top = `${e.clientY}px`;
            this.dragGhost.style.opacity = 1;
        });

        window.addEventListener("pointerup", () => {
            this.dragGhost.style.opacity = 0;
        });
    }
}

window.UI = UI;
