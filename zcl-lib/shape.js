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

  /**
   * @param {{ _x: any; _y: any; }} p
   */
  set value (p){
    if( p instanceof Point ){
      this._x = p._x;
      this._y = p._y;
    }
  }

  sub(p){
    return new Point( this._x - p._x, this._y - p._y );
  }

  add(p){
    return new Point( this._x + p._x, this._y + p._y );
  }

  getDistance(p){
    return suport.getDistance( this._x, this._y, p._x, p._y ).toFixed(3);
  }

  set value(p){
    this._x = p._x;
    this._y = p._y;
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

    this.clickPoint = new Point();
  }

  onmousedown(e){
    if( e.button === 0 ){ //left button
      this.clicking = true;
      this.clickPoint.value = new Point(e.offsetX, e.offsetY).sub(this._p1);  
    }else if( e.button === 1 ){ //middle button

    }else if( e.button === 2 ){ //right button

    }
  }

  onmousemove(e){

    if( this.clicking ){
      this.move( new Point( e.offsetX, e.offsetY ).sub( this.clickPoint.add(this._p1) ) );
      this.dragging = true;
    }else{
      this.dragging = false;
    }
  }

  onmouseup(e){

    if( e.button === 0 ){ //left button
      this.clicking = false;
      this.clickPoint = new Point();
    }else if( e.button === 1 ){ //middle button

    }else if( e.button === 2 ){ //right button

    }
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

    this._p1 = new Point(p1);
    this._p2 = new Point(p2);

    this.figure;

    this.style;
  }

  draw(ctx){
    ctx.save();

    ctx.fillStyle='rgba(255, 0, 0, 0.8)';

    ctx.fillRect(
      this._p1._x,
      this._p1._y,
      this._p2._x,
      this._p2._y);
  
    ctx.restore();
  }

  isHover( point ){
    if( point._x >= this._p1._x &&
      point._x <= this._p1._x + this._p2._x &&
      point._y >= this._p1._y &&
      point._y <= this._p1._y + this._p2._y )
      return true;
    return false;
  }

  move( p ){
    this._p1.value = this._p1.add(p);
  }

}

class Circle extends Shape{
  constructor( p1 = new Point(), r = 0){
    super();

    this._p1 = p1;

    this._r = r;

  }

  draw(ctx){
    ctx.save();

    ctx.fillStyle='rgba(255, 0, 0, 0.8)';
    
    ctx.beginPath();
    ctx.arc( this._p1._x, this._p1._y, this._r, 
      0, Math.PI*2, 1);

    ctx.stroke();
  
    ctx.restore();
  }

  isHover( point ){
    if( Math.abs(this._p1.getDistance( point ) - this._r) <= 2.5 ) return true;
    return false;
  }

  move( p ){
    this._p1.value = this._p1.add(p);
  }

}
