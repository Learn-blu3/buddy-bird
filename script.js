const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0
};

const pipes = [];
const pipeWidth = 30;
const pipeGap = 100;
let frameCount = 0;

document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

function drawBird() {
    ctx.fillStyle = '#FF0';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = '#0F0';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        bird.y = 150;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const top = Math.random() * (canvas.height - pipeGap);
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top: top, bottom: bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

function detectCollision() {
    for (const pipe of pipes) {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            bird.y = 150;
            bird.velocity = 0;
            pipes.length = 0;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

function update() {
    updateBird();
    updatePipes();
    detectCollision();
}

function gameLoop() {
    draw();
    update();
    frameCount++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
