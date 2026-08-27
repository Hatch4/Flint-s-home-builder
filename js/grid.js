// grid.js
class Grid {
    constructor(startWidth = 5, startHeight = 4) {
        this.width = startWidth;
        this.height = startHeight;

        this.tiles = [];
        this.selectedTile = null;

        this.initTiles();
    }

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
            floor: false,     // stone slab
            wall: null,       // { type: "wall" | "door" | "window" }
            roof: false,      // reed tile
            decor: null,      // { type: "mushroom" | "lantern" }
        };
    }

    // Select a tile (for highlighting)
    selectTile(x, y) {
        if (this.isValidTile(x, y)) {
            this.selectedTile = { x, y };
        }
    }

    clearSelection() {
        this.selectedTile = null;
    }

    isValidTile(x, y) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    // Place floor tile (stone slab)
    placeFloor(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].floor = true;

        // Check if expansion is needed
        if (this.isEdgeTile(x, y)) {
            this.expandGrid(x, y);
        }

        return true;
    }

    // Place wall tile
    placeWall(x, y, wallData) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].wall = wallData;
        return true;
    }

    // Place roof tile
    placeRoof(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].roof = true;
        return true;
    }

    // Place decor item
    placeDecor(x, y, decorData) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].decor = decorData;
        return true;
    }

    // Remove any item from tile
    removeItem(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x] = this.createEmptyTile();
        return true;
    }

    // Check if tile is on the edge of the footprint
    isEdgeTile(x, y) {
        return (
            x === 0 ||
            y === 0 ||
            x === this.width - 1 ||
            y === this.height - 1
        );
    }

    // Expand grid outward while keeping rectangular shape
    expandGrid(x, y) {
        let expandLeft = x === 0;
        let expandRight = x === this.width - 1;
        let expandTop = y === 0;
        let expandBottom = y === this.height - 1;

        // Maximum size (can be changed later)
        const maxWidth = 10;
        const maxHeight = 8;

        // Expand left
        if (expandLeft && this.width < maxWidth) {
            this.width++;
            this.addColumnLeft();
        }

        // Expand right
        if (expandRight && this.width < maxWidth) {
            this.width++;
            this.addColumnRight();
        }

        // Expand top
        if (expandTop && this.height < maxHeight) {
            this.height++;
            this.addRowTop();
        }

        // Expand bottom
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

    // For saving/loading
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
