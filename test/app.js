let zcl = new Zcl("#can");
let re = new Rectangle(new Shapes.point(20, 20), new Shapes.point(100, 100));
re.on("click", function(e) {
    console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

re.on("mousemove", (e) => {

});

let c = new Circle(new Shapes.point(100, 300), 100);
c.on("click", (e) => {
    console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

let l3 = new Line(new Shapes.point(100, 100), new Shapes.point(260, 200));
l3.on("mousemove", (e) => {
    console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

zcl.add(re);
zcl.add(c);

zcl.add(l3);
let po1 = new Polygon(l3.getBoundingBox());
po1.on("click", function(e) {
    console.log(`po1:${e.type}:${e.offsetX},${e.offsetY}`);
});
zcl.add(po1);

zcl.start();

zcl.on("click", (e) => {
    console.log(`po1:${e.type}:${e.offsetX},${e.offsetY}`);
});

zcl.on("timing$asyn", (e) => {
    let date = new Date(e.timing.framesecond * 1000);
    document.querySelector("#date").innerHTML =
        `当前时间: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    document.querySelectorAll("#fps")[0].innerHTML = `FPS:${e.timing.fps}`;
    document.querySelectorAll("#avemillisecond")[0].innerHTML = `平均毫秒数:${e.timing.avemillisecond}ms`;
});



console.table(EventNames);