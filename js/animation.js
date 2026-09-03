// Animation.js
window.Animation = {
    puffs: [],

    spawnDust(tileX, tileY) {
        const pos = window.grid.isoToScreen(tileX, tileY, window.camera);
        this.puffs.push({ x: pos.x, y: pos.y, r: 5, alpha: 0.5 });
    },

    draw(ctx) {
        this.puffs = this.puffs.filter(p => p.alpha > 0);

        this.puffs.forEach(p => {
            ctx.fillStyle = `rgba(200,200,200,${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            p.r += 0.8;
            p.alpha -= 0.03;
        });
    }
};
