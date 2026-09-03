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
        game.ui = new UI(game);                     // UI LAST

        game.debug = new DebugOverlay(game);

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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
