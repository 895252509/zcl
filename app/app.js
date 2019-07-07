
let zcl = new Zcl("#can");
let re = new Rectangle(new Shapes.point(20, 20), new Shapes.point(100, 100));
re.on("click", function (e) {
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
let po1 = new Polygon( l3.getBoundingBox() );
po1.on("click",function(e){
  console.log(`po1:${e.type}:${e.offsetX},${e.offsetY}`);
}); 
zcl.add(po1);


zcl.start();

console.table(EventNames);
