

class suport{

  //关于获取随机数
  static getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  static getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }

  static getRandomColor(){
    return `rgba(${this.getRandomIntInclusive(0,255)},${this.getRandomIntInclusive(0,255)},${this.getRandomIntInclusive(0,255)},1)`;
  }

  //关于计算两点之间的距离
  static getDistance(x1, y1, x2, y2){
    return Math.sqrt( ( x1-x2 )*( x1-x2 ) + ( y1-y2 )*( y1-y2 ) );
  }
}
