
let zcl = new Zcl("#can");
let re = new Rectangle( {_x: 20, _y: 20},{_x: 100,_y: 100} );
re.on( "click" , function (e){
  console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
})

re.on("mousemove", (e)=>{
  
});

zcl.add(re);
zcl.start();

console.table(EventNames);