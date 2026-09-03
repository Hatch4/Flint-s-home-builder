// save.js
class Save {
    constructor(game) {
        this.game = game;
        this.key = "flint_octopus_house_save";
    }

    // ---------------------------------------------------------
    // Save game state to localStorage
    // ---------------------------------------------------------
    save() {
        const data = {
            grid: this.game.grid.serialize(),
            camera: {
                angle: this.game.camera.angle,
                targetAngle: this.game.camera.targetAngle,
                interiorMode: this.game.camera.interiorMode
            }
        };

        localStorage.setItem(this.key, JSON.stringify(data));
    }

    // ---------------------------------------------------------
    // Load game state from localStorage
    // ---------------------------------------------------------
    load() {
        const raw = localStorage.getItem(this.key);
        if (!raw) return;

        try {
            const data = JSON.parse(raw);

            // Restore grid
            if (data.grid) {
                this.game.grid.deserialize(data.grid);
            }

            // Restore camera
            if (data.camera) {
                this.game.camera.angle = data.camera.angle;
                this.game.camera.targetAngle = data.camera.targetAngle;
                this.game.camera.interiorMode = data.camera.interiorMode;
            }

        } catch (err) {
            console.error("Save file corrupted:", err);
        }
    }

    // ---------------------------------------------------------
    // Auto-save after each placement
    // ---------------------------------------------------------
    autoSave() {
        this.save();
    }
}
