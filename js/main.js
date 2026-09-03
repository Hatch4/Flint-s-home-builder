// main.js
let canvas, ctx;
let game = {};

window.onload = () => {
    window.assets.load(() => {

        canvas = document.getElementById("gameCanvas");
        ctx = canvas.getContext("2d");

        resizeCanvas();

        // Core game objects
        game.grid = new Grid(5, 4);
        game.camera = new Camera(game.grid, canvas);
        game.renderer = new Renderer(canvas, game.grid, game.camera);
        game.input = new Input(canvas, game.grid, game.camera);
        game.items = Items;

        game.save = new Save(game);                 // load save BEFORE requirements
        game.requirements = new Requirements(game); // requirements BEFORE UI
        game.placementrules = new placementrules(game);
        window.placementrules = game.placementrules;
        game.ui = new UI(game);                     // UI LAST

        game.debug = new DebugOverlay(game);

        document.getElementById("save-btn").addEventListener("click", () => {
    const data = game.grid.serialize();   // ⭐ FIXED
    const json = JSON.stringify(data);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "my_build.json";
    a.click();

    URL.revokeObjectURL(url);
});

document.getElementById("load-btn").addEventListener("click", () => {
    document.getElementById("load-file").click();
});

document.getElementById("load-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const data = JSON.parse(reader.result);
        game.grid.deserialize(data);          
        game.grid.undoStack = [];             
        game.grid.redoStack = [];             
    };
    reader.readAsText(file);
});

        // Load previous save
        game.save.load();

        // Start render loop
        requestAnimationFrame(loop);
    });
};

function loop() {
    game.renderer.render();
    game.debug.draw(ctx); // optional
    requestAnimationFrame(loop);
}

function resizeCanvas() {
    if (!canvas) return;   // prevents early resize crash
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
