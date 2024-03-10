class Tool {
  // random number.
  static randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // random color rgb.
  static randomColorRGB() {
    return (
      "rgb(" +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ", " +
      this.randomNumber(0, 255) +
      ")"
    );
  }
  // random color hsl.
  static randomColorHSL(hue, saturation, lightness) {
    return "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)";
  }
  // gradient color.
  static gradientColor(ctx, cr, cg, cb, ca, x, y, r) {
    const col = cr + "," + cg + "," + cb;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + ", " + ca * 1 + ")");
    g.addColorStop(0.5, "rgba(" + col + ", " + ca * 0.5 + ")");
    g.addColorStop(1, "rgba(" + col + ", " + ca * 0 + ")");
    return g;
  }
}

/*
  When want to use angle.
*/

class Angle {
  constructor(angle) {
    this.a = angle;
    this.rad = (this.a * Math.PI) / 180;
  }

  incDec(num) {
    this.a += num;
    this.rad = (this.a * Math.PI) / 180;
    return this.rad;
  }
}

/*
  When want to use controller.
*/

class Controller {
  constructor(id) {
    this.id = document.getElementById(id);
  }
  getVal() {
    return this.id.value;
  }
}

/*
  When want to use time.
*/

class Time {
  constructor(time) {
    this.startTime = time;
    this.lastTime;
    this.elapsedTime;
  }

  getElapsedTime() {
    this.lastTime = Date.now();
    this.elapsedTime = (this.startTime - this.lastTime) * -1;
    return this.elapsedTime;
  }
}

/*
  When want to use time.
*/
let canvas;
const simplex = new SimplexNoise();

class Canvas {
  constructor(bool) {
    // create canvas.
    this.canvas = document.createElement("canvas");
    // if on screen.
    if (bool === true) {
      this.canvas.style.display = "block";
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      document.getElementsByTagName("body")[0].appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    // mouse infomation.
    this.mouseX = null;
    this.mouseY = null;
    // shape
    this.shapeNum = 3;
    this.shapes = [];
    // time
    this.behavior = 0;
    this.time = new Time(Date.now());
    // glitch
    this.glitch;
    this.glitchSwitch = false;
    // dom
    this.mes1 = document.getElementById("mes1");
    this.mes2 = document.getElementById("mes2");
    this.list = document.getElementById("list");
    this.ul = this.list.lastElementChild;
    this.asks = [
      "I'm sorry, Siri.",
      "I love Apple and Siri!",
      "It's a expensive",
      "Are you Alexa?",
      "Do you hate Fortninte?",
      "OK Google!",
      "Do you like windows?",
      "I don't like safari.",
    ];
    for (let i = 0; i < 100; i++) {
      let li = document.createElement("li");
      let a = document.createElement("a");
      a.setAttribute("href", "#");
      a.textContent = this.asks[Tool.randomNumber(0, this.asks.length - 1)];
      li.appendChild(a);
      this.ul.appendChild(li);
    }
    this.a = document.getElementsByTagName("a");
    for (let i = 0; i < this.a.length; i++) {
      this.a[i].addEventListener("click", function (e) {
        e.preventDefault();
        canvas.glitchSwitch = true;
        for (let i = 0; i < canvas.shapes.length; i++) {
          canvas.shapes[i].cr = 150;
        }
        if (
          this.textContent === "I love Apple and Siri!" ||
          this.textContent === "I'm sorry, Siri."
        ) {
          canvas.glitchSwitch = false;
          for (let i = 0; i < canvas.shapes.length; i++) {
            canvas.shapes[i].cr = 150;
            for (let i = 0; i < canvas.shapes.length; i++) {
              canvas.shapes[i].c = {
                r: Tool.randomNumber(0, 255),
                g: Tool.randomNumber(0, 255),
                b: Tool.randomNumber(0, 255),
                a: 1,
              };
            }
          }
        }
        if (canvas.glitchSwitch === true) {
          for (let i = 0; i < canvas.shapes.length; i++) {
            canvas.shapes[i].c = {
              r: 255,
              g: 0,
              b: 0,
              a: 1,
            };
          }
        }
      });
    }
  }

  // init, render, resize
  init() {
    this.behavior = 0;
    this.time = new Time(Date.now());
    this.glitchSwitch = false;
    this.shapes = [];
    for (let i = 0; i < this.shapeNum; i++) {
      const s = new Shape(this.ctx, 0, this.height - this.height / 5, i + 1);
      this.shapes.push(s);
    }
    this.glitch = new Glitch(this.ctx);
  }

  render() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(i);
    }
    this.changeBehavior();
    if (this.glitchSwitch === true) {
      this.glitch.render();
    }
  }

  changeBehavior() {
    const e = this.time.getElapsedTime();
    if (e > 4000) {
      this.mes2.setAttribute("class", "siri");
      this.behavior = 1;
    }
    if (e > 8000) {
      this.behavior = 2;
    }
    if (e > 8200) this.behavior = 3;
    if (e > 8400) {
      this.behavior = 4;
    }
    if (e > 9000) {
      this.list.style.opacity = 1;
      this.list.style.display = "block";
      this.list.setAttribute("class", "slideUp");
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.init();
  }
}

