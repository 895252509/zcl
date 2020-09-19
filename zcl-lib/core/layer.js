
/**
 * 分层绘制管理器
 * 
 * 实现分层绘制，提高绘制效率等
 * 
 */
class ZcLayers extends ZclNode{
  constructor( str, { 
    usemulitdom,
    layered
   } ){
    super();

    this._usermulitdom = usemulitdom;
    this._layered = layered;

    // 原始的画布
    this._cvs = null; // zcl.cvs;

    // 层管理数组
    this._layers = new Map();

    // 每次缩放的缩放比率
    this._scaleRate = 0.02;
    // 浏览器坐标到canvas坐标的变换
    this._transformTo = new Matrix32();

    // 鼠标点击画布
    this._isclick = false;

    // 上一次鼠标位置
    this._preoffsetX = 0;
    this._preoffsetY = 0;

    this._layersNo = 0;

    this._init(str);
  }

  /**
   * 把一个对象添加到层里，应该根据对象的属性，动态的
   * 添加到不同的层，从而降低重绘的次数提高性能
   * @param {Displayable} m 
   */
  add(m){
    if(! m instanceof Displayable ) return;
    this._layers.get('main').addChild(m);
  }

  onshow(e){
    this._ctx.clearRect(0, 0, this.width, this.width);
  }

  /**
   * 基于原始画布创建一个相同大小的分层画布
   * 创建一个画布，并且添加到子对象
   * 
   */
  _createLayer(zindex, name){
    const lname = name || this.layersNo.toString();
    if( this._layers.has( lname ) ) throw new Error( "layer name 重复" );

    // 创建一个层对象，设置宽高
    const lay = new ZcLayer(zindex, name);
    // 添加到事件子对象，接收事件
    this.addChild(lay);
    // 添加到map方便以名字获取
    this._layers.set(lname, lay);
    // 设置宽高
    lay.width = this.width;
    lay.height = this.height;

    // 设置新建层的zindex，限定其不能大于1000，因为1000在最上面用来接收dom事件
    let zIndex;
    if( typeof zindex === 'undefined' ){
      zIndex = 0.0;
    }else{
      zIndex = zindex;
    }
    if( zIndex >= 1000 ) zIndex = 999;
    lay.zIndex = zIndex;
    // 根据zindex进行排序
    this.sortAszIndex();
    
    const laydom = lay.dom;
    // 如果使用dom分层的话，就把该层dom添加到container中
    if( this._usermulitdom || this.container.children.length === 0){
      laydom.style.position = "absolute";
      laydom.style.padding = '0';
      laydom.style.margin = '0';
      this.container.appendChild(laydom);
    }
    // 如果不使用dom分层，那么就暂时添加到body里，开发的时候用的
    else{
      document.body.appendChild(laydom);
    }

    return lay;
  }

  /**
   * 创建一层
   * @param {number} zindex 
   * @param {string} name
   */
  create(zindex, name){
    if( !this._layered ) return null;
    const lay = this._createLayer(zindex, name);
    lay._useCreated = true;
    return lay;
  }

