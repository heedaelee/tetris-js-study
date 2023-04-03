/**
 * @description Tetris 객체
 * @param number imageX
 * @param number imageY
 * @param array template
 */
class Tetris {
  /**
   * @param {number} imageX 컬러를 의미, 클리핑 할 png 파일의 x좌표
   * @param {number} imageY 컬러를 의미, 클리핑 할 png 파일의 y좌표
   * @param {number[]} template 테트리스 블락 형태
   * x : 캔버스 중 x축 위치
   * y : 캔버스 중 y축 위치
   *
   * 유의점 : 헷갈리기 쉬운게 imageX는 컬러구성을 위한 컬러 블락(png파일) 에서
   * 좌표점이고, 실제 gameMap에서 x,y 좌표는 this.x, this.y로 사용된다.
   */
  constructor(imageX, imageY, template) {
    this.imageY = imageY;
    this.imageX = imageX;
    this.template = template;
    this.x = squareCountX / 2;
    this.y = 0;
  }

  /**
   * checkBottom에서 canDown으로 이름 변경
   * 블럭이 내려갈 수 있는지 체크해주는 함수
   * 내려갈수 있으면 true, 없으면 false
   * @return {boolean}
   */
  canDown() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] === 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realY + 1 >= squareCountY) {
          return false;
        }
        if (gameMap[realY + 1][realX].imageX !== -1) {
          /**
           * 위 조건 의미는 즉 imageX === 0, 컬러가 있다는 의미
           * 못 내려감
           * */
          return false;
        }
      }
    }
    return true;
  }

  /* 소수점  */
  getTruncedPosition() {
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }

  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX - 1 < 0) {
          return false;
        }

        if (gameMap[realY][realX - 1].imageX != -1) return false;
      }
    }
    return true;
  }

  checkRight() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] === 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX + 1 >= squareCountX) {
          return false;
        }
        if (gameMap[realY][realX + 1].imageX !== -1) return false;
      }
    }
    return true;
  }

  moveRight() {
    if (this.checkRight()) {
      this.x += 1;
    }
  }

  moveLeft() {
    if (this.checkLeft()) {
      this.x -= 1;
    }
  }

  moveBottom() {
    if (this.canDown()) {
      this.y += 1;
      score += 1;
    }
  }
  /**
   * TODO:
   * 스페이스를 눌렀을때,
   * canDown 여부를 체크하고,
   * 현재 y축 좌표를 알고,
   * 해당블록의 y 높이를 더한 뒤,
   * gameMap에서 다음 Y축 남은 블록중에,
   * imageX 값이 -1이 아닌 블록까지의 count를 계산해주고 해당 블록 y축과 더해주면 된다.
   */
  pressSpace() {
    if (this.canDown()) {
      const fromTopToBottom =
        this.getTruncedPosition().y + this.template.length;
      let fromLeftToTemp = this.getTruncedPosition().x;
      if (fromLeftToTemp === -1) fromLeftToTemp = 0;
      if (fromLeftToTemp + this.template.length >= 11)
        fromLeftToTemp = 6;

      let countToDown = 0;
      // console.log(`fromLeftToTemp : ${fromLeftToTemp}`);
      // console.log(`this.template.length : ${this.template.length}`);
      // console.log(`합 : ${fromLeftToTemp + this.template.length}`);

      /* 해당 블록 y축+템플릿길이 부터 어디까지 바닥인지 체크 */
      for (let i = fromTopToBottom; i < gameMap.length; i++) {
        for (
          let j = fromLeftToTemp;
          j < fromLeftToTemp + this.template.length;
          j++
        ) {
          if (gameMap[i][j].imageX !== -1) {
            countToDown =
              gameMap.length -
              1 -
              fromTopToBottom -
              (gameMap.length - i);
            break;
          }
        }
        if (countToDown !== 0) break;
      }

      if (countToDown === 0) {
        countToDown = gameMap.length - 1 - fromTopToBottom;
      }
      // console.log(`countToDown : ${countToDown}`);
      this.y += countToDown;
      score += countToDown;
    }
  }
  /**
   * 테트리스 블록 회전 : UP 키
   */
  changeRotation() {
    let tempTemplate = [];
    // this.template : 블록 모양 배열
    for (let i = 0; i < this.template.length; i++)
      tempTemplate[i] = this.template[i].slice();
    let n = this.template.length; //블록 모양 row 갯수

    for (let layer = 0; layer < n / 2; layer++) {
      let first = layer;
      let last = n - 1 - layer;
      for (let i = first; i < last; i++) {
        let offset = i - first;
        let top = this.template[first][i];
        this.template[first][i] = this.template[i][last]; //top = right
        this.template[i][last] = this.template[last][last - offset]; //right = bottom
        this.template[last][last - offset] =
          this.template[last - offset][first]; //bottom = left: ;
        this.template[last - offset][first] = top; //left = top ;
      }
    }

    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] === 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (
          realX < 0 ||
          realX >= squareCountX ||
          realY >= squareCountY ||
          realY < 0
        ) {
          this.template = tempTemplate;
          return false;
        }
      }
    }
  }
}

