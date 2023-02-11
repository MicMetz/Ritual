/**
 * @author MicMetzger /
 */


import { Fog } from "three";
import { Vector3 } from "yuka";



class FogController {
   constructor( world ) {
      this.world      = world;
      this.playerFog  = null;
      this.boundryFog = null;

      this.startPlayerFog();
      this.startBoundryFog();
   }


   setColor( color, type ) {
      switch (type) {
         case 'player':
            this.playerFog.color.set( color );
            break;
         case 'boundry':
            this.boundryFog.color.set( color );
            break;
      }
   }


   setNear( near, type ) {
      switch (type) {
         case 'player':
            this.playerFog.near = near;
            this.playerFog.far  = Math.max( this.playerFog.far, near );
            break;
         case 'boundry':
            this.boundryFog.near = near;
            this.boundryFog.far  = Math.max( this.boundryFog.far, near );
            break;
      }
   }


   setFar( far, type ) {
      switch (type) {
         case 'player':
            this.playerFog.far  = far;
            this.playerFog.near = Math.min( this.playerFog.near, far );
            break;
         case 'boundry':
            this.boundryFog.far  = far;
            this.boundryFog.near = Math.min( this.boundryFog.near, far );
            break;
      }
   }


   startPlayerFog() {

      const near = this.world.player.position;
      const far  = this.world.player.radius;

      this.playerFog = new Fog( 'add8e6', near, 2 );
      console.log( this.playerFog );
      this.world.scene.fog = this.playerFog;

      // world.playerMesh.fog(this.playerFog);

   }


   startBoundryFog() {

      const vector = this.world.field;

      const near = 1;
      const far  = 20;

      this.boundryFog = new Fog( 'add8e6', near, far );
      // world.scene.background('add8e6');
      // world.scene.fog(this.boundryFog);

   }


}



export { FogController };
