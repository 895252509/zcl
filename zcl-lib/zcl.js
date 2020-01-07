
class Zcl extends Eventable {
  constructor(params) {
    super();

    this.timing = {
      //初始化开始的时间
      inittime : this._getTime,
      //第一帧开始的时间
      firstframetime : null,
      //当前秒数
      framesecond: Math.trunc(this._getTime / 1000),
      //帧开始的毫秒数
      framestartmillisecond : 0,
      //帧结束的毫秒数
      frameendmillisecond : 0,
      //帧经过的毫秒数
      framemillisecond : 0,
      //从当前秒起的帧数
      framenum : 0,
      //FPS
      fps : 0,
      //平均一帧消耗毫秒
      avemillisecond : 0
    }

    // 获取保存canvas的dom对象
    this.candom = document.querySelector(params);
    this.cvs = this.candom.getContext('2d');

    // 创建model管理器
    this.models = new Zclm(this);
    super.addChild(this.models);

    // 初始化操作
    this.init();
  }

  add(m) {
    if (!(m instanceof Displayable))
      return;

    this.models.add(m);

  }

  init() {

    this.trigger( "beforeinit", this );

    // 管理dom传递的事件
    this._dispatchEvent();

    this.trigger( "afterinit", this );
  }

  start() {

    this.timing.firstframetime =  this._getTime;
    this.timing.framestartmillisecond = this.timing.firstframetime;

    this.frame();

  }

  frame() {

    this.timing.framestartmillisecond = this._getTime;
    this.trigger("beforeframe", this);

    this._clearScreen("rgba(40, 120, 255, 1)");

    for (const m of this.models._models) {
      if ((m instanceof Displayable) && (m.draw)) {
        m.draw(this.cvs);
      }
    }
    
    this.trigger( "afterframe", this );

    const currframesecond = Math.trunc(this._getTime / 1000);
    if( currframesecond > this.timing.framesecond ){
      this.timing.frameendmillisecond = this._getTime;
      this.timing.framemillisecond = this.timing.frameendmillisecond - this.timing.framestartmillisecond;

      this.timing.fps = this.timing.framenum;
      this.timing.framesecond = currframesecond;
      this.timing.framenum = 0;
    }else {
      this.timing.frameendmillisecond = this._getTime;
      this.timing.framemillisecond = this.timing.frameendmillisecond - this.timing.framestartmillisecond;
    }

    this.timing.avemillisecond = (( this.timing.avemillisecond * this.timing.framenum + this.timing.framemillisecond ) / (this.timing.framenum===0?1:this.timing.framenum+1)).toFixed(3);
    this.timing.framenum ++;

    this.trigger( "timing", this );

    window.requestAnimationFrame(() => {
      this.frame();
    });
  }

  oncontextmenu(e){
    if(e.preventDefault){
      e.preventDefault();
    }else{
      window.event.returnValue == false;
    }
  }

  ondbclick(e){
    if(e.preventDefault){
      e.preventDefault();
    }else{
      window.event.returnValue == false;
    }
  }

  get _getTime(){
    return window.performance?window.performance.timing.navigationStart + window.performance.now():new Date() .getTime();
  }

  _clearScreen(color = 'rgba(47,79,79,1)') {
    var icvs = this.cvs;

    icvs.save();
    icvs.fillStyle = color;
    icvs.fillRect(
      0,
      0,
      this.candom.width,
      this.candom.height);

    icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";
    icvs.lineWidth = 0.8;
    icvs.setLineDash([6, 2, 6, 2]);
    icvs.lineDashOffset = 2;

    var pixSizeX = 25;
    var pixSizeY = 25;
    var numberX = this.candom.height / pixSizeX;
    var numberY = this.candom.width / pixSizeY;

    for (var i = 0; i < numberX; i++) {
      if (i % 4 == 0)
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";
      icvs.beginPath();
      icvs.moveTo(0 + 0.5, i * pixSizeX + 0.5);
      icvs.lineTo(this.candom.width + 0.5, i * pixSizeX + 0.5);
      icvs.stroke();
    }

    for (var i = 0; i < numberY; i++) {
      if (i % 4 == 0)
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.2)";

      icvs.beginPath();
      icvs.moveTo(i * pixSizeY + 0.5, 0);
      icvs.lineTo(i * pixSizeY + 0.5, this.candom.height + 0.5);
      icvs.stroke();
    }

    icvs.restore();
  }

  _dispatchEvent(){
    for (const eventname of EventNamesMouse) {
      this.candom.addEventListener(eventname, (e) => {
        this.trigger(eventname, e);
      });
    }

    for (const eventname of EventNamesKeywords) {
      window.addEventListener(eventname, (e) => {
        // TODO

      });
    }
  }
}

class Zclm extends Eventable {
  constructor(zcl) {
    super();

    this._models = [];

    this._zcl = zcl;

    this._dispatchEventToModel();

    this._makeEvent();
  }

  add(m) {

    if (!(m instanceof Displayable))
      return;
    
    this._models.push(m);
  }

  onclick(e) {

  }

  onmousemove(e){
    let cp = new Shapes.point(e.offsetX, e.offsetY);
    let is = false;
    for (const m of this._models) {
      if (m.contain && m.contain(cp)) {
        this.canvasDom.candom.style.cursor = "pointer";
        is = true;
      } else if (m.contain && !m.contain(cp) && (m instanceof Displayable)) {
        //m.clicking = false;
        //m.clickPoint = new Shapes.point();

        if (!is) this.canvasDom.candom.style.cursor = "auto";
        m.trigger('mouseout', e);
      }
    }
  }

  /**
   * 分发事件到各个模型对象
   * 
   * 给所有事件绑定事件处理函数，处理的方式是只要判断鼠标在该模型对象的坐标范围内，就触发对应的事件
   * 
   */
  _dispatchEventToModel(){
    for (const en of EventNamesMouse) {
      this.on(en, (e) => {
        let cp = new Shapes.point(e.offsetX, e.offsetY);
        for (const m of this._models) {
          if (m.contain && m.contain(cp)) {
            m.trigger(en, e);
          }
        }
      });
    }
  }

  _makeEvent() {
    if (en === "mousemove") {
      this.on(en, (e) => {

      });
    }
  }

  get canvasDom(){
    return this.zcl;
  }
}
