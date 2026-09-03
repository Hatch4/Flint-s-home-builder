// PlacementPreview.js
window.placementpreview = {
    tile: null,
    valid: false,

    update(x, y, isValid) {
        this.tile = { x, y };
        this.valid = isValid;
    },

    clear() {
        this.tile = null;
    },

    draw(ctx, camera) {
        if (!this.tile) return;

        const { x, y } = this.tile;

        // Convert tile → screen
        const pos = window.grid.isoToScreen(x, y, camera);

        const w = window.grid.tileW / 2;
        const h = window.grid.tileH / 2;

        ctx.save();
        ctx.translate(pos.x, pos.y);

        ctx.fillStyle = this.valid
            ? "rgba(0,255,0,0.35)"
            : "rgba(255,0,0,0.35)";

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

