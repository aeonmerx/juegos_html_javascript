 // Snake game logic
        const canvas = document.getElementById('snakeCanvas');
        const ctx = canvas.getContext('2d');

        const tileSize = 20;
        const rows = canvas.height / tileSize;
        const cols = canvas.width / tileSize;

        let snake = [
            { x: tileSize * 5, y: tileSize * 5 },
            { x: tileSize * 4, y: tileSize * 5 },
            { x: tileSize * 3, y: tileSize * 5 },
        ];

        let food = {
            x: tileSize * Math.floor(Math.random() * cols),
            y: tileSize * Math.floor(Math.random() * rows)
        };

        let dx = tileSize;
        let dy = 0;
        let changingDirection = false;
        let score = 0;

        document.addEventListener('keydown', changeDirection);

        function changeDirection(event) {
            const keyPressed = event.keyCode;
            const LEFT = 37;
            const UP = 38;
            const RIGHT = 39;
            const DOWN = 40;

            if (changingDirection) return;
            changingDirection = true;

            const goingUp = dy === -tileSize;
            const goingDown = dy === tileSize;
            const goingRight = dx === tileSize;
            const goingLeft = dx === -tileSize;

            if (keyPressed === LEFT && !goingRight) {
                dx = -tileSize;
                dy = 0;
            }
            if (keyPressed === UP && !goingDown) {
                dx = 0;
                dy = -tileSize;
            }
            if (keyPressed === RIGHT && !goingLeft) {
                dx = tileSize;
                dy = 0;
            }
            if (keyPressed === DOWN && !goingUp) {
                dx = 0;
                dy = tileSize;
            }
        }

        function update() {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score += 10;
                document.getElementById('score').innerText = 'Score: ' + score;
                moveFood();
            } else {
                snake.pop();
            }

            if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
                resetGame();
            }

            changingDirection = false;
        }

        function moveFood() {
            food.x = tileSize * Math.floor(Math.random() * cols);
            food.y = tileSize * Math.floor(Math.random() * rows);

            if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
                moveFood();
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = 'lime';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, tileSize, tileSize);
            });

            ctx.fillStyle = 'red';
            ctx.fillRect(food.x, food.y, tileSize, tileSize);
        }

        function gameLoop() {
            update();
            draw();
            setTimeout(gameLoop, 100);
        }

        function resetGame() {
            snake = [
                { x: tileSize * 5, y: tileSize * 5 },
                { x: tileSize * 4, y: tileSize * 5 },
                { x: tileSize * 3, y: tileSize * 5 },
            ];
            dx = tileSize;
            dy = 0;
            score = 0;
            document.getElementById('score').innerText = 'Score: ' + score;
            moveFood();
        }

        function collision(head) {
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        }

        gameLoop();
