// 计时器
class Timer {
  constructor() {
    this.reset()
  }
  reset() {
    this.now = Date.now()
    this.last = Date.now()
    this.passedFrames = 0
    this.elapsed = 0
  }
  update() {
    this.now = Date.now()
    this.passedFrames = (this.now - this.last) / (1000 / 60) // 60帧每秒计，过了几帧时间
    this.elapsed += this.now - this.last // 消逝时间累计(特效用)
    this.last = this.now
  }
}

// 工具
const util = {
  rand(min, max) {
    return Math.random() * (max - min) + min
  },
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}