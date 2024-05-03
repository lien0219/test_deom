// 食物方块
class FoodTile extends Tile {
  constructor(opt) {
    super(opt)
    this.highlight = 0
    this.scale = 1 // 放缩 食物变大变小
    this.color = 'skyblue' //食物颜色
    this.opacity = 0 //透明度0=>1有一个过程/特效
    this.el = document.createElement('div')
    this.el.style.position = 'absolute'
    this.parent.boardEl.appendChild(this.el)
  }
  update() {
    this.x = this.col * this.parent.tileWidth
    this.y = this.row * this.parent.tileHeight
    this.highlight = Math.sin(this.parent.timer.elapsed / 200) * 15 + 15
    // 使用sin可以平滑的缩放
    this.scale = 0.8 + Math.sin(this.parent.timer.elapsed / 200) * 0.2
    this.opacity = 1
    this.render()
  }
  render() {
    Object.assign(this.el.style, {
      left: this.x + 'px',
      top: this.y + 'px',
      width: this.w + 'px',
      height: this.h + 'px',
      transform: 'scale(' + this.scale + ')',
      backgroundColor: this.color,
      boxShadow: '0 0 ' + this.highlight + 'px #fff',
      opacity: this.opacity
    })
  }
}

// 食物
class Food {
  constructor(opt) {
    this.parent = opt.parent // game 对象
    // 只有一个方块
    this.tile = new FoodTile({
      parent: this.parent,
      col: 0,
      row: 0,
      x: 0,
      y: 0,
      w: opt.parent.tileWidth - opt.parent.spacing,
      h: opt.parent.tileHeight - opt.parent.spacing
    })
    let empty = [] // “空”格数组
    // 收集“空”格
    for (let r = 0; r < this.parent.rows; r++) {
      for (let c = 0; c < this.parent.cols; c++) {
        let tile = this.parent.grid.get(r, c)
        if (tile === '') {
          empty.push({
            r,
            c
          })
        }
      }
    }
    // 在随机的一个“空”格中生成食物
    const newTile = empty[util.randInt(0, empty.length - 1)]
    this.tile.row = newTile.r
    this.tile.col = newTile.c
    // 被吃标志
    this.eaten = 0
  }
  update() {
    this.tile.update()
    this.parent.grid.set(this.tile.row, this.tile.col, 'food')
    this.render()
  }
  render() {
    this.tile.render()
  }
}