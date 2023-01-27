import {Group}    from "three";
import * as THREE from 'three';




class TileGenerator extends Group {
   constructor(params) {
      super();
      this.init(params);
   }


   init(params) {
      this.params = params;
      this.loadTiles();
   }


   initComponent() {
      // Register handles
   }


   loadTiles() {


   }

};

export default TileGenerator;
