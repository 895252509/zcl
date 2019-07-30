class Eventable {
  constructor() {
    // 存放注册的事件
    this.evt_handlers = [];

    this.iseventabled = true;

    this._bindEvent();
  }

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
