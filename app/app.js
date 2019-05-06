
let zcl = new Zcl("#can");
let re = new Rectangle( {_x:0,_y:0},{_x:20,_y:20} );
re.on( "click" , function (e){
  console.log(123);
})

re.on("mousemove", (e)=>{
  console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
});

zcl.add(re);
zcl.start();

console.table(EventNames);