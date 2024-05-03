const die = document.querySelector('#die')
const eat = document.querySelector('#eat')

// 蛇方块
class SnakeTile extends Tile {
  constructor(opt) {
    super(opt)
    this.highlight = 0 //蛇头高亮
    this.alpha = 1 // 蛇身方块位置排序
    this.borderRadius = 0
    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    this.parent.boardEl.appendChild(this.el)
  }
  update(i) {
    this.x = this.col * this.parent.tileWidth
    this.y = this.row * this.parent.tileHeight
    // 蛇头
    if (i === 0) {
      // 使用sin可以让光晕有规律的变大变小
      this.highlight = Math.sin(this.parent.timer.elapsed / 200) * 20 + 20
    } else {
      //蛇身没有
      this.highlight = 0
    }
    // alpha 值随位置调整，越往后颜色(亮度)越小
    this.alpha = 1 - (i / this.parent.snake.tiles.length) * 0.6
  }
  render() {
    this.el.style.left = this.x + 'px'
    this.el.style.top = this.y + 'px'
    this.el.style.width = this.w + 'px'
    this.el.style.height = this.h + 'px'
    // 蛇身背景色
    this.el.style.backgroundColor = 'rgba(255, 255, 255, ' + this.alpha + ')'
    this.el.style.boxShadow = '0 0 ' + this.highlight + 'px #fff'
  }
}

// 蛇
class Snake {
  constructor(opt) {
    this.parent = opt.parent // 自己的父对象
    this.dir = 'right' // 蛇出生默认向右
    this.currentDir = this.dir //当前方向
    // 所有方块： SnakeTile 对象数组
    this.tiles = []
    let row = util.randInt(0, this.parent.grid.rows - 1)
    let col = util.randInt(4, this.parent.grid.cols - 1)
    // 随机生成一条蛇
    for (let i = 0; i < 5; i++) {
      this.tiles.push(new SnakeTile({
        parent: this.parent,
        col: col - i,
        row,
        x: (col - i) * opt.parent.tileWidth,
        y: row * opt.parent.tileHeight,
        w: opt.parent.tileWidth - opt.parent.spacing,
        h: opt.parent.tileHeight - opt.parent.spacing
      }))
    }
    this.last = 0
    this.passedFrames = 0
    this.updateFrameCount = 10
    this.death = false

    // 数据映射到数据矩阵
    let i = this.tiles.length
    while (i--) {
      this.parent.grid.set(this.tiles[i].row, this.tiles[i].col, 'snake')
    }
  }
  update() {
    // 使用currenDir 和 dir 两个变量 可以有效防止热键冲突
    if (this.parent.keys.up && this.currentDir !== 'down') {
      this.dir = 'up'
    } else if (this.parent.keys.down && this.currentDir !== 'up') {
      this.dir = 'down'
    } else if (this.parent.keys.right && this.currentDir !== 'left') {
      this.dir = 'right'
    } else if (this.parent.keys.left && this.currentDir !== 'right') {
      this.dir = 'left'
    }
    this.currentDir = this.dir
    // 重置
    Object.assign(this.parent.keys, {
      up: 0,
      down: 0,
      right: 0,
      left: 0
    })
    // 累加帧数
    this.passedFrames += this.parent.timer.passedFrames
    // 更新时机（达到更新的等待帧数）
    if (this.passedFrames >= this.updateFrameCount) {
      // 重设计帧起点
      this.passedFrames = 0
      // 头部压入，暂时用原先的头部的坐标数据
      this.tiles.unshift(new SnakeTile({
        parent: this.parent,
        collection: this.tiles,
        col: this.tiles[0].col,
        row: this.tiles[0].row,
        x: this.tiles[0].col * this.parent.tileWidth,
        y: this.tiles[0].row * this.parent.tileHeight,
        w: this.parent.tileWidth - this.parent.spacing,
        h: this.parent.tileHeight - this.parent.spacing
      }))
      // 尾部弹出
      this.last = this.tiles.pop()
      this.parent.boardEl.removeChild(this.last.el) // 移走对应 dom 元素
      this.parent.grid.set(this.last.row, this.last.col, '')
      // 留痕（两个周期：2->1->0，最后 3000ms 淡出，见 css）
      // 二维矩阵转化为一维数组存放 [4,5] => 4 * 5 + 5 
      this.parent.boardTiles[this.last.col + (this.last.row * this.parent.cols)].classes.passed = 2

      // 设置蛇身方格标志（排除蛇头）
      let i = this.tiles.length
      while (i--) {
        this.parent.grid.set(this.tiles[i].row, this.tiles[i].col, 'snake')
      }
      // 现在更改蛇头位置
      if (this.dir === 'up') {
        this.tiles[0].row -= 1
      } else if (this.dir === 'down') {
        this.tiles[0].row += 1
      } else if (this.dir === 'left') {
        this.tiles[0].col -= 1
      } else if (this.dir === 'right') {
        this.tiles[0].col += 1
      }

      // 碰墙 穿过去
      if (this.tiles[0].col >= this.parent.cols) {
        this.tiles[0].col = 0
      }
      if (this.tiles[0].col < 0) {
        this.tiles[0].col = this.parent.cols - 1
      }
      if (this.tiles[0].row >= this.parent.rows) {
        this.tiles[0].row = 0
      }
      if (this.tiles[0].row < 0) {
        this.tiles[0].row = this.parent.rows - 1
      }

      // 碰到蛇身
      if (this.parent.grid.get(this.tiles[0].row, this.tiles[0].col) === 'snake') {
        this.death = true
      }

      // 吃到食物
      if (this.parent.grid.get(this.tiles[0].row, this.tiles[0].col) === 'food') {
        this.tiles.push(new SnakeTile({
          parent: this.parent,
          collection: this.tiles,
          col: this.last.col,
          row: this.last.row,
          x: this.last.col * this.parent.tileWidth,
          y: this.last.row * this.parent.tileHeight,
          w: this.parent.tileWidth - this.parent.spacing,
          h: this.parent.tileHeight - this.parent.spacing
        }))
        this.parent.score++
        this.parent.scoreEl.innerHTML = this.parent.score

        this.parent.food.eaten = 1
        this.parent.boardEl.removeChild(this.parent.food.tile.el)

        // 吃食物音效
        eat.play()

        // 推迟一定时间再创建新食物，给人一种食物被吃掉了的明确感觉
        setTimeout(() => {
          this.parent.food = new Food({
            parent: this.parent
          })
        }, 500)
      }

      // 结束
      if (this.death) {
        // 暂停bgm
        bgm.pause()
        // 死亡音效
        die.play()
        alert("游戏结束!")
        cancelAnimationFrame(handle)
        return
      }

      // 更新蛇方块
      i = this.tiles.length
      while (i--) {
        this.tiles[i].update(i)
      }
    }
    this.render()
  }
  render() {
    let i = this.tiles.length
    while (i--) {
      this.tiles[i].render(i)
    }
  }
}