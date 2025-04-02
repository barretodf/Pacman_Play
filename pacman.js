// Configuração do Canvas
const canvas = document.getElementById("gameCanvas");
const TILE_SIZE = 32; // Certifique-se de que TILE_SIZE seja definido antes de usar
// Labirinto (1 = parede, 0 = caminho, 2 = ponto, 3 = super ponto, 4 = casa dos fantasmas)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,0,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,4,0,4,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,4,0,4,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,4,4,4,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
canvas.width = maze[0].length * TILE_SIZE; // Ajustar largura com base no número de colunas do labirinto
canvas.height = maze.length * TILE_SIZE; // Ajustar altura com base no número de linhas do labirinto
const ctx = canvas.getContext("2d");

// Configuração do jogo
const PACMAN_RADIUS = 14;
let score = 0;
let pacman = { 
    x: 1 * TILE_SIZE + TILE_SIZE / 2, 
    y: 1 * TILE_SIZE + TILE_SIZE / 2, 
    speed: 2, 
    direction: "STOP",
    mouthAngle: 0.2, // Para animação da boca
    mouthOpening: true // Direção da animação
};

// Configuração adicional
let level = 1;
let lives = 3;

// Fantasmas
let ghosts = [
    { x: 6 * TILE_SIZE, y: 4 * TILE_SIZE, speed: 1.5, direction: "LEFT", color: "red", vulnerable: false },
    { x: 7 * TILE_SIZE, y: 4 * TILE_SIZE, speed: 1.7, direction: "UP", color: "pink", vulnerable: false },
    { x: 6 * TILE_SIZE, y: 5 * TILE_SIZE, speed: 1.6, direction: "DOWN", color: "cyan", vulnerable: false },
    { x: 7 * TILE_SIZE, y: 5 * TILE_SIZE, speed: 1.8, direction: "RIGHT", color: "orange", vulnerable: false }
];

// Capturar entrada do jogador
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") pacman.direction = "LEFT";
    if (event.key === "ArrowRight") pacman.direction = "RIGHT";
    if (event.key === "ArrowUp") pacman.direction = "UP";
    if (event.key === "ArrowDown") pacman.direction = "DOWN";
});

// Função para verificar colisão com paredes
function checkCollision(x, y) {
    let col = Math.floor(x / TILE_SIZE);
    let row = Math.floor(y / TILE_SIZE);
    return maze[row][col] === 1;
}

