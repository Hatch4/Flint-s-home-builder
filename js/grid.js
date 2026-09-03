// grid.js
class Grid {
    constructor(startWidth = 5, startHeight = 4) {
        this.width = startWidth;
        this.height = startHeight;

        this.tileW = 96;
        this.tileH = 48;

        this.tiles = [];
        this.selectedTile = null;

        this.undoStack = [];
        this.redoStack = [];

        this.initTiles();
    }

    // ---------------------------------------------------------
    // INITIALIZE GRID
    // ---------------------------------------------------------
    initTiles() {
        this.tiles = [];

        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(this.createEmptyTile());
            }
            this.tiles.push(row);
        }
    }

    createEmptyTile() {
        return {
            floor: null,
            wall: null,
            roof: null,
            decor: [],
            door: null,
            window: null
        };
    }

    // ---------------------------------------------------------
    // UNDO / REDO
    // ---------------------------------------------------------
    saveState() {
        const snapshot = JSON.stringify(this.serialize());
        this.undoStack.push(snapshot);
        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) return;

        const snapshot = this.undoStack.pop();
        this.redoStack.push(JSON.stringify(this.serialize()));

        const data = JSON.parse(snapshot);
        this.deserialize(data);
    }

    redo() {
        if (this.redoStack.length === 0) return;

        const snapshot = this.redoStack.pop();
        this.undoStack.push(JSON.stringify(this.serialize()));

        const data = JSON.parse(snapshot);
        this.deserialize(data);
    }

    // ---------------------------------------------------------
    // TILE ACCESS
    // ---------------------------------------------------------
    get(x, y) {
        if (!this.isValidTile(x, y)) return null;
        return this.tiles[y][x];
    }

    isValidTile(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    // ---------------------------------------------------------
    // SNAP ISO → TILE (CLAMPED)
    // ---------------------------------------------------------
    snap(ix, iy) {
        const tx = Math.round(ix);
        const ty = Math.round(iy);

        const cx = Math.max(0, Math.min(this.width - 1, tx));
        const cy = Math.max(0, Math.min(this.height - 1, ty));

        return { x: cx, y: cy };
    }

    // ---------------------------------------------------------
    // ISO → SCREEN (NO CAMERA TRANSFORM HERE)
    // ---------------------------------------------------------
    isoToScreen(x, y) {
        const sx = (x - y) * (this.tileW / 2);
        const sy = (x + y) * (this.tileH / 2);
        return { x: sx, y: sy };
    }

    // ---------------------------------------------------------
    // PLACE ITEM
    // ---------------------------------------------------------
    place(x, y, item) {
        const cell = this.get(x, y);
        if (!cell) return;

        const placedItem = {
            ...item,
            rotation: item.rotation || 0
        };

        switch (item.category) {
            case "floor":
                cell.floor = placedItem;
                break;

            case "wall":
                cell.wall = placedItem;
                break;

            case "roof":
                cell.roof = placedItem;
                break;

            case "decor":
                cell.decor.push(placedItem);
                break;

            case "door":
                cell.door = placedItem;
                break;

            case "window":
                cell.window = placedItem;
                break;
        }
    }

    // ---------------------------------------------------------
    // REMOVE TOP ITEM
    // ---------------------------------------------------------
    removeTopItem(x, y) {
        const cell = this.get(x, y);
        if (!cell) return;

        if (cell.decor.length > 0) {
            cell.decor.pop();
            return;
        }

        if (cell.window) {
            cell.window = null;
            return;
        }

        if (cell.door) {
            cell.door = null;
            return;
        }

        if (cell.wall) {
            cell.wall = null;
            return;
        }

        if (cell.roof) {
            cell.roof = null;
            return;
        }

        if (cell.floor) {
            cell.floor = null;
            return;
        }
    }

    // ---------------------------------------------------------
    // FULL TILE CLEAR
    // ---------------------------------------------------------
    removeItem(x, y) {
        if (!this.isValidTile(x, y)) return;
        this.tiles[y][x] = this.createEmptyTile();
    }

    // ---------------------------------------------------------
    // SERIALIZE / DESERIALIZE
    // ---------------------------------------------------------
    serialize() {
        return {
            width: this.width,
            height: this.height,
            tiles: this.tiles
        };
    }

    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.tiles = data.tiles;
    }
}
