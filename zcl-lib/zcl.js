
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

    // 是否启用分层
    this._layered = true;
    // 通过为每一层分别创建画布dom，设置绝对定位重叠来实现分层
    this._layer_usemulitdom = true;

    this._initContainer(params);

    // 创建model管理器
    // this.models = new Zclm(this);
    // super.addChild(this.models);

    //if( this._layered ){
    this.layerManager = new ZcLayers(this,{
      usemulitdom: this._layer_usemulitdom
    });
    this.addChild( this.layerManager );
   //}

    // 每次缩放的缩放比率
    this._scaleRate = 0.02;
    // 浏览器坐标到canvas坐标的变换
    this._transformTo = new Matrix32();

    // 鼠标点击画布
    this._isclick = false;

    // 上一次鼠标位置
    this._preoffsetX = 0;
    this._preoffsetY = 0;

    // 初始化操作
    this.init();
  }

  add(m) {
    if (!(m instanceof Displayable))
      return;

    // this.models.add(m);
    this.layerManager.add(m);
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

    //if( this._layered ){
    this.layerManager.show();
    //}else{
      // this._clearScreen("rgba(40, 120, 255, 1)");
      // for (const m of this.models._models) {
      //   if ((m instanceof Displayable) && (m.draw)) {
      //     m.draw(this.cvs);
      //   }
      // }
   // }

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

  /**
   * 处理事件对象
   * 1. 给事件对象添加转换到画布坐标的鼠标活动坐标
   * @override
   * @param {Event} e
   * @returns {Zcl} this 
   */
  additionEvent(e){
    // 如果是鼠标事件
    if( e instanceof MouseEvent ){
      let p = new S.point(e.offsetX, e.offsetY);
      p.dotMatrix(this._transformTo.invert());
      e._worldX = p._x;
      e._worldY = p._y;
      e._movedX = e.offsetX - this._preoffsetX;
      e._movedY = e.offsetY - this._preoffsetY;
    }
    return this;
  }

  /**
   * 鼠标滚轮滚动事件
   * @param {Event} e 
   */
  onwheel(e){
    // 实现滑动滚轮缩放画面
    const wheeld =  e.wheelDelta || e.deltaY;
    const scale = wheeld < 0? 1-this._scaleRate : 1+this._scaleRate;

    // 先计算浏览器坐标到画布坐标的变换矩阵
    this._transformTo.scale(scale, scale);
    // 缩放全局画布
    this.trigger("transform", this._transformTo);
  }

  /**
   * 鼠标移动事件
   * @param {Event} e 
   */
  onmousemove(e){
    this.additionEvent(e);

    if( this._isclick ){
      const p = new S.point(e._movedX, e._movedY);
      if( p._x !== 0 || p._y !== 0 ){
        this._transformTo.translate(p._x, p._y);
        this.trigger("transform", this._transformTo);
      }
    }
    this._preoffsetX = e.offsetX;
    this._preoffsetY = e.offsetY;
  }

  /**
   * 鼠标左键按下事件
   * @param {Event} e 
   */
  onmouseleftdown(e){
    if( this.layerManager._hover === null ){
      this._isclick = true;
    }
  }

  /**
   * 鼠标左键按下事件
   * @param {Event} e 
   */
  onmouseleftup(e){
    this._isclick = false;
  }

  /**
   * 鼠标划出画布事件
   * @param {Event} e 
   */
  onmouseout(e){
    this._preoffsetX = 0;
    this._preoffsetY = 0;
    this._isclick = false;
  }

  /**
   * 阻止右键菜单
   * @param {MouseEvent} e 
   */
  oncontextmenu(e){
    if(e.preventDefault){
      e.preventDefault();
    }else{
      window.event.returnValue == false;
    }
  }

  /**
   * 防止双击时选中文字
   * @param {MouseEvent} e 
   */
  ondbclick(e){
    if(e.preventDefault){
      e.preventDefault();
    }else{
      window.event.returnValue == false;
    }
  }

  /**
   * @private
   * @returns {number} time
   */
  get _getTime(){
    return window.performance?window.performance.timing.navigationStart + window.performance.now():new Date() .getTime();
  }

  /**
   * 把变换矩阵应用到画布
   */
  ontransform(e){
    const m = e;
    this.cvs.setTransform( m[0],0,0,m[3],m[4],m[5] );
  }

  /**
   * 重置变换
   */
  resetTransform(){
    this._transformTo.reset();
    this.trigger("transform", this._transformTo);
  }

  /**
   * 临时函数-画一个背景图
   * @param {string} color 
   */
  _clearScreen(color = 'rgba(40, 120, 255, 1)') {
    var icvs = this.cvs;

    icvs.save();
    icvs.fillStyle = color;

    // 计算应该清除的范围
    const size = new S.point(this.candom.width, this.candom.height);
    const pos = new S.point(0, 0);
    pos.dotMatrix(this._transformTo.invert());
    size.dotMatrix(this._transformTo.scaleM.invert());
    icvs.fillRect(
      pos._x,
      pos._y,
      size._x,
      size._y);
      
    icvs.strokeStyle = "rgba(255, 255, 255, 1)";
    icvs.lineWidth = 0.8;
    icvs.setLineDash([6, 2, 6, 2]);
    icvs.lineDashOffset = 2;

    var pixSizeX = 25;
    var pixSizeY = 25;
    var numberX = this.candom.height / pixSizeX;
    var numberY = this.candom.width / pixSizeY;

    for (var i = 0; i <= numberX; i++) {
      if (i % 4 == 0)
        icvs.strokeStyle = "rgba(255, 255, 255, 0.9)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
      icvs.beginPath();
      icvs.moveTo(0 + 0.5, i * pixSizeX + 0.5);
      icvs.lineTo(this.candom.width + 0.5, i * pixSizeX + 0.5);
      icvs.stroke();
    }

    for (var i = 0; i <= numberY; i++) {
      if (i % 4 == 0)
        icvs.strokeStyle = "rgba(255, 255, 255, 0.6)";
      else
        icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";

      icvs.beginPath();
      icvs.moveTo(i * pixSizeY + 0.5, 0);
      icvs.lineTo(i * pixSizeY + 0.5, this.candom.height + 0.5);
      icvs.stroke();
    }

    icvs.restore();
  }

  /**
   * 分发dom事件
   */
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

  /**
   * 初始化画布容器
   * @param {string/HTMLElement} dom 
   */
  _initContainer( dom ){
    if( typeof dom !== 'string' && !(dom instanceof HTMLElement)){
      throw new Error('init error');
    }
    const tdom = dom instanceof HTMLElement? dom : document.querySelector(dom);
    if( tdom.nodeName.toUpperCase() === 'CANVAS' ){
      this.container = tdom.parentNode;
      this.candom = tdom;
      this.cvs = this.candom.getContext('2d',{ alpha : true });
      // 如果给定的dom是一个canvas，那么就不使用分层dom。
      this._layer_usemulitdom = false;
    }else{
      // 如果给定的dom不是一个canvas，通常是一个div容器，那么就创建一个画布dom添加进去
      this.container = tdom;
      this.candom = document.createElement("canvas");
      this.container.appendChild(this.candom);
      this.candom.width = tdom.clientWidth;
      this.candom.height = tdom.clientHeight;
      // 把这个画布放在最上面，用来接收dom消息
      this.candom.style.zIndex = 1000;
      this.cvs = this.candom.getContext('2d',{ alpha : true });
      this.container.style.position = 'relative';
      this.candom.style.position = 'absolute';
      this.candom.style.top = '0';
      this.candom.style.left = '0';
      this.candom.style.padding = '0';
      this.candom.style.margin = '0';
    }
  }

  /**
   * 重新定义事件，分别处理鼠标按下事件
   * @param {Event} e 
   */
  onmousedown(e){
    if( e.button === 0 ){
      this.trigger('mouseleftdown', e);
    }else if( e.button === 1 ){
      this.trigger('mousemiddledown', e);
    }else if( e.button === 2 ){
      this.trigger('mouserightdown', e);
    }
  }

  /**
   * 重新定义事件，分别处理鼠标抬起事件
   * @param {Event} e 
   */
  onmouseup(e){
    if( e.button === 0 ){
      this.trigger('mouseleftup', e);
    }else if( e.button === 1 ){
      this.trigger('mousemiddleup', e);
    }else if( e.button === 2 ){
      this.trigger('mouserightup', e);
    }
  }

  /**
   * @returns {HTMLCanvasElement}
   */
  get getCanvas(){
    return this.candom;
  }

  /**
   * @returns {OffscreenCanvasRenderingContext2D}
   */
  get pen(){
    return this.cvs;
  }
}