// Atualizar o jogo
function update() {
    let newX = pacman.x;
    let newY = pacman.y;

    if (pacman.direction === "LEFT") newX -= pacman.speed;
    if (pacman.direction === "RIGHT") newX += pacman.speed;
    if (pacman.direction === "UP") newY -= pacman.speed;
    if (pacman.direction === "DOWN") newY += pacman.speed;

    // Adicionar túneis (atravessar de um lado para o outro)
    if (newX < 0) newX = canvas.width - TILE_SIZE / 2;
    if (newX > canvas.width) newX = TILE_SIZE / 2;

    if (!checkCollision(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }

    // Comer pontos e super pontos
    let col = Math.floor(pacman.x / TILE_SIZE);
    let row = Math.floor(pacman.y / TILE_SIZE);
    if (maze[row][col] === 2) {
        maze[row][col] = 0;
        score += 10;
    } else if (maze[row][col] === 3) {
        maze[row][col] = 0;
        score += 50;
        // Tornar fantasmas vulneráveis por um curto período
        ghosts.forEach(ghost => ghost.vulnerable = true);
        setTimeout(() => {
            ghosts.forEach(ghost => ghost.vulnerable = false);
        }, 5000);
    }

    // Verificar se todos os pontos foram coletados
    if (maze.flat().every(cell => cell !== 2 && cell !== 3)) {
        level++;
        pacman.speed += 0.5;
        ghosts.forEach(ghost => ghost.speed += 0.5);
        alert("Nível " + level + "!");
        resetMaze();
    }

    // Animação da boca do Pac-Man
    if (pacman.mouthOpening) {
        pacman.mouthAngle += 0.05;
        if (pacman.mouthAngle >= 0.3) pacman.mouthOpening = false;
    } else {
        pacman.mouthAngle -= 0.05;
        if (pacman.mouthAngle <= 0.1) pacman.mouthOpening = true;
    }
}

// Atualizar Fantasmas (IA melhorada)
function updateGhosts() {
    ghosts.forEach(ghost => {
        let dx = pacman.x - ghost.x;
        let dy = pacman.y - ghost.y;

        if (Math.random() < 0.5) {
            ghost.direction = dx > 0 ? "RIGHT" : "LEFT";
        } else {
            ghost.direction = dy > 0 ? "DOWN" : "UP";
        }

        let newX = ghost.x;
        let newY = ghost.y;

        if (ghost.direction === "LEFT") newX -= ghost.speed;
        if (ghost.direction === "RIGHT") newX += ghost.speed;
        if (ghost.direction === "UP") newY -= ghost.speed;
        if (ghost.direction === "DOWN") newY += ghost.speed;

        if (!checkCollision(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
        }

        // Verificar se o Pac-Man foi pego
        if (Math.abs(ghost.x - pacman.x) < PACMAN_RADIUS && Math.abs(ghost.y - pacman.y) < PACMAN_RADIUS) {
            if (ghost.vulnerable) {
                score += 200;
                ghost.x = (6 + ghosts.indexOf(ghost)) * TILE_SIZE;
                ghost.y = 4 * TILE_SIZE;
            } else {
                lives--;
                if (lives > 0) {
                    alert("Você perdeu uma vida! Vidas restantes: " + lives);
                    resetPositions();
                } else {
                    alert("Game Over! Pontuação: " + score);
                    document.location.reload();
                }
            }
        }
    });
}

// Reiniciar posições do Pac-Man e fantasmas
function resetPositions() {
    pacman.x = 1 * TILE_SIZE + TILE_SIZE / 2;
    pacman.y = 1 * TILE_SIZE + TILE_SIZE / 2;
    pacman.direction = "STOP";

    ghosts.forEach((ghost, index) => {
        ghost.x = (6 + index) * TILE_SIZE;
        ghost.y = 4 * TILE_SIZE;
    });
}

// Reiniciar o labirinto
function resetMaze() {
    maze.forEach((row, rowIndex) => {
        maze[rowIndex] = row.map(cell => (cell === 0 ? 2 : cell));
    });
}

// Desenhar vidas
function drawLives() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Vidas: " + lives, canvas.width - 100, 20);
}

// Verificar se o labirinto está sendo desenhado corretamente
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas antes de desenhar

    // Desenhar labirinto
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "blue"; // Cor das paredes
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else if (maze[row][col] === 2) {
                ctx.fillStyle = "white"; // Cor dos pontos
                ctx.beginPath();
                ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 5, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[row][col] === 3) {
                ctx.fillStyle = "gold"; // Cor dos super pontos
                ctx.beginPath();
                ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            } else if (maze[row][col] === 4) {
                ctx.fillStyle = "purple"; // Cor da casa dos fantasmas
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // Desenhar Pac-Man
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, PACMAN_RADIUS, pacman.mouthAngle * Math.PI, (2 - pacman.mouthAngle) * Math.PI);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();

    // Desenhar Fantasmas
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.vulnerable ? "blue" : ghost.color; // Usar a cor específica de cada fantasma ou azul se vulnerável
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, PACMAN_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenhar Pontuação e Vidas
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Pontuação: " + score, 10, 20);
    drawLives();
}

// Loop do jogo
function gameLoop() {
    update();
    updateGhosts();
    draw();
    requestAnimationFrame(gameLoop);
}

// Certifique-se de que o jogo seja iniciado corretamente
document.addEventListener("DOMContentLoaded", () => {
    gameLoop(); // Iniciar o loop do jogo após o DOM estar carregado
});
