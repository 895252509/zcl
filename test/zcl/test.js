class B{
  constructor(){

  }

  onb(){

  }
}

class A {
  f = 1;
  constructor(a, b){

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
  const a = new Function();
  const theConstructor = clas.prototype.constructor.toString();
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
  const create = decodeConstructor(theConstructor);
  
  const prePro = this.__proto__;
  Object.setPrototypeOf(this, clas.prototype);

  const propers = Object.getOwnPropertyNames(clas.prototype);
  for (const p of propers) {
    console.log(p);
    if( p === 'constructor' ) continue;
    const pp = Object.getOwnPropertyDescriptor(clas.prototype, p);
    Object.defineProperty(prePro, p, pp);
  }

  create.call(this,'s','asdasda');




  Object.setPrototypeOf(this, prePro);

}


const oc = new C();

oc.a = 1;
console.log(oc.a)