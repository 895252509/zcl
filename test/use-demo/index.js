/**
 * 实现多重继承
 */
'use strict'

Object.prototype.use = function(cls, ...param) {

  // TODO 判断当前对象是不是一个函数

  // 判断参数是不是一个函数
  if (!(cls instanceof Function)) throw new Error("Type Error");

  // 获取要继承的类的方法和属性
  const descs = Object.getOwnPropertyDescriptors(cls.prototype);

  // 将方法和属性移植到当前函数
  for (const desc in descs) {
    // 剔除构造函数等
    if (["constructor"].includes(desc)) continue;

    if (descs.hasOwnProperty(desc)) {
      const element = descs[desc];
      Object.defineProperty(this.prototype, desc, element);
    }
  }

  // 调用函数，如果是一个类的话就没办法调用了
  if (!cls.prototype.constructor) cls.call(this.prototype, param);

  return this;
}

function Eventable() {
  this.handle = [];
}
Eventable.prototype = {
  on() {},
  emit() {}
}

function Displayable() {

}
Displayable.use(Eventable);
let a = new Displayable();

class A {
  on() {}
  get a() {

  }
}

class B {

  constructor() {
    console.log(1);
  }

}
B.use(A);

let b = new B();