const imageSquareSize = 24; // 1개 사각형 사이즈
const size = 40; // X or y축에서 1개의 사각형 + 여백(전체 크기)
const framePerSecond = 24;
const gameSpeed = 5;
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const Image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
/**
 * X축 사각형 갯수
 **/
const squareCountX = canvas.width / size;
/**
 * Y축 사각형 갯수
 **/
const squareCountY = canvas.height / size;

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

/**
 * 한 줄 꽉 찼을때 삭제 해주는 함수
 */
let deleteCompleteRows = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    let isComplete = true;
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX === -1) isComplete = false;
    }
    if (isComplete) {
      // console.log("complete row");
      score += 1000;
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
    }
    let temp = [];
    for (let j = 0; j < squareCountX; j++) {
      temp.push({ imageX: -1, imageY: -1 });
    }
    gameMap[0] = temp;
  }
};

let update = () => {
  // console.log("업데이트 호출");
  if (gameOver) return;
  if (currentShape.canDown()) {
    currentShape.y += 1;
  } else {
    /** NOTE:
     * tempate는 각 블록 당 2차원 배열 cube를 의미함
     * length 관점에서 2x2, 3x3, 4x4 형태를 지님
     * 우선 각 블록 template을 이중 for문으로 읽는데, 0은 무의미하므로
     * continue, 유의미한 값 1이 있으면
     * 픽셀 단위 개념으로, 해당 블록의 y, x 값 좌표를 읽고,
     * for문 으로 인해 블록 템플릿 내부의 크기랑 더해주면서, 각 게임맵의 픽셀 단위당
     * 해당 블록의 {imageX, imageY}을 할당해줘서 색을 입혀준다
     * 예) {imageX : 0, imageY: 48}
     *    (48이면 lightGreen 컬러이다. 그리고 imageX가 0이 아닌 의미는 컬러가 있다는 뜻이다.)
     */
    for (let k = 0; k < currentShape.template.length; k++) {
      for (let l = 0; l < currentShape.template.length; l++) {
        if (currentShape.template[k][l] == 0) continue;
        gameMap[currentShape.getTruncedPosition().y + l][
          currentShape.getTruncedPosition().x + k
        ] = {
          imageX: currentShape.imageX,
          imageY: currentShape.imageY,
        };
      }
    }

    deleteCompleteRows();
    currentShape = nextShape;
    nextShape = getRandomShape();
    if (!currentShape.canDown()) {
      gameOver = true;
    }
    score += 100;
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
 */
let drawCurrentTetris = () => {
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      if (currentShape.template[i][j] == 0) continue;
      /* currentShape은 각각 Tetris 객체를 나타냄 */
      ctx.drawImage(
        image, //image:color block 7개 있는 png 파일을 의미
        currentShape.imageX, // always 0
        currentShape.imageY, // blue ~ pink까지 각 +24 씩 세로로 자름
        imageSquareSize, // 크기, 가로 40
        imageSquareSize, // 크기, 세로
        Math.trunc(currentShape.x) * size + size * i,
        Math.trunc(currentShape.y) * size + size * j,
        size,
        size
      );
    }
  }
};

let drawSquares = () => {
  // console.log(gameMap);
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX === -1) continue;
      ctx.drawImage(
        image,
        t[j].imageX,
        t[j].imageY,
        imageSquareSize,
        imageSquareSize,
        j * size,
        i * size,
        size,
        size
      );
    }
  }
};

/**
 * 다음 모양 그리는 함수
 */
let drawNextShape = () => {
  nctx.fillStyle = "#bca0dc";
  nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
  for (let i = 0; i < nextShape.template.length; i++) {
    for (let j = 0; j < nextShape.template.length; j++) {
      if (nextShape.template[i][j] == 0) continue;
      nctx.drawImage(
        image,
        nextShape.imageX,
        nextShape.imageY,
        imageSquareSize,
        imageSquareSize,
        size * i,
        size * j + size,
        size,
        size
      );
    }
  }
};

let drawScore = () => {
  sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  sctx.font = "64px Poppins";
  sctx.fillStyle = "black";
  sctx.fillText(score, 10, 50);
};

let drawGameOver = () => {
  ctx.font = "64px Poppins";
  ctx.fillStyle = "black";
  ctx.fillText("Game Over!", 10, canvas.height / 2);
};

let draw = () => {
  // console.log("draw() 호출");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawSquares();
  drawCurrentTetris();
  drawNextShape();
  drawScore();
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

  nextShape = getRandomShape();
  // console.log(`다음 모양 ${JSON.stringify(nextShape)}`);
  gameMap = initialTwoDArr;
};

window.addEventListener("keydown", (event) => {
  if (event.keyCode === 37) currentShape.moveLeft();
  else if (event.keyCode === 38) currentShape.changeRotation();
  else if (event.keyCode === 39) currentShape.moveRight();
  else if (event.keyCode === 40) currentShape.moveBottom();
  else if (event.keyCode === 32) currentShape.pressSpace();
});

resetVars();
gameLoop();
