import { GameEntity } from "yuka";



class Collectible extends GameEntity {

   constructor() {
      super();
      this.mesh = null;
   }


   spawn() {

   }


   handleMessage( telegram ) {

      const message = telegram.message;

      switch (message) {

         case 'PickedUp':

            this.spawn();
            return true;

         default:

            console.warn( 'Collectible: Unknown message.' );

      }

      return false;

   }


}



export { Collectible };
