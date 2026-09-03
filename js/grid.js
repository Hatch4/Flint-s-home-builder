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
            floor: null,
            wall: null,
            roof: null,
            decor: [],
            door: null,
            window: null
        };
    }

    // ⭐ NEW unified placement system
    place(x, y, item) {
        const cell = this.get(x, y);
        if (!cell) return;

        switch (item.category) {
            case "floor":
                cell.floor = item;
                break;

            case "wall":
                cell.wall = item;
                break;

            case "roof":
                cell.roof = item;
                break;

            case "decor":
                cell.decor.push(item);
                break;

            case "door":
                cell.door = item;
                break;

            case "window":
                cell.window = item;
                break;
        }
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

    // OLD placement functions — you can delete these later
    placeFloor(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].floor = true;

        if (this.isEdgeTile(x, y)) {
            this.expandGrid(x, y);
        }

        return true;
    }

    placeWall(x, y, wallData) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].wall = wallData;
        return true;
    }

    placeRoof(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].roof = true;
        return true;
    }

    placeDecor(x, y, decorData) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x].decor = decorData;
        return true;
    }

    removeItem(x, y) {
        if (!this.isValidTile(x, y)) return false;

        this.tiles[y][x] = this.createEmptyTile();
        return true;
    }

    isEdgeTile(x, y) {
        return (
            x === 0 ||
            y === 0 ||
            x === this.width - 1 ||
            y === this.height - 1
        );
    }

    expandGrid(x, y) {
        let expandLeft = x === 0;
        let expandRight = x === this.width - 1;
        let expandTop = y === 0;
        let expandBottom = y === this.height - 1;

        const maxWidth = 10;
        const maxHeight = 8;

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
