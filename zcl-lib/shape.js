class Point {
  constructor(x = 0, y = 0) {
    if (x instanceof Point) {
      this._x = x._x;
      this._y = x._y;

      return;
    }

    this._x = x;
    this._y = y;
  }

  /**
   * @param {{ _x: any; _y: any; }} p
   */
  set value(p) {
    if (p instanceof Point) {
      this._x = p._x;
      this._y = p._y;
    }
  }

  sub(p) {
    return new Point(this._x - p._x, this._y - p._y);
  }

  add(p) {
    return new Point(this._x + p._x, this._y + p._y);
  }

  dot(p){
    return (this._x * p._x + this._y * p._y).toFixed(3);
  }

  cross(p){
    return (this._x * p._y - p._x * this._y).toFixed(3); 
  }

  getDistance(p) {
    return suport.getDistance(this._x, this._y, p._x, p._y).toFixed(3);
  }

  set value(p) {
    this._x = p._x;
    this._y = p._y;
  }
}

class Size {
  constructor(w = 0, h = 0) {
    this._w = w;
    this._h = h;
  }
}

class Shape extends BaseClass {
  constructor() {
    super();

    this.dragable = true;

    this.dragging = false;

    this.clicking = false;

    this.clickPoint = new Point();
  }

  onmousedown(e) {
    if (e.button === 0) { //left button
      this.clicking = true;
      this.clickPoint.value = new Point(e.offsetX, e.offsetY).sub(this._p1);
    } else if (e.button === 1) { //middle button

    } else if (e.button === 2) { //right button

    }
  }

  onmousemove(e) {

    if (this.clicking) {
      this.move(new Point(e.offsetX, e.offsetY).sub(this.clickPoint.add(this._p1)));
      this.dragging = true;
    } else {
      this.dragging = false;
    }
  }

  onmouseup(e) {

    if (e.button === 0) { //left button
      this.clicking = false;
      this.clickPoint = new Point();
    } else if (e.button === 1) { //middle button

    } else if (e.button === 2) { //right button

    }
  }

  //Interface
  draw() {


  }

  //Interface
  contain() {



  }
}

class Quadrilateral extends Shape{
  constructor(
    p1 = new Point(),
    p2 = new Point(),
    p3 = new Point(),
    p4 = new Point() ){
    super();
    
    this._p1 = p1;
    this._p2 = p2;
    this._p3 = p3;
    this._p4 = p4;
  }

  contain(p){


    return false;
  }

  draw(ctx){
    let correct = 0.5;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.setLineDash([4, 2]);

    ctx.beginPath();
    ctx.moveTo(this._p1._x - correct, this._p1._y );
    ctx.lineTo(this._p2._x - correct, this._p2._y );
    ctx.lineTo(this._p3._x - correct, this._p3._y );
    ctx.lineTo(this._p4._x - correct, this._p4._y );
    ctx.closePath();

    ctx.stroke();

    ctx.restore();
  }

}

class Rectangle extends Shape {
  constructor(p1 = new Point(), p2 = new Point()) {
    super();

    this._p1 = new Point(p1);
    this._p2 = new Point(p2);

    this.figure;

    this.style;
  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.fillRect(
      this._p1._x,
      this._p1._y,
      this._p2._x,
      this._p2._y);

    ctx.restore();
  }

  contain(point) {
    return suport.cclPointInRect(point._x, point._y, this._p1._x, this._p1._y, this._p1._x + this._p2._x, this._p1._y + this._p2._y);
  }

  move(p) {
    this._p1.value = this._p1.add(p);
  }

}

class Circle extends Shape {
  constructor(p1 = new Point(), r = 0) {
    super();

    this._p1 = p1;

    this._r = r;

  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.beginPath();
    ctx.arc(this._p1._x, this._p1._y, this._r,
      0, Math.PI * 2, 1);

    ctx.stroke();

    ctx.restore();
  }

  contain(point) {
    if (Math.abs(this._p1.getDistance(point) - this._r) <= 2.5) return true;
    return false;
  }

  move(p) {
    this._p1.value = this._p1.add(p);
  }

}

class Line extends Shape {
  constructor(p1 = new Point(), p2 = new Point()) {
    super();

    //直线起点
    this._p1 = p1;
    //直线终点
    this._p2 = p2;


  }

  draw(ctx) {
    let correct = 0.5;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.beginPath();
    ctx.moveTo(this._p1._x - correct, this._p1._y );
    ctx.lineTo(this._p2._x - correct, this._p2._y );
    ctx.stroke();

    ctx.restore();

  }

  onsegment(p){
    return suport.dcmp(this._p1.sub(p).cross(this._p2.sub(p))) == 0 
      && suport.dcmp(this._p1.sub(p).dot(this._p2.sub(p))) <= 0;
  }

  contain(p) {
    return suport.dcmp(this._p1.sub(p).cross(this._p2.sub(p))) == 0 
      && suport.dcmp(this._p1.sub(p).dot(this._p2.sub(p))) <= 0;
  }

  move(p) {

  }

  getBoundingBox(){
    let x = 5;
    let slope = Math.abs(suport.cclSlope( this._p2._x,this._p2._y,this._p1._x,this._p1._y ));
    if( slope >= 1 || slope == 0){
      return new Quadrilateral( 
        new Point( this._p1._x + x, this._p1._y ),
        new Point( this._p2._x + x, this._p2._y ),
        new Point( this._p2._x - x, this._p2._y ),
        new Point( this._p1._x - x, this._p1._y )
        );
    }else{
      return new Quadrilateral( 
        new Point( this._p1._x, this._p1._y + x),
        new Point( this._p2._x, this._p2._y + x),
        new Point( this._p2._x, this._p2._y - x),
        new Point( this._p1._x, this._p1._y - x)
       );
    }
  }

}