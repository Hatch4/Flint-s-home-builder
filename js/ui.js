// ui.js
class UI {
    constructor(game) {
        this.game = game;
        this.bottomTray = document.getElementById("bottom-tray");

        this.dragging = false;
        this.dragItemKey = null;

        this.pointerStartX = 0;
        this.pointerStartY = 0;
        this.dragStarted = false;

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

            // Use pointerdown but delay drag start until movement
            el.addEventListener("pointerdown", (e) => this.onTrayPointerDown(e, key));

            this.bottomTray.appendChild(el);
        }
    }

    onTrayPointerDown(e, itemKey) {
        this.pointerStartX = e.clientX;
        this.pointerStartY = e.clientY;
        this.dragItemKey = itemKey;
        this.dragStarted = false;

        // Track movement globally
        window.addEventListener("pointermove", this.onTrayPointerMove);
        window.addEventListener("pointerup", this.onTrayPointerUp);
    }

    onTrayPointerMove = (e) => {
        const dx = e.clientX - this.pointerStartX;
        const dy = e.clientY - this.pointerStartY;

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        // If mostly horizontal movement → let tray scroll, do NOT start drag
        if (absDx > 10 && absDx > absDy) {
            // Do nothing here: native horizontal scroll on #bottom-tray will handle it
            return;
        }

        // If vertical movement beyond threshold → start drag
        if (!this.dragStarted && absDy > 10 && absDy > absDx) {
            this.startDrag(e, this.dragItemKey);
            this.dragStarted = true;
        }

        // If drag already started, forward to dragMove
        if (this.dragStarted) {
            this.dragMove(e);
        }
    };

    onTrayPointerUp = (e) => {
        window.removeEventListener("pointermove", this.onTrayPointerMove);
        window.removeEventListener("pointerup", this.onTrayPointerUp);

        if (this.dragStarted) {
            this.dragEnd(e);
        }

        this.dragStarted = false;
        this.dragItemKey = null;
    };

    startDrag(e, itemKey) {
        e.preventDefault();

        this.dragging = true;
        this.dragItemKey = itemKey;

        const ghost = document.getElementById("drag-ghost");
        ghost.innerHTML = `<img src="${Items[itemKey].icon}">`;
        ghost.style.opacity = "1";

        this.updateGhostPosition(e);
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
    };

    updateGhostPosition(e) {
        const ghost = document.getElementById("drag-ghost");
        ghost.style.left = `${e.clientX}px`;
        ghost.style.top = `${e.clientY}px`;
    }
}