/*
  Shape class.
*/

class Shape {
  constructor(ctx, x, y, i) {
    this.ctx = ctx;
    this.init(x, y, i);
  }

  init(x, y, i) {
    this.x = x;
    this.y = y;
    this.i = i;
    this.cr = 50;
    this.a = new Angle(Tool.randomNumber(0, 360));
    this.a1 = new Angle(Tool.randomNumber(0, 360));
    this.step = canvas.width / 360;
    this.c = {
      r: Tool.randomNumber(0, 255),
      g: Tool.randomNumber(0, 255),
      b: Tool.randomNumber(0, 255),
      a: 1,
    };
    this.noiseDist = 10;
    this.noiseX = 1000;
    this.noiseY = 1000;
  }

  drawLine() {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineJoin = "bevel";
    ctx.fillStyle = "rgb(" + this.c.r + ", " + this.c.g + ", " + this.c.b + ")";
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    for (let x = 0; x <= canvas.width; x += this.step) {
      const noise =
        simplex.noise3D(x / this.noiseX, this.y / this.noiseY, this.a.rad) *
        this.noiseDist;
      const y = Math.sin((x * Math.PI) / 180 / 2) * noise + this.y;
      if (x > canvas.width) {
        ctx.lineTo(x * this.step, canvas.height / 2);
      } else {
        ctx.lineTo(x * this.step, y);
      }
    }
    for (let x = canvas.width; x > 0; x -= this.step) {
      const noise =
        simplex.noise3D(x / this.noiseX, this.y / this.noiseY, this.a.rad) *
        -this.noiseDist;
      const y = Math.sin((x * Math.PI) / 180 / 2) * noise + this.y;
      if (x > canvas.width) {
        ctx.lineTo(x * this.step, canvas.height / 2);
      } else {
        ctx.lineTo(x * this.step, y);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawCircle() {
    const ctx = this.ctx;
    // in
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = Tool.gradientColor(
      ctx,
      this.c.r,
      this.c.g,
      this.c.b,
      this.c.a,
      canvas.width / 2,
      this.y,
      this.cr
    );
    ctx.translate(canvas.width / 2, this.y);
    ctx.rotate(Math.sin(this.a1.rad));
    ctx.scale(Math.cos(this.a1.rad * this.i), Math.sin(this.a1.rad * this.i));
    ctx.translate(-canvas.width / 2, -this.y);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, this.y, this.cr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.restore();
    // out
    ctx.save();
    ctx.lineWidth = 5;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = Tool.gradientColor(
      ctx,
      this.c.r,
      this.c.g,
      this.c.b,
      this.c.a,
      canvas.width / 2,
      this.y,
      this.cr
    );
    ctx.strokeStyle = Tool.gradientColor(
      ctx,
      this.c.r,
      this.c.g,
      this.c.b,
      this.c.a,
      canvas.width / 2,
      this.y,
      this.cr + 5
    );
    ctx.beginPath();
    ctx.arc(canvas.width / 2, this.y, this.cr, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.stroke();
    // click
    if (ctx.isPointInPath(canvas.mouseX, canvas.mouseY)) {
      canvas.init();
      this.cr = 50;
      canvas.mouseX = null;
      canvas.mouseY = null;
    }
    ctx.restore();
  }

  changeParams() {
    if (canvas.behavior === 1) {
      this.noiseDist = 30;
      this.noiseX = 100;
      this.noiseY = 100;
    }
    if (canvas.behavior === 2) {
      this.noiseDist *= 1.05;
      this.noiseX *= 1.1;
      this.noiseY *= 1.1;
    }
    if (canvas.behavior === 3) {
      this.noiseDist *= 0.9;
      this.noiseX *= 0.9;
      this.noiseY *= 0.9;
    }
  }

  updateParams() {
    this.a.incDec(1);
    this.a1.incDec(0.5);
    if (this.cr === 51) {
      canvas.glitchSwitch = false;
      this.c = {
        r: Tool.randomNumber(0, 255),
        g: Tool.randomNumber(0, 255),
        b: Tool.randomNumber(0, 255),
        a: 1,
      };
    }
    if (this.cr > 50) this.cr -= 1;
  }

  render() {
    canvas.behavior < 4 ? this.drawLine() : this.drawCircle();
    this.updateParams();
    this.changeParams();
  }
}

/*
  Glitch class.
*/

class Glitch {
  constructor(ctx) {
    this.ctx = ctx;
    this.splitNum = 5;
    this.splitY = canvas.height / this.splitNum;
    this.angles = [];
    this.anglesForRGB = [];
    this.dataArr = [];
    this.getAngles();
    this.getAnglesForRGB();
  }

  getAnglesForRGB() {
    for (let i = 0; i < 3; i++) {
      const a = Tool.randomNumber(0, 360);
      const r = (a * Math.PI) / 180;
      const arr = [a, r];
      this.anglesForRGB.push(arr);
    }
  }

  getAngles() {
    for (var i = 0; i < this.splitNum; i++) {
      const angle = Tool.randomNumber(0, 360);
      const gap = Tool.randomNumber(5, 20);
      const arr = [angle, gap];
      this.angles.push(arr);
    }
  }

  getImageData() {
    for (let i = 0; i < this.splitNum; i++) {
      let d = this.ctx.getImageData(
        0,
        this.splitY * i,
        canvas.width,
        this.splitY + 1
      );
      let data = d.data;
      for (let i = 3; i < data.length - 4; i += 4) {
        if (data[i] < 255) {
          data[i] = 50;
          data[i - 1] = Math.sin(this.anglesForRGB[0][1]) * 255;
          data[i - 2] = Math.cos(this.anglesForRGB[1][1]) * 255;
          data[i - 3] = Math.tan(this.anglesForRGB[2][1]) * 255;
        }
      }
      this.dataArr.push(d);
    }
  }

  updateAnglesForRGB() {
    for (let i = 0; i < this.anglesForRGB.length; i++) {
      this.anglesForRGB[i][1] += Tool.randomNumber(-1, 1) * Math.random();
    }
  }

  addImage() {
    for (let i = 0; i < this.splitNum; i++) {
      if (Math.random() > 0.5) {
        this.ctx.putImageData(
          this.dataArr[i],
          Math.sin((this.angles[i][0] * Math.PI) / 180) * this.angles[i][1],
          this.splitY * i
        );
      } else {
        this.ctx.putImageData(
          this.dataArr[Tool.randomNumber(0, this.splitNum - 1)],
          Math.sin((this.angles[i][0] * Math.PI) / 180) * canvas.width,
          this.splitY * i
        );
      }
    }
  }

  changeAngle() {
    for (var i = 0; i < this.angles.length; i++) {
      this.angles[i][0] += Tool.randomNumber(-50, 50);
    }
  }

  render() {
    this.dataArr = [];
    this.getImageData();
    this.changeAngle();
    this.updateAnglesForRGB();
    this.addImage();
  }
}

(function () {
  "use strict";
  window.addEventListener("load", function () {
    canvas = new Canvas(true);
    canvas.init();

    function render() {
      window.requestAnimationFrame(function () {
        canvas.render();
        render();
      });
    }

    render();

    // event
    window.addEventListener(
      "resize",
      function () {
        canvas.resize();
      },
      false
    );

    canvas.canvas.addEventListener(
      "click",
      function (e) {
        canvas.mouseX = e.clientX;
        canvas.mouseY = e.clientY;
      },
      false
    );
  });
})();
