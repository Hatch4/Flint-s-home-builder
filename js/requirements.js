// requirements.js
class Requirements {
    constructor(game) {
        this.game = game;

        // Minimum required pieces
        this.required = {
            floor: 1,
            walls: 4,
            door: 1,
            windows: 2,
            roof: 1,
            lantern: 1
        };

        this.completed = false;
    }

    // ---------------------------------------------------------
    // Count all placed items in the grid
    // ---------------------------------------------------------
    countPieces() {
        let floor = 0;
        let walls = 0;
        let door = 0;
        let windows = 0;
        let roof = 0;
        let lantern = 0;

        for (let y = 0; y < this.game.grid.height; y++) {
            for (let x = 0; x < this.game.grid.width; x++) {
                const tile = this.game.grid.tiles[y][x];

                if (tile.floor) floor++;

                if (tile.wall) {
                    if (tile.wall.type === "wall") walls++;
                    if (tile.wall.type === "door") door++;
                    if (tile.wall.type === "window") windows++;
                }

                if (tile.roof) roof++;

                if (tile.decor && tile.decor.type === "lantern") {
                    lantern++;
                }
            }
        }

        return { floor, walls, door, windows, roof, lantern };
    }

    // ---------------------------------------------------------
    // Calculate completion percentage
    // ---------------------------------------------------------
    calculateProgress(counts) {
        let totalRequired = 0;
        let totalMet = 0;

        for (let key in this.required) {
            totalRequired += this.required[key];

            if (counts[key] >= this.required[key]) {
                totalMet += this.required[key];
            } else {
                totalMet += counts[key];
            }
        }

        return Math.floor((totalMet / totalRequired) * 100);
    }
    getPercent() {
    const counts = this.countPieces();
    return this.calculateProgress(counts);
}

    // ---------------------------------------------------------
    // Update progress + check for completion
    // ---------------------------------------------------------
    update() {
        const counts = this.countPieces();
        const percent = this.calculateProgress(counts);

        // Update UI
        this.game.ui.updateProgress(percent);

        // Auto-save
        this.game.save.autoSave();

        // Check completion
        if (!this.completed && percent >= 100) {
            this.completed = true;
            this.triggerEndingAnimation();
        }
    }

    // ---------------------------------------------------------
    // Ending Animation A (simple fade-in Tentacle Bill + glow)
    // ---------------------------------------------------------
    triggerEndingAnimation() {
        console.log("Ending animation triggered!");

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        // Glow overlay
        let glowAlpha = 0;

        const glowInterval = setInterval(() => {
            glowAlpha += 0.02;

            ctx.fillStyle = `rgba(255, 255, 150, ${glowAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (glowAlpha >= 0.4) {
                clearInterval(glowInterval);
                this.fadeInTentacleBill();
            }
        }, 30);
    }

    // ---------------------------------------------------------
    // Fade-in Tentacle Bill sprite
    // ---------------------------------------------------------
    fadeInTentacleBill() {
        const img = new Image();
        img.src = "assets/ui/tentacle_bill.png";

        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        let alpha = 0;

        const fadeInterval = setInterval(() => {
            alpha += 0.02;

            ctx.save();
            ctx.globalAlpha = alpha;

            const x = canvas.width / 2 - 80;
            const y = canvas.height / 2 - 120;

            ctx.drawImage(img, x, y, 160, 160);
            ctx.restore();

            if (alpha >= 1) {
                clearInterval(fadeInterval);
                this.showFinalMessage();
            }
        }, 30);
    }

    // ---------------------------------------------------------
    // Final message overlay
    // ---------------------------------------------------------
    showFinalMessage() {
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";

        ctx.fillText("Tentacle Bill has returned!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Your friendship brought him home.", canvas.width / 2, canvas.height / 2 + 30);
    }
}
