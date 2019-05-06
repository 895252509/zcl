class Point{
  constructor( x= 0, y= 0 ){
    if( x instanceof Point ){
      this._x = x._x;
      this._y = x._y;

      return ;
    }

    this._x = x;
    this._y = y;
  }
}

class Size{
  constructor( w= 0, h= 0){
    this._w = w;
    this._h = h;
  }
}

class Shape extends BaseClass{
  constructor(){
    super();

    this.dragable = true;

    this.dragging = false;

    this.clicking = false;

  }

  onmousedown(e){
    this.clicking = true;
  }

  onmousemove(e){

    if( this.clicking ){
      this.move( new Point( e.x, e.y ) );
      this.dragging = true;
    }else{
      this.dragging = false;
    }
  }

  onmouseup(e){
    this.clicking = false;
  }

  //Interface
  draw(){


  }

  //Interface
  isHover(){



  }
}


class Rectangle extends Shape{
  constructor(p1= new Point(), p2= new Point()){
    super();

    this._p1 = p1;
    this._p2 = p2;

    this.figure;

    this.style;
  }

  draw(ctx){
    ctx.save();

    ctx.fillStyle='rgb(255,0,0)';

    ctx.fillRect(
      this._p1._x,
      this._p1._y,
      this._p2._x,
      this._p2._y);
  
    ctx.restore();
  }

  isHover( point ){
    if( point._x >= this._p1._x &&
      point._x <= this._p2._x &&
      point._y >= this._p1._y &&
      point._y <= this._p2._y )
      return true;
    return false;
  }

}
