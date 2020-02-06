/**
 * 支持事件的对象
 * 
 * 1. 支持同一个事件绑定多个处理函数
 *    例：eventable.on("click",function(){});
 * 2. 支持绑定一次处理函数
 *    例：eventable.once("click",function(){});
 * 3. 支持绑定异步的事件
 *    例：eventable.on("click$asyn",function(){});
 * 4. 支持添加子节点对象，并且自动为子对象分发事件
 *    1. 虽然可以为子对象分发事件，但是子对象有权利拒绝执行事件处理函数，可以通过重写allowTrigger()
 * 来实现。
 *    2. 可以使用addChild添加子节点对象，父对象可以有多个不同的子对象，但是子对象只能有一个父对象，
 * 想要更换父对象需要先执行deleteChild()
 *    3. 子对象也必须是继承自eventable的。
 * 
 * comment:
 *  1. 关于 allowTrigger() 
 *    1. 父对象如果拒绝触发事件，事件就不会向他的子对象分发了。
 *    2. 因此是否向子对象传递事件取决于父对象的实现。T
 *      TODO:可以考虑添加控制是否阻断事件传递的功能，但是目前还不需要
 * 
 */
class Eventable {
  constructor() {

    // 存放注册的事件
    this.evt_handlers = [];

    this.iseventabled = true;

    /**
     * 子节点对象数组
     */
    this.childen = [];

    /**
     * 父对象
     * 
     * 只能有一个
     */
    this.parent = {};

    this._bindEvent();
  }

  /**
   * 添加子元素
   * @param {Eventable} child 
   * @returns {Eventable} this
   */
  addChild(child){
    if( child instanceof Eventable ){
      if( child.parent instanceof Eventable ){
        throw new Error(`${typeof child} 父元素已存在`);  
      } else{
        child.parent = this;
        this.childen.push(child);
        return this;
      }
    }else{
      throw new Error(`${typeof child} 不是Eventable的子类。`);
    }
  }

  /**
   * 删除子对象
   * @param {Eventable} child 
   * @returns {Eventable} this
   */
  deleteChild(child){
    let indexs = this.childen.findIndex((v)=>{
      if( v === child ) return true;
    });
    this.childen.shift(indexs[0],1);
    child.parent = null;
    return this;
  }

  /**
   * 添加事件响应函数
   * @param {EventNames} eventtype 
   * @param {Function} handler 
   * @returns {Eventable} this
   */
  on(eventtype, handler) {
    // if( !(eventtype in Eventtype) ) return ; 
    if (!this.evt_handlers[eventtype])
      this.evt_handlers[eventtype] = [];
    this.evt_handlers[eventtype].push({
      isOnce: false,
      handler: handler
    });
    return this;
  }

  /**
   * 触发绑定的事件
   * @param {EventNames} eventtype 
   * @param {Event} e 
   * @returns {Eventable} this
   */
  trigger(eventtype, e) {

    // 外部触发事件时，如果该对象阻止事件触发，则不触发事件
    if( !this.allowTrigger(eventtype, e) ) return;

    if (this.evt_handlers[eventtype] && this.evt_handlers[eventtype].length !== 0) {
      for (let i = 0, size = this.evt_handlers[eventtype].length; i < size; i++) {
        let hand = this.evt_handlers[eventtype][i];
        hand.handler.call(this, e);
        if (hand.isOnce) {
          this.evt_handlers[eventtype].shift(i, 1);
          size--;
          i--;
        }
      }
    }

    if (this.evt_handlers[`${eventtype}$asyn`] && this.evt_handlers[`${eventtype}$asyn`].length !== 0) {
      for (let i = 0, size = this.evt_handlers[`${eventtype}$asyn`].length; i < size; i++) {
        let hand = this.evt_handlers[`${eventtype}$asyn`][i];
        window.setTimeout(()=>{
          hand.handler.call(this, e);
        }, 0);
        if (hand.isOnce) {
          this.evt_handlers[`${eventtype}$asyn`].shift(i, 1);
          size--;
          i--;
        }
      }
    }

    // 在分发给子对象前对事件对象进行加工
    this.additionEvent(e);

    // dispatchEvent
    for( const child of this.childen ){
      child.trigger(eventtype, e);
    }

    return this;
  }

  /**
   * 绑定只响应一次的事件
   * @param {EventNames} eventtype 
   * @param {Function} handler 
   * @returns {Eventable} this
   */
  once(eventtype, handler) {
    // if( !(eventtype in Eventtype) ) return ; 
    this.evt_handlers[eventtype].push({
      isOnce: false,
      handler: handler
    });

    return this;
  }

  /**
   * 绑定对象自己的事件
   * @summary 只要是“on”开头的都会作为事件绑定
   * @private
   */
  _bindEvent() {
    let proto = this.__proto__;
    while( typeof proto !== 'undefined' && proto !== null){
      Object.getOwnPropertyNames(proto)
      .filter( v => v.startsWith('on') && v !== 'on' && v !== 'once' )
      .filter( v => typeof this[v] === 'function' )
      .map( v => {
        this.on(v.substring(2), this[v].bind(this));
      });
      proto = proto.__proto__;
    }
  }

  /**
   * 判断对象是否需要阻止事件触发
   * @interface
   * @param {EventNames} eventtype 
   * @param {Event} e 
   * @returns {Boolean}
   */
  allowTrigger(eventtype, e){
    return true;
  }

  /**
   * 对事件对象进行封装处理
   * @interface
   * @param {Event} e
   * @returns {Eventable} this
   */
  additionEvent(e){
    return this;
  }
}
