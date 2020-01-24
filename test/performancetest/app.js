let zcl = new Zcl("#can");

for( let i = 0; i < 10000; i++ ){

  let x = suport.getRandomInt(0, 450);
  let y = suport.getRandomInt(0, 450);

  let re = new Rectangle(new Shapes.point(x, y), new Shapes.point(100, 100));
  re.on("click", function(e) {
    console.log(`re click:${e.type}:${e.offsetX},${e.offsetY}`);
  })
  re.on("mouseout", (e) => {
    console.log(`re mouseout:${e.type}:${e.offsetX},${e.offsetY}`);
  });
  zcl.add(re);  
}

// 开始渲染
zcl.start();

// 显示渲染信息
zcl.on("timing$asyn", (e) => {
  let date = new Date();
  document.querySelector("#date").innerHTML =
    `当前时间: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  document.querySelectorAll("#fps")[0].innerHTML = `FPS:${e.timing.fps}`;
  document.querySelectorAll("#avemillisecond")[0].innerHTML = `平均毫秒数:${e.timing.avemillisecond}ms`;
});
