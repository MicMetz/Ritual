// const mapType = {
//    [EMPTY]    : createFloor,
//    [HARD_WALL]: createHardWall,
//    [SOFT_WALL]: createSoftWall
// };

const mapCache = {};



class MapManager {
   /**
    *
    * @param {World} world
    *
    * @param map
    */
   constructor( world, map = null ) {
      this._world      = world;
      this._map        = map ? map : null;
      this._miniMap    = document.getElementById( "minimap" ).getContext( "2d" );
      this._visible    = true;
      this._fullScreen = false;


      this.connect();
      this.generatePlacemark();
      this.generateEnvironment();
   }


   set Full( bool ) {
      this._fullScreen = bool;
      if ( this._fullScreen ) {
         this.fullScreen();
      } else {
         this.minimize();
      }
   }


   update() {
      this._miniMap.clearRect( 0, 0, this._miniMap.width, this._miniMap.height );
      this.generatePlacemark();
   }


   generatePlacemark() {

      this._miniMap.fillStyle = "#fff700";
      this._miniMap.save();

      this._miniMap.beginPath();
      this._miniMap.fill();

      this._miniMap.closePath();
      this._miniMap.restore();

   }


   generateEnvironment() {

   }


   connect() {
      document.addEventListener( 'keydown', this.toggle );
   }


   disconnect() {
      document.removeEventListener( 'keydown', this.toggle );
   }


   toggle( event ) {
      switch (event.keyCode) {
         case 77: // m
            this.Full = !this._fullScreen;
            break;
      }
   }


   fullScreen() {

   }


   minimize() {

   }


   hide() {

   }


   show() {

   }


   getPercentDiscovered() {

   }



}



export default MapManager;
