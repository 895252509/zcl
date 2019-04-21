class Zcl{
  constructor(params) {
    this.candom = document.querySelector(params);
    this.cvs = this.candom.getContext('2d');

    this.init();
  }

  init(){

    for (const eventname of EventNamesMouse) {
      this.candom.addEventListener(eventname, ( e ) => {
        // TODO


      });
    }

    for (const eventname of EventNamesKeywords) {
      window.addEventListener(eventname, ( e ) => {
        // TODO


      });
    }


  }

  clearScreen( color= 'rgba(47,79,79,1)' ){
    this.cvs.save();
    this.cvs.fillStyle = color;
    this.cvs.fillRect( 
      0,
      0, 
      this.candom.width, 
      this.candom.height );
    
    this.cvs.restore(); 
  }

  start(){

    this.frame();
  
  }

  frame(){

    this.clearScreen("rgba(40, 120, 255, 1)");



    window.requestAnimationFrame( () => {
      this.frame();
    });
  }

}