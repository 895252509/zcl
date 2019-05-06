
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
    this.cvs.save();
    this.cvs.fillStyle = color;
    this.cvs.fillRect( 
      0,
      0, 
      this.candom.width, 
      this.candom.height );
    
    this.cvs.restore(); 
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



























