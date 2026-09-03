// ui.js
class UI {
    constructor(game) {
        this.game = game;
        this.bottomTray = document.getElementById("bottom-tray");

        this.dragging = false;
        this.dragItemKey = null;

        this.buildTray();
    }

    buildTray() {
        this.bottomTray.innerHTML = "";

        for (let key in Items) {
            const item = Items[key];

            const el = document.createElement("div");
            el.classList.add("tray-item");
            el.dataset.item = key;

            const img = document.createElement("img");
            img.src = item.icon;
            img.draggable = false;

            el.appendChild(img);

            el.addEventListener("pointerdown", (e) => this.startDrag(e, key));

            this.bottomTray.appendChild(el);
        }
    }

    startDrag(e, itemKey) {
        e.preventDefault();

        this.dragging = true;
        this.dragItemKey = itemKey;

        const ghost = document.getElementById("drag-ghost");
        ghost.innerHTML = `<img src="${Items[itemKey].icon}">`;
        ghost.style.opacity = "1";

        this.updateGhostPosition(e);

        window.addEventListener("pointermove", this.dragMove);
        window.addEventListener("pointerup", this.dragEnd);
    }

    dragMove = (e) => {
        if (!this.dragging) return;

        this.updateGhostPosition(e);

        this.game.input.handleDragMove(
            e.clientX,
            e.clientY,
            Items[this.dragItemKey]
        );
    };

    dragEnd = (e) => {
        if (!this.dragging) return;

        this.dragging = false;

        const ghost = document.getElementById("drag-ghost");
        ghost.style.opacity = "0";

        this.game.input.handleDragEnd(
            e.clientX,
            e.clientY,
            Items[this.dragItemKey]
        );

        window.removeEventListener("pointermove", this.dragMove);
        window.removeEventListener("pointerup", this.dragEnd);
    };

    updateGhostPosition(e) {
        const ghost = document.getElementById("drag-ghost");
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
    }
}
