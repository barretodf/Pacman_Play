// Configuração do Canvas
const canvas = document.getElementById("gameCanvas");
const TILE_SIZE = 28; // Reduzir o tamanho das trilhas para diminuir a largura dos corredores
// Labirinto (1 = parede, 0 = caminho, 2 = ponto, 3 = pílula, 4 = casa dos fantasmas)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,0,2,2,2,2,2,2,2,2,2,2,3,1,1,3,2,2,2,2,2,2,2,2,2,2,0,0], // Adicionadas pílulas (3)
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
    [0,0,2,2,2,2,2,2,2,2,2,2,3,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0], // Adicionadas pílulas (3)
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
canvas.width = maze[0].length * TILE_SIZE; // Ajustar largura com base no número de colunas do labirinto
canvas.height = maze.length * TILE_SIZE; // Ajustar altura com base no número de linhas do labirinto
const ctx = canvas.getContext("2d");

// Configuração do jogo
const PACMAN_RADIUS = TILE_SIZE / 2.1; // Aumentar o raio do Pac-Man para torná-lo maior
let score = 0;
let pacman = { 
    x: 1 * TILE_SIZE + TILE_SIZE / 2, 
    y: 1 * TILE_SIZE + TILE_SIZE / 2, 
    speed: 2, 
    direction: "STOP",
    mouthAngle: 0.2, // Para animação da boca
    mouthOpening: true // Direção da animação
};

let level = 1;
let lives = 3;

// Fantasmas
let ghosts = [
    { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2, speed: 1.5, direction: "LEFT", color: "red", vulnerable: false, fleeing: false },
    { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 4 * TILE_SIZE + TILE_SIZE / 2, speed: 1.7, direction: "UP", color: "pink", vulnerable: false, fleeing: false },
    { x: 6 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2, speed: 1.6, direction: "DOWN", color: "cyan", vulnerable: false, fleeing: false },
    { x: 7 * TILE_SIZE + TILE_SIZE / 2, y: 5 * TILE_SIZE + TILE_SIZE / 2, speed: 1.8, direction: "RIGHT", color: "orange", vulnerable: false, fleeing: false }
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

// Função para desenhar um fantasma diretamente no canvas
function drawGhost(ctx, x, y, size, color) {
    const scaledSize = PACMAN_RADIUS * 2; // Ajustar o tamanho dos fantasmas para a altura do Pac-Man
    const bodyHeight = scaledSize * 0.8; // Altura do corpo do fantasma
    const arcRadius = scaledSize / 2; // Raio do arco superior

    // Desenhar o corpo do fantasma
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, arcRadius, Math.PI, 0, false); // Arco superior
    ctx.lineTo(x + arcRadius, y + bodyHeight); // Lado direito
    for (let i = 0; i < 3; i++) {
        // Desenhar ondulações na base
        const waveX = x + arcRadius - (arcRadius * 2 * (i + 1)) / 3;
        const waveY = y + bodyHeight + (i % 2 === 0 ? scaledSize * 0.1 : 0);
        ctx.lineTo(waveX, waveY);
    }
    ctx.lineTo(x - arcRadius, y + bodyHeight); // Lado esquerdo
    ctx.closePath();
    ctx.fill();

    // Desenhar os olhos
    const eyeOffsetX = scaledSize * 0.2;
    const eyeOffsetY = scaledSize * 0.2;
    const eyeRadius = scaledSize * 0.1;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x - eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2); // Olho esquerdo
    ctx.arc(x + eyeOffsetX, y - eyeOffsetY, eyeRadius, 0, Math.PI * 2); // Olho direito
    ctx.fill();

    // Desenhar as pupilas
    const pupilRadius = scaledSize * 0.05;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x - eyeOffsetX, y - eyeOffsetY, pupilRadius, 0, Math.PI * 2); // Pupila esquerda
    ctx.arc(x + eyeOffsetX, y - eyeOffsetY, pupilRadius, 0, Math.PI * 2); // Pupila direita
    ctx.fill();
}

// Atualizar a função de desenhar fantasmas para usar o tamanho ajustado
function drawGhosts() {
    ghosts.forEach(ghost => {
        drawGhost(ctx, ghost.x, ghost.y, PACMAN_RADIUS * 2, ghost.color);
    });
}

