const canvas = document.getElementById('tetrisCanvas');
        const ctx = canvas.getContext('2d');
        const row = 20;
        const col = 10;
        const sq = 30;
        const vacant = "white"; // color of an empty square

        // draw a square
        function drawSquare(x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x * sq, y * sq, sq, sq);
            ctx.strokeStyle = "black";
            ctx.strokeRect(x * sq, y * sq, sq, sq);
        }

        // create the board
        let board = [];
        for (let r = 0; r < row; r++) {
            board[r] = [];
            for (let c = 0; c < col; c++) {
                board[r][c] = vacant;
            }
        }

        // draw the board
        function drawBoard() {
            for (let r = 0; r < row; r++) {
                for (let c = 0; c < col; c++) {
                    drawSquare(c, r, board[r][c]);
                }
            }
        }
        drawBoard();

        // The Tetrominoes
        const I = [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ]
        ];

        const J = [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ];

        const L = [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ];

        const O = [
            [
                [1, 1],
                [1, 1]
            ]
        ];

        const S = [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ]
        ];

        const T = [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ];

        const Z = [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ]
        ];

        // the pieces and their colors
        const pieces = [
            [Z, "red"],
            [S, "green"],
            [T, "yellow"],
            [O, "blue"],
            [L, "purple"],
            [I, "cyan"],
            [J, "orange"]
        ];

        // The Object Piece
        function Piece(tetromino, color) {
            this.tetromino = tetromino;
            this.color = color;

            this.tetrominoN = 0; // we start from the first pattern
            this.activeTetromino = this.tetromino[this.tetrominoN];

            // we need to control the pieces
            this.x = 3;
            this.y = -2;
        }

        // fill function
        Piece.prototype.fill = function (color) {
            for (let r = 0; r < this.activeTetromino.length; r++) {
                for (let c = 0; c < this.activeTetromino.length; c++) {
                    // we draw only occupied squares
                    if (this.activeTetromino[r][c]) {
                        drawSquare(this.x + c, this.y + r, color);
                    }
                }
            }
        }

        // draw a piece to the board
        Piece.prototype.draw = function () {
            this.fill(this.color);
        }

        // undraw a piece
        Piece.prototype.unDraw = function () {
            this.fill(vacant);
        }

        // move Down the piece
        Piece.prototype.moveDown = function () {
            if (!this.collision(0, 1, this.activeTetromino)) {
                this.unDraw();
                this.y++;
                this.draw();
            } else {
                this.lock();
                p = randomPiece();
            }
        }

        // move Right the piece
        Piece.prototype.moveRight = function () {
            if (!this.collision(1, 0, this.activeTetromino)) {
                this.unDraw();
                this.x++;
                this.draw();
            }
        }

        // move Left the piece
        Piece.prototype.moveLeft = function () {
            if (!this.collision(-1, 0, this.activeTetromino)) {
                this.unDraw();
                this.x--;
                this.draw();
            }
        }

        // rotate the piece
        Piece.prototype.rotate = function () {
            let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
            let kick = 0;

            if (this.collision(0, 0, nextPattern)) {
                if (this.x > col / 2) {
                    kick = -1; // move the piece to the left
                } else {
                    kick = 1; // move the piece to the right
                }
            }

            if (!this.collision(kick, 0, nextPattern)) {
                this.unDraw();
                this.x += kick;
                this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
                this.activeTetromino = nextPattern;
                this.draw();
            }
        }

        let score = 0;

        Piece.prototype.lock = function () {
            for (let r = 0; r < this.activeTetromino.length; r++) {
                for (let c = 0; c < this.activeTetromino.length; c++) {
                    // we skip the vacant squares
                    if (!this.activeTetromino[r][c]) {
                        continue;
                    }
                    // pieces to lock on top = game over
                    if (this.y + r < 0) {
                        alert("Game Over");
                        // stop request animation frame
                        gameOver = true;
                        break;
                    }
                    // we lock the piece
                    board[this.y + r][this.x + c] = this.color;
                }
            }
            // remove full rows
            for (let r = 0; r < row; r++) {
                let isRowFull = true;
                for (let c = 0; c < col; c++) {
                    isRowFull = isRowFull && (board[r][c] != vacant);
                }
                if (isRowFull) {
                    for (let y = r; y > 1; y--) {
                        for (let c = 0; c < col; c++) {
                            board[y][c] = board[y - 1][c];
                        }
                    }
                    for (let c = 0; c < col; c++) {
                        board[0][c] = vacant;
                    }
                    // increment the score
                    score += 10;
                }
            }
            // update the board
            drawBoard();
        }

        // collision detection function
        Piece.prototype.collision = function (x, y, piece) {
            for (let r = 0; r < piece.length; r++) {
                for (let c = 0; c < piece.length; c++) {
                    // if the square is empty, we skip it
                    if (!piece[r][c]) {
                        continue;
                    }
                    // coordinates of the piece after movement
                    let newX = this.x + c + x;
                    let newY = this.y + r + y;

                    // conditions
                    if (newX < 0 || newX >= col || newY >= row) {
                        return true;
                    }
                    // skip newY < 0; board[-1] will crash our game
                    if (newY < 0) {
                        continue;
                    }
                    // check if there is a locked piece already in place
                    if (board[newY][newX] != vacant) {
                        return true;
                    }
                }
            }
            return false;
        }

        // control the piece
        document.addEventListener("keydown", CONTROL);

        function CONTROL(event) {
            if (event.keyCode == 37) {
                p.moveLeft();
                dropStart = Date.now();
            } else if (event.keyCode == 38) {
                p.rotate();
                dropStart = Date.now();
            } else if (event.keyCode == 39) {
                p.moveRight();
                dropStart = Date.now();
            } else if (event.keyCode == 40) {
                p.moveDown();
            }
        }

        // drop the piece every 1sec
        let dropStart = Date.now();
        let gameOver = false;
        function drop() {
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > 1000) {
                p.moveDown();
                dropStart = Date.now();
            }
            if (!gameOver) {
                requestAnimationFrame(drop);
            }
        }

        drop();

        // generate random pieces
        function randomPiece() {
            let r = Math.floor(Math.random() * pieces.length) // 0 -> 6
            return new Piece(pieces[r][0], pieces[r][1]);
        }

        let p = randomPiece();