// placementpreview.js
window.placementpreview = {
    tile: null,
    valid: false,

    // Update preview tile + validity
    update(x, y, isValid) {
        this.tile = { x, y };
        this.valid = isValid;
    },

    // Clear preview
    clear() {
        this.tile = null;
    },

    // Draw preview highlight
    draw(ctx, camera) {
        if (!this.tile) return;

        const { x, y } = this.tile;

        // Convert tile → screen (pure isoToScreen)
        const pos = window.grid.isoToScreen(x, y);

        const w = window.grid.tileW / 2;
        const h = window.grid.tileH / 2;

        ctx.save();
        ctx.translate(pos.x, pos.y);

        ctx.fillStyle = this.valid
            ? "rgba(0,255,0,0.35)"   // green = valid
            : "rgba(255,0,0,0.35)";  // red = invalid

        ctx.beginPath();
        ctx.moveTo(0, -h);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, h);
        ctx.lineTo(-w, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
};
