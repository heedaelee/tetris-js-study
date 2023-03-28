/**
 * @description Tetris 객체
 * @param number imageX
 * @param number imageY
 * @param array template
 */
class Tetris {
  constructor(imageX, imageY, template) {
    this.imageY = imageY;
    this.imageX = imageX;
    this.template = template;
    this.x = squareCountX / 2;
    this.y = 0;
  }

  checkBottom() {}

  checkLeft() {}

  checkRight() {}

  moveRight() {}

  moveLeft() {}

  moveBottom() {}

  changeRotation() {}
}

const imageSquareSize = 24; // 1개 사각형 사이즈
const size = 40; // X or y축에서 1개의 사각형 + 여백(전체 크기)
const framePerSecond = 24;
const gameSpeed = 5;
const canvas = document.getElementById("canvas");
const Image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const squareCountX = canvas.width / size; // X축 사각형 갯수
const squareCountY = canvas.height / size; //Y축 사각형 갯수

/**
 * 테트리스 shapes
 * @returns Tetris
 */
const shapes = [
  new Tetris(0, 120, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(0, 96, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(0, 72, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 48, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Tetris(0, 24, [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]),
  new Tetris(0, 0, [
    [1, 1],
    [1, 1],
  ]),

  new Tetris(0, 48, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
];

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score;
let initialTwoDArr;
let whiteLineThickness = 4;

let gameLoop = () => {
  setInterval(update, 1000 / gameSpeed);
  setInterval(draw, 1000 / framePerSecond);
  // setInterval(console.log('test'), 1000 / framePerSecond);
};

let update = () => {
  if (gameOver) return;
  if (currentShape.checkBottom()) {
    currentShape.y += 1;
  }
};

/** 개별 사각형 그려주는 함수
 *  x, y : 좌표
 *  width, height: 크기
 *  color: 채우는 배경
 **/
let drawRect = (x, y, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
};

/**
 * 흰색 경계 테두리 그려주는 함수
 */
let drawBackground = () => {
  drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");
  for (let i = 0; i < squareCountX + 1; i++) {
    drawRect(
      size * i - whiteLineThickness,
      0,
      whiteLineThickness,
      canvas.height,
      "white"
    );
  }

  for (let i = 0; i < squareCountY + 1; i++) {
    drawRect(
      0,
      size * i - whiteLineThickness,
      canvas.width,
      whiteLineThickness,
      "white"
    );
  }
};

/**
 * 현재 테트리스 그려주는 함수
 *
 */
let drawCurrentTetris = () => {
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      if (currentShape.template[i][j] === 0) continue;
      ctx.drawImage(
        image,
        currentShape.imageX,
        currentShape.imageY,
        imageSquareSize,
        imageSquareSize,
        Math.trunc(currentShape.x) * size + size * i,
        Math.trunc(currentShape.x) * size + size * j,
        size,
        size
      );
    }
  }
};

let drawSquares = () => {};

let drawNextShape = () => {};

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawSquares();
  drawCurrentTetris();
  drawNextShape();
  if (gameOver) {
    drawGameOver();
  }
};
/**
 * 테트리스 랜덤 모양 나오게 하는 함수
 * @returns Object {}
 */
let getRandomShape = () => {
  return Object.create(
    shapes[Math.floor(Math.random() * shapes.length)]
  );
};
let resetVars = () => {
  initialTwoDArr = [];
  for (let i = 0; i < squareCountY; i++) {
    let temp = [];
    for (let j = 0; j < squareCountX; j++) {
      temp.push({ imageX: -1, imageY: -1 });
    }
    initialTwoDArr.push(temp);
  }
  score = 0;
  gameOver = false;
  currentShape = getRandomShape();
  console.log(`현재 모양 ${JSON.stringify(currentShape)}`);
  nextShape = getRandomShape();
  console.log(`다음 모양 ${JSON.stringify(nextShape)}`);
  gameMap = initialTwoDArr;
};

resetVars();
gameLoop();
