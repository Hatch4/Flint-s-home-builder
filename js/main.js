// main.js
let canvas, ctx;
let game = {};

window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    resizeCanvas();

    // Core game objects
    game.grid = new Grid(5, 4); // starting footprint 5×4
    game.camera = new Camera();
    game.renderer = new Renderer(ctx, game.grid, game.camera);
    game.input = new Input(canvas, game.grid, game.camera);
    game.items = Items;
    game.ui = new UI(game);
    game.save = new Save(game);
    game.requirements = new Requirements(game);

    // Load previous save
    game.save.load();

    // Start render loop
    requestAnimationFrame(loop);
};

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.renderer.draw();
    requestAnimationFrame(loop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.onresize = resizeCanvas;
