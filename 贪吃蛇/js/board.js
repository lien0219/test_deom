// 用于记录、读取矩阵内的方格状态 (''表示空 'snake'表示蛇, 'food'表示食物)
class Grid {
  constructor(rows, cols) {
    this.rows = rows
    this.cols = cols
    // tile 单个格子(瓷砖)。Grid网格,表示所有格子之和
    this.tiles = []
    // 初始化
    for (let r = 0; r < rows; r++) {
      this.tiles[r] = []
      for (let c = 0; c < cols; c++) {
        this.tiles[r][c] = ''
      }
    }
  }
  get(c, r) {
    return this.tiles[c][r]
  }
  set(c, r, val) {
    this.tiles[c][r] = val
  }
}

// 方块/格子 基类
class Tile {
  constructor(opt) {
    this.parent = opt.parent // 自己的父对象
    this.collection = opt.collection // 自己所在容器（数组）
    this.col = opt.col // 列
    this.row = opt.row // 行
    this.x = opt.x // 坐标：x
    this.y = opt.y // 坐标：y
    this.w = opt.w // 宽
    this.h = opt.h // 高
  }
}

// 格子属性 蛇尾痕迹/食物指引路径
class BoardTile extends Tile {
  constructor(opt) {
    // 调用父类构造
    super(opt)
    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    this.el.className = 'tile'
    // 加入到父对象的boardClass中
    this.parent.boardEl.appendChild(this.el)

    // 方块可能具有的 CSS 类
    this.classes = {
      passed: 0, // 蛇游过的方块的 CSS 类
      path: 0, // 指示食物路径的方块的 CSS 类
      up: 0, // 向上路径方块的 CSS 类
      down: 0, // 向下路径方块的 CSS 类
      left: 0, // 向左路径方块的 CSS 类
      right: 0 // 向右路径方块的 CSS 类
    }
  }
  // 实时更新面板
  update() {
    // 蛇尾痕迹逻辑
    for (let k in this.classes) {
      //只有蛇经过的方格的CSS类passed计数会超过1，消除passed,留痕效果
      if (k == 'passed' && this.classes[k]) {
        this.classes[k]--
      }
    }
    // 判断是否时在放着食物的方块的十字线上 （col和row有一条对应就是在十字线上）
    if (this.parent.food.tile.col === this.col || this.parent.food.tile.row === this.row) {
      this.classes.path = 1 // .path，属于引导到食物的路径上的方块
      // .right，路径上的右箭头方块 其他同理
      this.classes.right = this.col < this.parent.food.tile.col ? 1 : 0
      this.classes.left = this.col > this.parent.food.tile.col ? 1 : 0
      this.classes.up = this.row > this.parent.food.tile.row ? 1 : 0
      this.classes.down = this.row < this.parent.food.tile.row ? 1 : 0
    } else {
      this.classes.path = 0
    }
    // 食物已经被吃，取消方格的 CSS .path 类
    if (this.parent.food.eaten) {
      this.classes.path = 0
    }
    this.render()
  }
  // 渲染界面
  render() {
    this.el.className = 'tile'
    // 加载各种 CSS 类（类计数大于等于1）
    for (let k in this.classes) {
      if (this.classes[k] >= 1) {
        this.el.classList.add(k)
      }
    }
    Object.assign(this.el.style, {
      left: `${this.x}px`,
      top: `${this.y}px`,
      width: `${this.w}px`,
      height: `${this.h}px`
    })
  }
}