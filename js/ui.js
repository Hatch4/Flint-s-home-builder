// tray buttons
btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (window.input.draggingItem !== null) return;

    if (e.pointerType === "touch") {
        const rect = btn.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        ) return;
    }

    if (e.pointerType === "mouse" && e.buttons !== 1) return;

    window.input.startDraggingItem(item);
    window.placementpreview.clear();
});

// ghost
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
