
class Zcl extends BaseClass{
  constructor(params) {
    super();

    this.candom = document.querySelector(params);
    this.cvs = this.candom.getContext('2d');

    this.modules = new Zclm();

    this.init();
  }

  add( m ){
    if( !( m instanceof Shape ) )
      return ;

    this.modules.add(m);

  }

  init(){

    for (const eventname of EventNamesMouse) {
      this.candom.addEventListener(eventname, ( e ) => {
        // 当前类事件
        if( this[ `on${eventname}` ] ){
          this[ `on${eventname}` ].call(this, e);
        }
        // 事件分发到模型
        this.modules.trigger( eventname, e);
      });
    }

    for (const eventname of EventNamesKeywords) {
      window.addEventListener(eventname, ( e ) => {
        // TODO


      });
    }
  }

  onclick(e){

  }

  clearScreen( color= 'rgba(47,79,79,1)' ){
    var icvs = this.cvs;
    
    icvs.save();
    icvs.fillStyle = color;
    icvs.fillRect( 
      0,
      0, 
      this.candom.width,
      this.candom.height );

    icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";
    icvs.lineWidth = 0.8;
    icvs.setLineDash( [ 6, 2, 6, 2] );
    icvs.lineDashOffset = 2;

    var pixSizeX = 20;
    var pixSizeY = 20;
    var numberX = this.candom.height / pixSizeX;
    var numberY = this.candom.width / pixSizeY;

    for( var i = 0; i< numberX; i++ ){
      if( i % 3 == 0 )
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";
      icvs.beginPath();
      icvs.moveTo(0 + 0.5, i * pixSizeX + 0.5);
      icvs.lineTo(this.candom.width  + 0.5, i * pixSizeX  + 0.5);
      icvs.stroke();
    }

    for( var i = 0; i< numberY; i++ ){
      if( i % 3 == 0 )
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";

      icvs.beginPath();
      icvs.moveTo( i * pixSizeY + 0.5, 0);
      icvs.lineTo(i * pixSizeY + 0.5, this.candom.height  + 0.5);
      icvs.stroke();
    }

    icvs.restore(); 
  }

  start(){

    this.frame();
  
  }

  frame(){

    this.clearScreen("rgba(40, 120, 255, 1)");

    for (const m of this.modules._modules) {
      if( (m instanceof Shape)&&(m.draw) ){
        m.draw(this.cvs);
      }
    }

    window.requestAnimationFrame( () => {
      this.frame();
    });
  }

}

class Zclm extends BaseClass{
  constructor(){
    super();

    this._modules = [];

    this._makeEvent();
  }

  add( m ){

    if( !( m instanceof Shape ) )
      return ;

    this._modules.push(m);

  }

  onclick( e ){
    // console.log(`${e.type}:${e.offsetX},${e.offsetY}`);
  }

  _makeEvent(){
    for (const en of EventNamesMouse) {
      this.on( en, (e) =>{
        let cp = new Point( e.offsetX, e.offsetY );
        for (const m of this._modules) {
          if( m.isHover && m.isHover( cp )){
            m.trigger( en , e);
          }
        }
      });
    }

  }



}



























