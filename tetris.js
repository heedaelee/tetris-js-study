class Tetris {
  constructor(imageX, imageY, template) {
    this.imageY = imageY;
    this.imageX = imageX;
    this.template = template;
  }

  checkBottom() {}

  checkLeft() {}

  checkRight() {}

  moveRight() {}

  moveLeft() {}

  moveBottom() {}

  changeRotation() {}
}

const imageSquereSize = 24;
const size = 40;
const framePerSecond = 24;
const canvas = document.getElementById("canvas");
const Image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const squareCountX = canvas.width / size; //X축 사각형 cnt
const squareCountY = canvas.height / size; //Y축 사각형 cnt

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
    [0, 1, 0],
    [0, 1, 0],
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

let gameLoop = () => {
  setInterval(update, 1000 / gameSpeed);
  setInterval(draw, 1000 / framePerSecond);
};

let update = () => {};

let draw = () => {};

let getRandomShape = () => {
  return Object.create(
    shapes[Math.floor(Math.random() * shapes.length)]
  );
};
let resetVars = () => {
  initialTwoDArr = [];
  for (let i = 0; i < squareCountY; i++) {
    let temp = [];
    for (let j = 0; i < squareCountX; j++) {
      temp.push({ imageX: -1, imageY: -1 });
    }
    initialTwoDArr.push(temp);
  }
  score = 0;
  gameOver = 0;
  currentShape = getRandomShape();
  nextShape = getRandomShape();
};

gameLoop();
