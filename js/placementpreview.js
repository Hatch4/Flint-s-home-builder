// PlacementPreview.js
window.PlacementPreview = {
    tile: null,
    valid: false,

    update(tileX, tileY, isValid) {
        this.tile = { x: tileX, y: tileY };
        this.valid = isValid;
    },

    clear() {
        this.tile = null;
    },

    draw(ctx, camera) {
        if (!this.tile) return;

        const iso = window.grid.isoToScreen(this.tile.x, this.tile.y, camera);

        ctx.save();
        ctx.translate(iso.x, iso.y);

        ctx.fillStyle = this.valid
            ? "rgba(0,255,0,0.35)"
            : "rgba(255,0,0,0.35)";

        ctx.beginPath();
        ctx.moveTo(0, -window.grid.tileH / 2);
        ctx.lineTo(window.grid.tileW / 2, 0);
        ctx.lineTo(0, window.grid.tileH / 2);
        ctx.lineTo(-window.grid.tileW / 2, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
};
