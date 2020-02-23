
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

    // this._initContainer(params);

    this.layerManager = new ZcLayers(params,{
      usemulitdom: this._layer_usemulitdom,
      layered: this._layered
    });
    this.addChild( this.layerManager );

    // 初始化操作
    this.init();
  }

  add(m) {
    if (!(m instanceof Displayable))
      return;

    this.layerManager.add(m);
  }

  init() {
    this.trigger( "beforeinit", this );

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

    this.layerManager.show();

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
   * 重置变换
   */
  resetTransform(){
    this.layerManager.resetTransform();
  }

  /**
   * @private
   * @returns {number} time
   */
  get _getTime(){
    return window.performance?window.performance.timing.navigationStart + window.performance.now():new Date() .getTime();
  }

}
