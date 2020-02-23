
/**
 * 分层绘制管理器
 * 
 * 实现分层绘制，提高绘制效率等
 * 
 */
class ZcLayers extends Eventable{
  constructor( zcl, { 
    usemulitdom
   } ){
    super();

    this._usermulitdom = usemulitdom || true;

    // zcl
    this.zcl = zcl;

    // 原始的画布
    this._cvs = zcl.cvs;

    // 层管理数组
    this._layers = [];

    // 变换矩阵
    this._transformTo = new Matrix32();

    this._createLayer();

    this._background = this.create(-1);

    this._background.draw = function(color = 'rgba(40, 120, 255, 1)'){
      var icvs = this.ctx;

      icvs.save();
      icvs.fillStyle = color;

      // 计算应该清除的范围
      const size = new S.point(this.width, this.height);
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
      var numberX = this.height / pixSizeX;
      var numberY = this.width / pixSizeY;

      for (var i = 0; i <= numberX; i++) {
        if (i % 4 == 0)
          icvs.strokeStyle = "rgba(255, 255, 255, 0.9)";
        else
          icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";
        icvs.beginPath();
        icvs.moveTo(0 + 0.5, i * pixSizeX + 0.5);
        icvs.lineTo(this.width + 0.5, i * pixSizeX + 0.5);
        icvs.stroke();
      }

      for (var i = 0; i <= numberY; i++) {
        if (i % 4 == 0)
          icvs.strokeStyle = "rgba(255, 255, 255, 0.6)";
        else
          icvs.strokeStyle = "rgba(255, 255, 255, 0.4)";

        icvs.beginPath();
        icvs.moveTo(i * pixSizeY + 0.5, 0);
        icvs.lineTo(i * pixSizeY + 0.5, this.height + 0.5);
        icvs.stroke();
      }

      icvs.restore();
    }

  }

  add(m){
    if(! m instanceof Displayable ) return;
    this._layers[1].addChild(m);
  }

  show(){
    this._cvs.clearRect(0, 0, this.width, this.width);

    for (const lay of this._layers) {
      lay.show();
      if( !this._usermulitdom ){
        this._cvs.drawImage(lay.dom, 0, 0);
      }
    }
  }

  /**
   * 基于原始画布创建一个相同大小的分层画布
   * 
   */
  _createLayer(zindex){
    // 创建一个层对象，设置宽高
    const lay = new ZcLayer(zindex);
    this.addChild(lay);

    lay.width = this.width;
    lay.height = this.height;

    const laydom = lay.dom;

    // 设置新建层的zindex，限定其不能大于1000，因为1000在最上面用来接收dom事件
    let zIndex;
    if( typeof zindex === 'undefined' ){
      zIndex = 0.0;
    }else{
      zIndex = zindex;
    }
    if( zIndex >= 1000 ) zIndex = 999;
    laydom.style.zIndex = zIndex;

    // 在添加到数组的时候就排好顺序。
    const ll = this._layers.length;
    for (let index = 0; index < ll; index++) {
      const el = this._layers[index];
      if( zindex < el._zindex ){
        this._layers.splice(index, 0, lay);
        break;
      }
    }
    if( this._layers.length === ll ){
      this._layers.push(lay);
    }

    // 如果使用dom分层的话，就把该层dom添加到container中
    if( this._usermulitdom ){
      laydom.style.position = "absolute";
      laydom.style.top = '0';
      laydom.style.left = '0';
      laydom.style.padding = '0';
      laydom.style.margin = '0';
      this.zcl.container.appendChild(laydom);
    }else{
      document.body.appendChild(laydom);
    }

    return lay;
  }

  create(zindex){
    const lay = this._createLayer(zindex);
    lay._useCreated = true;
    return lay;
  }

  onmousemove(e){
    let cp = new Shapes.point(e._worldX, e._worldY);
    for (const lay of this.childen) {
      for (const m of lay.childen) {
        if( m.contain(cp) ){
          this.zcl.candom.style.cursor = "pointer";
          this._hover = m;
          return;
        }
      }
    }
    this.zcl.candom.style.cursor = "auto";
    this._hover = null;
  }

  /**
   * 获取原始画布的高度
   * @getter
   * @returns {number} height
   */
  get height(){
    if( this._cvs !== null ){
      return this._cvs.canvas.height;
    }
  }

  /**
   * 获取原始画布的宽度
   * @getter
   * @returns {number} widht
   */
  get width(){
    if( this._cvs !== null ){
      return this._cvs.canvas.width;
    }
  }

}

class ZcLayer extends Eventable{
  constructor( zindex ) {
    super();

    this._dom = document.createElement("canvas");

    this._ctx = null;

    this._transformTo = new Matrix32();

    this._zindex = zindex || 0.0;

    this._needupdate = true;

    this._useCreated = false;
  }

  update(){

  }

  show(){
    if( !this._needupdate ) return;
    this._needupdate = false;

    this.clear();
    if( this.draw ) this.draw.call(this);
    
    if( this._useCreated ) return;
    this._needupdate = true;

    for (const m of this.childen) {
      if ((m instanceof Displayable) && (m.draw)) {
        m.draw(this.ctx);
      }
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
}