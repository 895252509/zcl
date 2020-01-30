const matrixmeta = typeof Float32Array === 'undefined'? Array : Float32Array;

/**
 * 
 * 3*2矩阵
 */
class Matrix32 extends Array{
  constructor(){
    super();
    this[0] = 1;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    this[4] = 0;
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
 * 平移变换
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
}