/**
 * 对象管理类
 * 
 */
class Zclm extends Eventable {
  constructor(zcl) {
    super();

    this._models = [];

    this._zcl = zcl;

    this._focus = null;

    this._hover = null;
  }

  add(m) {

    if (!(m instanceof Displayable))
      return;

    this.addChild(m);
    
    this._models.push(m);

    const parent = this;

    // m.on('focus', function(e){
    //   if( !parent._focus ){
    //     parent._focus = m;
    //     m._isFocus = true;
    //   }
    // })

    // m.on('blur', function(e){
    //   parent._focus = null;
    //   m._isFocus = false;
    // });
  }

  /**
   * 响应鼠标移动事件
   *  
   * 1. 设置给模型对象设置鼠标划过效果
   * ~2. 判断鼠标划过状态，触发鼠标离开事件
   * 
   */
  onmousemove(e){
    let cp = new Shapes.point(e._worldX, e._worldY);
    let is = false;
    for (const m of this._models) {
      if (m.contain && m.contain(cp)) {
        //this.parent.candom.style.cursor = "pointer";
        this._zcl.candom.style.cursor = "pointer";
        this._hover = m;
        is = true;
        return;
      }
    }
    //this.parent.candom.style.cursor = "auto";
    this._zcl.candom.style.cursor = "auto";
    this._hover = null;
  }

  // lastedModel( m ){
  //   const moduls = this._models;
  //   const index = moduls.findIndex( v => v === m );
  //   if( index >= 0 && index < moduls.length - 1){
  //     this._models = moduls.filter( v => v !== m);
  //     this._models.push(m);
  //   }
  // }
}

