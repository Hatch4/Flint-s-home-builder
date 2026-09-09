class Grid {
    constructor(tileW, tileH) {
        this.tileW = tileW;
        this.tileH = tileH;
        this.cells = new Map(); // key: `${x},${y}`
    }

    key(x, y) {
        return `${x},${y}`;
    }

    get(x, y) {
        return this.cells.get(this.key(x, y)) || {
            floor: null,
            wall: null,
            roof: null,
            decor: null,
            door: null,
            window: null
        };
    }

    set(x, y, cell) {
        this.cells.set(this.key(x, y), cell);
    }

    snap(isoX, isoY) {
        return {
            x: Math.round(isoX),
            y: Math.round(isoY)
        };
    }
}

