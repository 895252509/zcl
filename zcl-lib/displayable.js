
class Displayable extends Eventable {
  constructor() {
    super();

    this.dragable = true;

    this._dragging = false;

    this._clicking = false;

    this.clickPoint = new Shapes.point();
  }

  onmousedown(e) {
    if (e.button === 0) { //left button
      this._clicking = true;
      // TODO
      this.clickPoint.value = new Shapes.point(e.offsetX, e.offsetY).sub(this._p1 || this._src._p1 || this._src._ps[0]);
    } else if (e.button === 1) { //middle button

    } else if (e.button === 2) { //right button

    }
  }

  onmousemove(e) {

    if (this._clicking && this.move) {
      //TODO
      this.move(new Shapes.point(e.offsetX, e.offsetY).sub(this.clickPoint.add(this._p1 || this._src._p1 || this._src._ps[0])));
      this._dragging = true;
    } else {
      this._dragging = false;
    }
  }

  onmouseup(e) {

    if (e.button === 0) { //left button
      this._clicking = false;
      this.clickPoint = new Shapes.point();
    } else if (e.button === 1) { //middle button

    } else if (e.button === 2) { //right button

    }
  }

  onmouseout(e){
    this.clicking = false;
    this.clickPoint = new Shapes.point();
  }

  //Interface
  draw() {

  }

  //Interface
  contain(p) {
    return false;
  }

  _allowTrigger(en, e){
    let cp = new Shapes.point(e.offsetX, e.offsetY);
    switch(en){
      default:
        return this.contain(cp);
    }
  }

  get clicking(){
    return this._clicking
  }

  set clicking(v){
    this._clicking = v;
  }
}

class Polygon extends Displayable {
  constructor(...ps) {
    super();

    if (ps.length == 1 && ps[0] instanceof Shapes.polygon) {
      this._src = ps[0];
    } else {
      this._src = new Shapes.polygon(ps);
    }
  }

  contain(p) {
    return this._src.contain(p);
  }

  move(p){
    this._src.add(p);
  }

  push(p) {
    this._src.push(p);
    return this;
  }

  draw(ctx) {
    let correct = 0.5;

    ctx.save();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.beginPath();
    if (this._src._ps.length == 0) {

    } else if (this._src._ps.length == 1) {
      ctx.moveTo(this._src._ps[0]._x - correct, this._src._ps[0]._y);
    } else {
      ctx.moveTo(this._src._ps[0]._x - correct, this._src._ps[0]._y);
      for (var i = 1; i < this._src._ps.length; i++) {
        ctx.lineTo(this._src._ps[i]._x - correct, this._src._ps[i]._y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

}


class Rectangle extends Displayable {
  constructor(p1 = new Shapes.point(), p2 = new Shapes.point()) {
    super();

    if( p1 instanceof Shapes.rectangle ){
      this._src = p1;
    }else{
      this._src = new Shapes.rectangle( p1, p2 );
    }

    this.figure;
    this.style;
  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.fillRect(
      this._src._p1._x,
      this._src._p1._y,
      this._src._p2._x,
      this._src._p2._y);

    ctx.restore();
  }

  contain(point) {
    //suport.cclPointInRect(point._x, point._y, this._p1._x, this._p1._y, this._p1._x + this._p2._x, this._p1._y + this._p2._y)
    return this._src.contain(point);
  }

  move(p) {
    this._src._p1.value = this._src._p1.add(p);
  }

}

class Circle extends Displayable {
  constructor(p1 = new Shapes.point(), r = 0) {
    super();
    if( p1 instanceof Shapes.circle ){
      this._src = p1;
    }else{
      this._src = new Shapes.circle(p1, r);
    }
    
  }

  draw(ctx) {
    ctx.save();

    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';

    ctx.beginPath();
    ctx.arc(this._src._p1._x, this._src._p1._y, this._src._r,
      0, Math.PI * 2, 1);

    ctx.stroke();

    ctx.restore();
  }

  contain(point) {
    return this._src.contain(point);
  }

  move(point) {
    this._src._p1.value = this._src._p1.add(point);
  }

}

class Line extends Displayable {
  constructor(p1 = new Shapes.point(), p2 = new Shapes.point()) {
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
    ctx.moveTo(this._p1._x - correct, this._p1._y);
    ctx.lineTo(this._p2._x - correct, this._p2._y);
    ctx.stroke();

    ctx.restore();

  }

  onsegment(p) {
    return suport.dcmp(this._p1.sub(p).cross(this._p2.sub(p))) == 0
      && suport.dcmp(this._p1.sub(p).dot(this._p2.sub(p))) <= 0;
  }

  contain(p) {
    /*
    return suport.dcmp(this._p1.sub(p).cross(this._p2.sub(p))) == 0
      && suport.dcmp(this._p1.sub(p).dot(this._p2.sub(p))) <= 0;
    */
    return this.getBoundingBox().contain(p);
  }

  move(p) {
    this._p1 = this._p1.add(p);
    this._p2 = this._p2.add(p);
  }

  getBoundingBox() {
    let x = 5;
    let slope = Math.abs(suport.cclSlope(this._p2._x, this._p2._y, this._p1._x, this._p1._y));
    if (slope >= 1 || slope == 0) {
      return new Shapes.polygon(
        new Shapes.point(this._p1._x + x, this._p1._y),
        new Shapes.point(this._p2._x + x, this._p2._y),
        new Shapes.point(this._p2._x - x, this._p2._y),
        new Shapes.point(this._p1._x - x, this._p1._y)
      );
    } else {
      return new Shapes.polygon(
        new Shapes.point(this._p1._x, this._p1._y + x),
        new Shapes.point(this._p2._x, this._p2._y + x),
        new Shapes.point(this._p2._x, this._p2._y - x),
        new Shapes.point(this._p1._x, this._p1._y - x)
      );
    }
  }

}