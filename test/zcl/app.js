let zcl = new Zcl("#container").start();

let re1 = new Rectangle({
  p1 : new Shapes.point(300, 20),
  p2 : new Shapes.point(100, 100),
  bgcolor : "blue"
});
let re = new Rectangle({
  p1 : new Shapes.point(300, 20),
  p2 : new Shapes.point(120, 120),
  bgcolor : "red"
});
re.on("click", function(e) {
  console.log(`re click:${e.type}:${e.offsetX},${e.offsetY}`);
})
re.on("mouseout", (e) => {
  console.log(`re mouseout:${e.type}:${e.offsetX},${e.offsetY}`);
});
zcl.add(re);
zcl.add(re1);

let c = new Circle(new Shapes.point(100, 300), 100);
c.on("click", (e) => {
  console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})
zcl.add(c);

let l3 = new Line(new Shapes.point(100, 100), new Shapes.point(260, 200));
l3.on("mouseout", function(e){
  console.log(`l3 mouseout pos:${e.type}:${e.offsetX},${e.offsetY}`);
})
zcl.add(l3);

zcl.layerManager.create( -1, "background" ).on('show', function(e){
  var icvs = this._ctx;

  icvs.save();
  icvs.fillStyle = 'rgba(40, 120, 255, 1)';

  // 计算应该清除的范围
  const size = new S.point(this.width, this.height);
  const pos = new S.point(0, 0);
  pos.dotMatrix(this._transformTo.invert());
  size.dotMatrix(this._transformTo.scaleM.invert());
  icvs.fillRect(
    pos._x,
    pos._y,
    size._x,
    size._y);

  icvs.strokeStyle = "rgba(255, 255, 255, 1)";
  icvs.lineWidth = 0.8;
  icvs.setLineDash([6, 2, 6, 2]);
  icvs.lineDashOffset = 2;

  var pixSizeX = 25;
  var pixSizeY = 25;
  var numberX = this.height / pixSizeX;
  var numberY = this.width / pixSizeY;

  for (var i = 0; i <= numberX; i++) {
    if (i % 4 == 0)
      icvs.strokeStyle = "rgba(255, 255, 255, 0.9)";
    else
      icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
    icvs.beginPath();
    icvs.moveTo(0 + 0.5, i * pixSizeX + 0.5);
    icvs.lineTo(this.width + 0.5, i * pixSizeX + 0.5);
    icvs.stroke();
  }

  for (var i = 0; i <= numberY; i++) {
    if (i % 4 == 0)
      icvs.strokeStyle = "rgba(255, 255, 255, 0.6)";
    else
      icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";

    icvs.beginPath();
    icvs.moveTo(i * pixSizeY + 0.5, 0);
    icvs.lineTo(i * pixSizeY + 0.5, this.height + 0.5);
    icvs.stroke();
  }

  icvs.restore();
});

zcl.on("click", function (e) {
  console.log(`*** zcl click pos:${e.type}:${e.offsetX},${e.offsetY} ***`);
});

// 显示渲染信息
zcl.on("timing$asyn", (e) => {
  let date = new Date();
  document.querySelector("#date").innerHTML =
    `当前时间: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  document.querySelectorAll("#fps")[0].innerHTML = `FPS:${e.timing.fps}`;
  document.querySelectorAll("#avemillisecond")[0].innerHTML = `平均毫秒数:${e.timing.avemillisecond}ms`;
});


function zclreset() {
  zcl.resetTransform();
}