// Atualizar o jogo
function update() {
    let newX = pacman.x;
    let newY = pacman.y;

    if (pacman.direction === "LEFT") newX -= pacman.speed;
    if (pacman.direction === "RIGHT") newX += pacman.speed;
    if (pacman.direction === "UP") newY -= pacman.speed;
    if (pacman.direction === "DOWN") newY += pacman.speed;

    // Adicionar lógica para túneis (atravessar de um lado para o outro)
    if (newX < 0) newX = canvas.width - TILE_SIZE / 2; // Sai pela esquerda, entra pela direita
    if (newX > canvas.width) newX = TILE_SIZE / 2; // Sai pela direita, entra pela esquerda

    if (!checkCollision(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
    }

    // Comer pontos e pílulas
    let col = Math.floor(pacman.x / TILE_SIZE);
    let row = Math.floor(pacman.y / TILE_SIZE);
    if (maze[row][col] === 2) {
        maze[row][col] = 0;
        score += 10;
    } else if (maze[row][col] === 3) {
        maze[row][col] = 0;
        score += 50;

        // Tornar fantasmas vulneráveis e fazê-los fugir
        ghosts.forEach(ghost => {
            ghost.vulnerable = true;
            ghost.fleeing = true;
        });

        // Reverter estado dos fantasmas após 10 segundos
        setTimeout(() => {
            ghosts.forEach(ghost => {
                ghost.vulnerable = false;
                ghost.fleeing = false;
            });
        }, 20000);
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

        if (ghost.fleeing) {
            // Fantasmas fogem do Pac-Man
            if (Math.abs(dx) > Math.abs(dy)) {
                ghost.direction = dx > 0 ? "LEFT" : "RIGHT";
            } else {
                ghost.direction = dy > 0 ? "UP" : "DOWN";
            }
        } else {
            // Fantasmas perseguem o Pac-Man
            if (Math.random() < 0.5) {
                ghost.direction = dx > 0 ? "RIGHT" : "LEFT";
            } else {
                ghost.direction = dy > 0 ? "DOWN" : "UP";
            }
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
                ghost.x = (6 + ghosts.indexOf(ghost)) * TILE_SIZE + TILE_SIZE / 2;
                ghost.y = 4 * TILE_SIZE + TILE_SIZE / 2;
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
        ghost.x = (6 + index) * TILE_SIZE + TILE_SIZE / 2;
        ghost.y = 4 * TILE_SIZE + TILE_SIZE / 2;
    });
}

// Reiniciar o labirinto
function resetMaze() {
    maze.forEach((row, rowIndex) => {
        maze[rowIndex] = row.map(cell => (cell === 0 ? 2 : cell));
    });
}

// Desenhar Pac-Man
function drawPacman() {
    ctx.fillStyle = "yellow";

    // Determinar o ângulo da boca com base na direção
    let startAngle, endAngle;
    if (pacman.direction === "LEFT") {
        startAngle = Math.PI + pacman.mouthAngle * Math.PI;
        endAngle = Math.PI - pacman.mouthAngle * Math.PI;
    } else if (pacman.direction === "RIGHT") {
        startAngle = pacman.mouthAngle * Math.PI;
        endAngle = 2 * Math.PI - pacman.mouthAngle * Math.PI;
    } else if (pacman.direction === "UP") {
        startAngle = 1.5 * Math.PI + pacman.mouthAngle * Math.PI;
        endAngle = 1.5 * Math.PI - pacman.mouthAngle * Math.PI;
    } else if (pacman.direction === "DOWN") {
        startAngle = 0.5 * Math.PI + pacman.mouthAngle * Math.PI;
        endAngle = 0.5 * Math.PI - pacman.mouthAngle * Math.PI;
    } else {
        // Caso o Pac-Man esteja parado, a boca ficará virada para a direita
        startAngle = pacman.mouthAngle * Math.PI;
        endAngle = 2 * Math.PI - pacman.mouthAngle * Math.PI;
    }

    // Desenhar o Pac-Man com a boca na direção correta
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, PACMAN_RADIUS, startAngle, endAngle);
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();
}

// Verificar se o labirinto está sendo desenhado corretamente
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar o canvas antes de desenhar

    // Desenhar labirinto
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "blue"; // Cor das paredes
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); // Preencher as paredes
            } else if (maze[row][col] === 2) {
                ctx.fillStyle = "white"; // Cor dos pontos
                ctx.beginPath();
                ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 4, 0, Math.PI * 2); // Reduzir o tamanho dos pontos
                ctx.fill();
            } else if (maze[row][col] === 3) {
                ctx.fillStyle = "gold"; // Cor das pílulas
                ctx.beginPath();
                ctx.arc(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, 6, 0, Math.PI * 2); // Reduzir o tamanho das pílulas
                ctx.fill();
            } else if (maze[row][col] === 4) {
                ctx.fillStyle = "purple"; // Cor da casa dos fantasmas
                ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE); // Preencher a casa dos fantasmas
            }
        }
    }

    drawPacman(); // Desenhar Pac-Man
    drawGhosts(); // Desenhar Fantasmas
}

// Loop do jogo
function gameLoop() {
    update();
    updateGhosts();
    draw();
    requestAnimationFrame(gameLoop);
}

// Certifique-se de que o jogo seja iniciado apenas quando o botão for clicado
document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
        startButton.style.display = "none"; // Esconder o botão após iniciar o jogo
        canvas.style.display = "block"; // Mostrar o canvas
        draw(); // Garantir que o labirinto seja desenhado inicialmente
        gameLoop(); // Iniciar o loop do jogo
    });
});
