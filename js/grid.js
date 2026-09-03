// grid.js
class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        // Each cell holds an array (stack) of items
        this.cells = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push([]);
            }
            this.cells.push(row);
        }

        this.selectedTile = null;

        // Undo / Redo
        this.history = [];
        this.future = [];
    }

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------
    isValidTile(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    // ---------------------------------------------------------
    // SNAP (NO MORE NULL)
    // ---------------------------------------------------------
    snap(x, y) {
        const tx = Math.round(x);
        const ty = Math.round(y);

        const cx = Math.max(0, Math.min(this.width - 1, tx));
        const cy = Math.max(0, Math.min(this.height - 1, ty));

        return { x: cx, y: cy };
    }

    // ---------------------------------------------------------
    // PLACE ITEM
    // ---------------------------------------------------------
    place(x, y, item) {
        if (!this.isValidTile(x, y)) return;

        // Clone item to avoid shared references
        const copy = { ...item };
        this.cells[y][x].push(copy);
    }

    // ---------------------------------------------------------
    // REMOVE TOP ITEM
    // ---------------------------------------------------------
    removeTopItem(x, y) {
        if (!this.isValidTile(x, y)) return;

        const stack = this.cells[y][x];
        if (stack.length > 0) {
            stack.pop();
        }
    }

    // ---------------------------------------------------------
    // GET TOP ITEM (OPTIONAL)
    // ---------------------------------------------------------
    getTopItem(x, y) {
        if (!this.isValidTile(x, y)) return null;

        const stack = this.cells[y][x];
        if (stack.length === 0) return null;

        return stack[stack.length - 1];
    }

    // ---------------------------------------------------------
    // SERIALIZATION
    // ---------------------------------------------------------
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            cells: this.cells
        };
    }

    fromJSON(data) {
        this.width = data.width;
        this.height = data.height;
        this.cells = data.cells;
    }

    // ---------------------------------------------------------
    // UNDO / REDO
    // ---------------------------------------------------------
    saveState() {
        const snapshot = JSON.stringify(this.toJSON());
        this.history.push(snapshot);
        this.future = []; // clear redo stack
    }

    undo() {
        if (this.history.length === 0) return;

        const current = JSON.stringify(this.toJSON());
        this.future.push(current);

        const prev = this.history.pop();
        this.fromJSON(JSON.parse(prev));
    }

    redo() {
        if (this.future.length === 0) return;

        const current = JSON.stringify(this.toJSON());
        this.history.push(current);

        const next = this.future.pop();
        this.fromJSON(JSON.parse(next));
    }
}
