// save.js
class Save {
    constructor(game) {
        this.game = game;
        this.key = "tentaclebill_save_v1";
    }

    // ---------------------------------------------------------
    // AUTO SAVE (called every requirements update)
    // ---------------------------------------------------------
    autoSave() {
        const data = this.serialize();
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    // ---------------------------------------------------------
    // MANUAL SAVE → DOWNLOAD FILE
    // ---------------------------------------------------------
    saveToFile() {
        const data = this.serialize();
        const json = JSON.stringify(data, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "tentaclebill_save.json";
        a.click();

        URL.revokeObjectURL(url);
    }

    // ---------------------------------------------------------
    // MANUAL LOAD → FROM FILE INPUT
    // ---------------------------------------------------------
    loadFromFile(file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.deserialize(data);
                this.autoSave();
            } catch (err) {
                console.error("Invalid save file:", err);
            }
        };

        reader.readAsText(file);
    }

    // ---------------------------------------------------------
    // LOAD FROM LOCAL STORAGE
    // ---------------------------------------------------------
    load() {
        const raw = localStorage.getItem(this.key);
        if (!raw) return;

        try {
            const data = JSON.parse(raw);
            this.deserialize(data);
        } catch (err) {
            console.error("Failed to load save:", err);
        }
    }

    // ---------------------------------------------------------
    // SERIALIZE GAME STATE
    // ---------------------------------------------------------
    serialize() {
        return {
            grid: this.game.grid.serialize(),
            requirementsCompleted: this.game.requirements.completed
        };
    }

    // ---------------------------------------------------------
    // DESERIALIZE GAME STATE
    // ---------------------------------------------------------
    deserialize(data) {
        if (data.grid) {
            this.game.grid.deserialize(data.grid);
        }

        if (data.requirementsCompleted) {
            this.game.requirements.completed = true;
        }
    }
}

window.Save = Save;
