
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
    this.cvs = this.candom.getContext('2d',{ alpha : true });

    // 创建model管理器
    this.models = new Zclm(this);
    super.addChild(this.models);

    this.layerManager = new ZcLayer(this.cvs, this.models);

    // 每次缩放的缩放比率
    this._scaleRate = 0.02;
    // 浏览器坐标到canvas坐标的变换
    this._transformTo = new Matrix32();

    // 鼠标点击画布
    this._isclick = false;

    // 上一次鼠标位置
    this._preoffsetX = 0;
    this._preoffsetY = 0;

    // 上一次鼠标位置
    this._preworldX = 0;
    this._preworldY = 0;

    this._layered = true;

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

    this._clearScreen("rgba(152, 223, 255, 1)");

    this.layerManager.show();

    // for (const m of this.models._models) {
    //   if ((m instanceof Displayable) && (m.draw)) {
    //     m.draw(this.cvs);
    //   }
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
      // 如果是鼠标移动事件，就计算距离量
      // if( typeof e.movementX === 'undefined' &&
      //   typeof e.movementY === 'undefined'){
      e._movedX = e.offsetX - this._preoffsetX;
      e._movedY = e.offsetY - this._preoffsetY;
      // }
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
    this.doTransform();
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
        this.doTransform();
      }
    }
    this._preoffsetX = e.offsetX;
    this._preoffsetY = e.offsetY;
    this._preworldX = e._worldX;
    this._preworldY = e._worldY;
  }

  /**
   * 鼠标左键按下事件
   * @param {Event} e 
   */
  onmouseleftdown(e){
    if( this.models._hover === null ){
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
    this._preworldX = 0;
    this._preworldY = 0;
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
  doTransform(){
    this.layerManager._transformTo = this._transformTo;
    this.layerManager.doTransform();
    // const m = this._transformTo;
    // this.pen.setTransform( m[0],0,0,m[3],m[4],m[5] );
  }

  /**
   * 重置变换
   */
  resetTransform(){
    this._transformTo.reset();
    this.doTransform();
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

    m.on('focus', function(e){
      if( !parent._focus ){
        parent._focus = m;
        m._isFocus = true;
      }
    })

    m.on('blur', function(e){
      parent._focus = null;
      m._isFocus = false;
    });
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
        this.parent.candom.style.cursor = "pointer";
        this._hover = m;
        is = true;
        return;
      }
    }
    this.parent.candom.style.cursor = "auto";
    this._hover = null;
  }

  lastedModel( m ){
    const moduls = this._models;
    const index = moduls.findIndex( v => v === m );
    if( index >= 0 && index < moduls.length - 1){
      this._models = moduls.filter( v => v !== m);
      this._models.push(m);
    }
  }
}

/**
 * 分层绘制管理器
 * 
 * 实现分层绘制，提高绘制效率等
 * 
 */
class ZcLayers extends Eventable{
  _cvs = null;
  _zm = null;
  constructor( cvs = null, zm = null ){
    super();

    // 原始的画布
    this._cvs = cvs;

    // 对象管理器
    this._zm = zm;

    // 层管理数组
    this._layers = [];

    // 变换矩阵
    this._transformTo = new Matrix32();

    this.createLayer();
  }

  show(){

    if( this._layers[0] === null ) this.createLayer();

    for (const m of this._zm._models) {
      if ((m instanceof Displayable) && (m.draw)) {
        m.draw(this._layers[0]);
      }
    }

    for (const lay of this._layers) {
      this._cvs.drawImage(lay.canvas, 0, 0);
    }
  }

  doTransform(){
    for (const lay of this._layers) {
      lay._transformTo = this._transformTo;
      lay.doTransform();
    }
  }

  /**
   * 基于原始画布创建一个相同大小的分层画布
   * 
   */
  createLayer(){
    const lay = new ZcLayer();
    lay.width = this.width;
    lay.height = this.height;
    this._layers.push(lay);
    return lay;
  }

  /**
   * 获取原始画布的高度
   * @getter
   * @returns {number} height
   */
  get height(){
    if( this._cvs !== null ){
      return this._cvs.canvas.offsetHeight;
    }
  }

  /**
   * 获取原始画布的宽度
   * @getter
   * @returns {number} widht
   */
  get width(){
    if( this._cvs !== null ){
      return this._cvs.canvas.offsetWidth;
    }
  }
}

class ZcLayer extends Eventable{
  constructor() {
    super();

    this._dom = document.createElement("canvas");

    this._ctx = null;

    this._transformTo = new Matrix32();
  }

  doTransform(){
    const m = this._transformTo;
    this._ctx.setTransform( m[0],0,0,m[3],m[4],m[5] );
  }

  clear(){
    // 计算应该清除的范围
    const size = new S.point(this.width, this.height);
    const pos = new S.point(0, 0);
    pos.dotMatrix(this._transformTo.invert());
    size.dotMatrix(this._transformTo.scaleM.invert());
    this._ctx.clearRect(
      pos._x,
      pos._y,
      size._x,
      size._y);
  }

  get ctx(){
    if( this._ctx === null ){
      this._ctx = this._dom.getContext('2d');
    }
    return this._ctx;
  }

  set height(x){
    this._dom.height = x;
  }

  set width(x){
    this._dom.width = x;
  }

  get height(){
    return this._dom.offsetHeight;
  }

  get width(){
    return this._dom.offsetWidth;
  }
}