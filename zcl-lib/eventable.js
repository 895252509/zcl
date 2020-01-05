class Eventable {
  constructor() {

    // 存放注册的事件
    this.evt_handlers = [];

    this.iseventabled = true;

    // sub object
    this.childen = [];
    this.parent = {};

    this._bindEvent();
  }

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

  deleteChild(child){
    let indexs = this.childen.findIndex((v)=>{
      if( v === child ) return true;
    });
    this.childen.shift(indexs[0],1);
    child.parent = null;
    return this;
  }

  // 绑定事件函数
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

  //触发事件
  trigger(eventtype, e) {
    // if( !(eventtype in Eventtype) ) return ; 
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

    // dispatchEvent
    // for( const child of this.childen ){
    //   child.trigger(eventtype, e);
    // }

    return this;
  }

  once(eventtype, handler) {
    // if( !(eventtype in Eventtype) ) return ; 
    this.evt_handlers[eventtype].push({
      isOnce: false,
      handler: handler
    });

    return this;
  }

  _bindEvent() {
    for (const en of EventNamesMouse) {
      if (this[`on${en}`]) {
        this.on(en, this[`on${en}`].bind(this));
      }
    }
  }
}