  /**
   * 鼠标移动事件
   * @param {Event} e 
   */
  onmousemove(e){
    // 判断是否划过对象，并设置鼠标样式
    let cp = new Shapes.point(e._worldX, e._worldY);
    for (const lay of this.children) {
      for (const m of lay.children) {
        if( m.contain(cp) ){
          this._cvs.style.cursor = "pointer";
          this._hover = m;
          return;
        }
      }
    }
    this._cvs.style.cursor = "auto";
    this._hover = null;

    // 拖动画布操作处理
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
   * 初始化dom
   * @param {string} domid 
   */
  _init(dom){
    if( typeof dom !== 'string' && !(dom instanceof HTMLElement)){
      throw new Error('init error');
    }
    const tdom = dom instanceof HTMLElement? dom : document.querySelector(dom);
    if( tdom.nodeName.toUpperCase() === 'CANVAS' ){
      this.container = tdom.parentNode;
      this._cvs = tdom;
      this._ctx = this._cvs.getContext('2d');
      // 如果给定的dom是一个canvas，那么就不使用分层dom。
      this._layer_usemulitdom = false;
    }else{
      // 如果给定的dom不是一个canvas，通常是一个div容器，那么就创建一个画布dom添加进去
      this.container = tdom;
      const firstLayer = this._createLayer(0,"main");
      // 把这个画布放在最上面，用来接收dom消息
      firstLayer.zIndex = 1000;
      firstLayer.width = tdom.clientWidth;
      firstLayer.height = tdom.clientHeight;
      this._cvs = firstLayer.dom;
      this._ctx = firstLayer.ctx;
    }

    this._dispatchEvent();
  }

  /**
   * 分发dom事件
   */
  _dispatchEvent(){
    for (const eventname of EventNamesMouse) {
      this._cvs.addEventListener(eventname, (e) => {
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
   * 重置变换
   */
  resetTransform(){
    this._transformTo.reset();
    this.trigger("transform", this._transformTo);
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
   * 鼠标左键按下事件
   * @param {Event} e 
   */
  onmouseleftdown(e){
    if( this._hover === null ){
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
   * 把变换矩阵应用到画布
   */
  ontransform(e){
    const m = e;
    this._ctx.setTransform( m[0],0,0,m[3],m[4],m[5] );
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
   * 在这里给事件对象添加了一些属性
   * @param {string} eventtype
   * @param {Event} e 
   * @returns {boolean} true
   */
  allowTrigger(eventtype, e){
    // 如果是鼠标事件
    if( e instanceof MouseEvent ){
      // 变换鼠标坐标到画布世界坐标
      let p = new S.point(e.offsetX, e.offsetY);
      p.dotMatrix(this._transformTo.invert());
      // 添加转换后的坐标属性
      e._worldX = p._x;
      e._worldY = p._y;
      // 添加鼠标相对于上次移动的距离（浏览器坐标）
      e._movedX = e.offsetX - this._preoffsetX;
      e._movedY = e.offsetY - this._preoffsetY;
    }
    if( typeof e.data === 'undefined' ) e.data = {};
    e.data.ctx = this._ctx;
    e.data.usemulitdom = this._usermulitdom;
    e.data.layered = this._layered;
    return true;
  }

  /**
   * 对事件子对象进行排序，控制事件触发的顺序
   * @param {function} func 
   */
  sort(func){
    this.children.sort( func )
  }

  /**
   * 按zIndex倒序
   */
  sortAszIndex(){
    this.sort( (v1 , v2) => v2.zIndex - v1.zIndex );
  }

  /**
   * 获得一个自增的层id
   * @getter
   */
  get layersNo(){
    return ++this._layersNo;
  }

  /**
   * 获取原始画布的高度
   * @getter
   * @returns {number} height
   */
  get height(){
    if( this._cvs !== null ){
      return this._cvs.height;
    }
  }

  /**
   * 获取原始画布的宽度
   * @getter
   * @returns {number} widht
   */
  get width(){
    if( this._cvs !== null ){
      return this._cvs.width;
    }
  }

}

class ZcLayer extends ZclNode{
  constructor( zindex, name ) {
    super();

    this.name = name;

    this._dom = document.createElement("canvas");

    this._ctx = null;

    this._transformTo = new Matrix32();

    this._zindex = zindex || 0.0;

    this._needupdate = true;

    this._useCreated = false;
  }

  update(){

  }

  onshow(e){
    const ctx = e.data.ctx;
    if( !this._needupdate ) return;
    this._needupdate = false;
    this.clear();
    this._needupdate = true;
    if( this.children.length === 0 ) return;
    for (const m of this.children) {
      m[Displayable.CTX] = this._ctx;
      m.trigger('draw', e);
    }
    if( !e.data.usemulitdom && ctx !== this.ctx){
      ctx.drawImage(this.dom, 0, 0);
    }
  }

  ontransform(e){
    const m = e;
    this._transformTo = e;
    this.ctx.setTransform( m[0],0,0,m[3],m[4],m[5] );
    this._needupdate = true;
  }

  clear(){
    // 计算应该清除的范围
    const size = new S.point(this.width, this.height);
    const pos = new S.point(0, 0);
    pos.dotMatrix(this._transformTo.invert());
    size.dotMatrix(this._transformTo.scaleM.invert());
    this.ctx.clearRect(
      pos._x,
      pos._y,
      size._x,
      size._y);
  }

  get dom(){
    return this._dom;
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
    return this._dom.height;
  }

  get width(){
    return this._dom.width;
  }

  get zIndex(){
    return this._dom.style.zIndex;
  }

  set zIndex(x){
    this._dom.style.zIndex = x;
  }
}