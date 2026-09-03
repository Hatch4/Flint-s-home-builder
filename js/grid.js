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
    saveState() {
    const snapshot = JSON.stringify(this.serialize());
    this.undoStack.push(snapshot);
    this.redoStack = []; // clear redo on new action
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

    // Create initial grid
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

    // Tile structure
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

    // Unified placement system
    place(x, y, item) {
        const cell = this.get(x, y);
        if (!cell) return;

        // Copy item so each tile stores its own rotation
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

    // Get tile safely
    get(x, y) {
        if (!this.isValidTile(x, y)) return null;
        return this.tiles[y][x];
    }

    // Tile validation
    isValidTile(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    // Select tile (optional highlight)
    selectTile(x, y) {
        if (this.isValidTile(x, y)) {
            this.selectedTile = { x, y };
        }
    }

    clearSelection() {
        this.selectedTile = null;
    }

    // Remove everything from tile
    removeItem(x, y) {
        if (!this.isValidTile(x, y)) return;
        this.tiles[y][x] = this.createEmptyTile();
    }
    removeTopItem(x, y) {
    const cell = this.tiles[y][x];
    if (!cell) return;

    // Decor (array)
    if (cell.decor && cell.decor.length > 0) {
        cell.decor.pop();
        return;
    }

    // Window
    if (cell.window) {
        cell.window = null;
        return;
    }

    // Door
    if (cell.door) {
        cell.door = null;
        return;
    }

    // Wall
    if (cell.wall) {
        cell.wall = null;
        return;
    }

    // Roof
    if (cell.roof) {
        cell.roof = null;
        return;
    }

    // Floor
    if (cell.floor) {
        cell.floor = null;
        return;
    }
}

    // Expand grid outward
    isEdgeTile(x, y) {
        return (
            x === 0 ||
            y === 0 ||
            x === this.width - 1 ||
            y === this.height - 1
        );
    }

    expandGrid(x, y) {
        const maxWidth = 10;
        const maxHeight = 8;

        const expandLeft = x === 0;
        const expandRight = x === this.width - 1;
        const expandTop = y === 0;
        const expandBottom = y === this.height - 1;

        if (expandLeft && this.width < maxWidth) {
            this.width++;
            this.addColumnLeft();
        }

        if (expandRight && this.width < maxWidth) {
            this.width++;
            this.addColumnRight();
        }

        if (expandTop && this.height < maxHeight) {
            this.height++;
            this.addRowTop();
        }

        if (expandBottom && this.height < maxHeight) {
            this.height++;
            this.addRowBottom();
        }
    }

    addColumnLeft() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y].unshift(this.createEmptyTile());
        }
    }

    addColumnRight() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y].push(this.createEmptyTile());
        }
    }

    addRowTop() {
        const newRow = [];
        for (let x = 0; x < this.width; x++) {
            newRow.push(this.createEmptyTile());
        }
        this.tiles.unshift(newRow);
    }

    addRowBottom() {
        const newRow = [];
        for (let x = 0; x < this.width; x++) {
            newRow.push(this.createEmptyTile());
        }
        this.tiles.push(newRow);
    }

    // Snap iso coords to nearest tile
    snap(isoX, isoY) {
        return {
            x: Math.round(isoX),
            y: Math.round(isoY)
        };
    }

    // Convert iso → screen
    isoToScreen(x, y, camera) {
        const screenX =
            (x - y) * (this.tileW / 2) - camera.x + window.innerWidth / 2;
        const screenY =
            (x + y) * (this.tileH / 2) - camera.y + window.innerHeight / 2;

        return { x: screenX, y: screenY };
    }

    // Save grid
    serialize() {
        return {
            width: this.width,
            height: this.height,
            tiles: this.tiles
        };
    }

    // Load grid
    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.tiles = data.tiles;
    }
}
