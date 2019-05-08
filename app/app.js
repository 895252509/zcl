
let zcl = new Zcl("#can");
let re = new Rectangle( new Point( 20, 20),new Point(100, 100) );
re.on( "click" , function (e){
  console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

re.on("mousemove", (e)=>{
  
});

let c = new Circle( new Point( 100, 300 ), 100 );
c.on( "click", (e) => {
  console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

zcl.add(re);
zcl.add(c);

zcl.start();

console.table(EventNames);