// grid.js
class Grid {
    constructor(startWidth = 5, startHeight = 4) {
        this.width = startWidth;
        this.height = startHeight;

        this.tileW = 96;
        this.tileH = 48;

        this.tiles = [];
        this.selectedTile = null;

        this.initTiles();
    }

    // ---------------------------------------------------------
    // INITIALIZE EMPTY GRID
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

    // ---------------------------------------------------------
    // TILE STRUCTURE
    // ---------------------------------------------------------
    createEmptyTile() {
        return {
            floor: false,
            wall: null,     // { type: "wall" | "door" | "window", rotation }
            roof: false,
            decor: []       // array of { type, rotation }
        };
    }

    // ---------------------------------------------------------
    // SAFE TILE GETTER
    // ---------------------------------------------------------
    get(x, y) {
        if (!this.isValidTile(x, y)) return null;
        return this.tiles[y][x];
    }

    // ---------------------------------------------------------
    // TILE VALIDATION
    // ---------------------------------------------------------
    isValidTile(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    // ---------------------------------------------------------
    // SELECT TILE
    // ---------------------------------------------------------
    selectTile(x, y) {
        if (this.isValidTile(x, y)) {
            this.selectedTile = { x, y };
        }
    }

    clearSelection() {
        this.selectedTile = null;
    }

    // ---------------------------------------------------------
    // REMOVE TOP ITEM (DELETE MODE)
    // ---------------------------------------------------------
    removeTopItem(x, y) {
        const cell = this.get(x, y);
        if (!cell) return;

        // Decor first
        if (cell.decor.length > 0) {
            cell.decor.pop();
            return;
        }

        // Roof
        if (cell.roof) {
            cell.roof = false;
            return;
        }

        // Wall / Door / Window
        if (cell.wall) {
            cell.wall = null;
            return;
        }

        // Floor
        if (cell.floor) {
            cell.floor = false;
            return;
        }
    }

    // ---------------------------------------------------------
    // EXPANSION LOGIC
    // ---------------------------------------------------------
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

    // ---------------------------------------------------------
    // SNAP ISO → TILE
    // ---------------------------------------------------------
    snap(isoX, isoY) {
        return {
            x: Math.round(isoX),
            y: Math.round(isoY)
        };
    }

    // ---------------------------------------------------------
    // ISO → SCREEN (pure math)
    // ---------------------------------------------------------
    isoToScreen(ix, iy) {
        const x = (ix - iy) * (this.tileW / 2);
        const y = (ix + iy) * (this.tileH / 2);
        return { x, y };
    }

    // ---------------------------------------------------------
    // SERIALIZE GRID
    // ---------------------------------------------------------
    serialize() {
        return {
            width: this.width,
            height: this.height,
            tiles: this.tiles
        };
    }

    // ---------------------------------------------------------
    // LOAD GRID FROM SAVE
    // ---------------------------------------------------------
    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.tiles = data.tiles;
    }
}

window.Grid = Grid;
