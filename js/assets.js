// assets.js
window.assets = {
    floor: null,
    wall: null,
    roof: null,
    decor_mushroom: null,
    decor_lantern: null,

    load(callback) {
        const list = {
            floor: "assets/floor.png",
            wall: "assets/wall.png",
            roof: "assets/roof.png",
            decor_mushroom: "assets/mushroom.png",
            decor_lantern: "assets/lantern.png"
        };

        let loaded = 0;
        const keys = Object.keys(list);

        keys.forEach(key => {
            const img = new Image();
            img.src = list[key];
            img.onload = () => {
                window.assets[key] = img;
                loaded++;
                if (loaded === keys.length) callback();
            };
        });
    }
};
