class B{

  constructor(a){

  }

  onb(){

  }
}

class A extends B{
  f = 1;
  constructor(a, b){
    super(a);

    this._a = this.f;
    this._a = a;
    this._a = this.n;
    console.log(b);

    this.ona();
    function A(){}
  }

  ona(){

  }

  h = 1;

  get a(){
    return this._a;
  }

  set a(a){
    this._a = a;
  }
}
let l = new  A();

class C{
  constructor(){
    this.use(A);

  }

  c(){

  }
}

Object.prototype.use = function (clas) {
  function findParam(c, i) {
    const i1 = c.indexOf('(', i);
    const i2 = c.indexOf(')', i);
    const param = c.substring(i1+1, i2);
    if( param.trim() === "" ) return null;
    return param.split(',').map( el => el.trim() );
  }
  function findCreate(c, i) {
    const c1 = c.indexOf('{', i);
    const cc = c.substring(c1+1);
    let itoken = 1;
    let end = 0;
    for( const v of cc ){
      if( v === '{' ) itoken++;
      if( v === '}' ) itoken--;
      if( itoken < 1 ) break;
      end ++;
    }
    return cc.substring(0,end);
  }
  function decodeConstructor(c){
    const cindex = c.indexOf('constructor');
    if( cindex < 0){

    }else{
      const param = findParam(c, cindex);
      const create = findCreate(c, cindex);
      let createF;
      if( param === null ){
        createF = new Function( create );
      }else{
        createF = new Function(...param, create );
      }
      return createF;
    }

  }
  function useClass(that, cla){
    const clsConstructor = cla.prototype.constructor.toString();
    const i1 = clsConstructor.indexOf("{");
    const s1 = clsConstructor.substring(0, i1);
    const i2 = s1.indexOf('extends');
    if( i2 >= 0 ){
      const extendsCls = s1.substring(i2+7).trim();
      const extendsClss = eval(extendsCls);
      if( typeof extendsClss === 'undefined'){
        throw new Error();
      }
      useClass(that, extendsClss);
    }
    const create = decodeConstructor(clsConstructor);

    const ss = clsConstructor.replace('\\','');
  
    const prePro = that.__proto__;
    Object.setPrototypeOf(that, cla.prototype);

    const propers = Object.getOwnPropertyNames(cla.prototype);
    for (const p of propers) {
      console.log(p);
      if( p === 'constructor' ) continue;
      const pp = Object.getOwnPropertyDescriptor(cla.prototype, p);
      Object.defineProperty(prePro, p, pp);
    }

    create.call(that,'s','asdasda');

    Object.setPrototypeOf(that, prePro);

  }

  useClass(this, clas);

  
}


const oc = new C();

oc.a = 1;
console.log(oc.a)