/**
 * 
 * 3*2矩阵
 */
class Matrix32 extends Array{
  constructor(){
    super();
    // 水平缩放
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    // 垂直缩放
    this[3] = 1;
    // 水平移动
    this[4] = 0;
    // 垂直移动
    this[5] = 0;
  }

  /**
   * 矩阵相乘
   * @param {Matrix32} m 
   * @returns {Matrix32} this
   */
  mul(m){
    this[0] = this[0] * m[0] + this[2] * m[1];
    this[1] = this[1] * m[0] + this[3] * m[1];
    this[2] = this[0] * m[2] + this[2] * m[3];
    this[3] = this[1] * m[2] + this[3] * m[3];
    this[4] = this[0] * m[4] + this[2] * m[5] + this[4];
    this[5] = this[1] * m[4] + this[3] * m[5] + this[5];
    return this;
  }

/**
 * 平移
 * @param {number} x 
 * @param {number} y
 * @returns {Matrix32} this 
 */
  translate(x, y){
    this[4] += x;
    this[5] += y;
    return this;
  }

  /**
   * 缩放
   * @param {number} x 
   * @param {number} y
   * @returns {Matrix32} this 
   */
  scale(x, y){
    this[0] *= x;
    this[1] *= y;
    this[2] *= x;
    this[3] *= y;
    this[4] *= x;
    this[5] *= y;
    return this;
  }

  /**
   * 旋转
   * @param {number} rad 弧度值（Math.PI*n）
   * @returns {Matrix32} this 
   */
  rotate(rad){
    let sin = Math.sin(rad);
    let cos = Math.cos(rad);
    let a = this[0];
    let b = this[1];
    let c = this[2];
    let d = this[3];
    let e = this[4];
    let f = this[5];
    this[0] = a * cos + b * sin;
    this[1] = -a * sin + b * cos;
    this[2] = c * cos + d * sin;
    this[3] = -c * sin + cos * d;
    this[4] = cos * e + sin * f;
    this[5] = cos * f - sin * e;
    return this;
  }

  /**
   * 求逆矩阵
   * @returns {Matrix32} newObj
   */
  invert(){
    let a = this[0];
    let b = this[1];
    let c = this[2];
    let d = this[3];
    let e = this[4];
    let f = this[5];
    let det = a * d - b * c;
    if( !det ) return null;
    det = 1.0 / det;
    let ret = new Matrix32();
    ret[0] =  d * det;
    ret[1] = -b * det;
    ret[2] = -c * det;
    ret[3] =  a * det;
    ret[4] = ( c * f - d * e ) * det;
    ret[5] = ( b * e - a * f ) * det;

    return ret;
  }

  /**
   * 重置矩阵
   * @returns {Matrix32} this
   */
  reset(){
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    this[4] = 0;
    this[5] = 0;
    return this;
  }

  /**
   * 重置平移
   * @returns {Matrix32} this
   */
  resetTranslate(){
    this[4] = 0;
    this[5] = 0;
    return this;
  }

  get translateM(){
    let m = new Matrix32();
    m[0] = 1;
    m[1] = 0;
    m[2] = 0;
    m[3] = 1;
    m[4] = this[4];
    m[5] = this[5];
    return m;
  }

  get scaleM(){
    let m = new Matrix32();
    m[0] = this[0];
    m[1] = 0;
    m[2] = 0;
    m[3] = this[3];
    m[4] = 0;
    m[5] = 0;
    return m;
  }

  get translateX(){
    return this[4];
  }
  
  get translateY(){
    return this[5];
  }

  get scaleX(){
    return this[0];
  }

  get scaleY(){
    return this[3];
  }

  get copy(){
    const copy = new Matrix32();
    copy[0] = this[0];
    copy[1] = this[1];
    copy[2] = this[2];
    copy[3] = this[3];
    copy[4] = this[4];
    copy[5] = this[5];
    return copy;
  }

  log(){
    console.log(`${this[0]},\t${this[1]},\t${this[4]},\n${this[3]},\t${this[2]},\t${this[5]}`);
  }
}