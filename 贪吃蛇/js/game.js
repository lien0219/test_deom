// 游戏主体，整合所有逻辑
class Game {
  constructor() {
    this.scoreEl = document.querySelector('.score')
    this.boardEl = document.querySelector('.board')
    this.cols = 32
    this.rows = 18
    this.margin = 0.25 // 25%
    this.boardTiles = []
    this.keys = {}
    this.score = 0
    this.timer = new Timer()
    this.spacing = 2
    this.grid = new Grid(this.rows, this.cols)
    // 设定方格大小
    this.tileHeight = this.tileWidth = 30
    // 设定面板大小
    this.boardWidth = (this.tileWidth + this.spacing) * this.cols
    this.boardHeight = (this.tileHeight + this.spacing) * this.rows
    this.createBoardTiles()
    this.bindEvents()
    this.snake = new Snake({
      parent: this
    })
    this.food = new Food({
      parent: this
    })
    this.render()
  }
  // 创建面板
  createBoardTiles() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.boardTiles.push(new BoardTile({
          parent: this,
          collection: this.boardTiles,
          col: x,
          row: y,
          x: x * this.tileWidth,
          y: y * this.tileHeight,
          w: this.tileWidth - this.spacing,
          h: this.tileHeight - this.spacing
        }))
      }
    }
  }
  // 键盘监听器
  keydown(e) {
    e.preventDefault()
    // 因为此函数要同时作为监听执行函数，this 在监听执行时可能绑定到其它对象
    // 在此明确针对的对象就是 game
    let _this = game
    if (e.key.indexOf('Arrow') !== -1) {
      _this.keys[e.key.replace('Arrow', '').toLowerCase()] = 1
    }
  }
  // 绑定
  bindEvents() {
    window.addEventListener('keydown', this.keydown, false)
  }
  update() {
    // 更新每个方块
    this.boardTiles.forEach(t => t.update())
    // 更新蛇
    this.snake.update()
    // 更新食物
    this.food.update()
    // 更新计时器
    this.timer.update()
  }
  render() {
    this.boardEl.style.height = this.boardHeight + 'px'
    this.boardEl.style.width = this.boardWidth + 'px'
    this.scoreEl.innerHTML = this.score
  }
}

const bgm = document.querySelector('#bgm')
let game = new Game()
game.update()
let handle = 0 //记录当前运行的面数，用于暂停
let isPause = true

function start() {
  handle = requestAnimationFrame(start)
  game.update()
}

// 开始
document.querySelector('.start').onclick = function () {
  if (isPause) {
    requestAnimationFrame(start)
    bgm.play()
    isPause = false
  }
}

// 暂停
document.querySelector('.pause').onclick = function () {
  if (!isPause) {
    cancelAnimationFrame(handle)
    bgm.pause()
    isPause = true
  }
}

// 重置
document.querySelector('.reset').onclick = function () {
  // 直接刷新页面
  location.reload();
}