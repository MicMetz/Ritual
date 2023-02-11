class RoomManager {

   constructor( world, environment, size ) {

      this.world       = world;
      this.environment = environment;
      this.dimensions  = {}
      this.rooms       = new Map();



   }


   set dimensions( size ) {
      switch (size) {
         case 'normal': {
            this.dimensions.x = 35;
            this.dimensions.z = 35;
            break;
         }
         case 'small': {
            this.dimensions.x = 17.5;
            this.dimensions.z = 17.5;
            break;
         }
         case 'large': {
            this.dimensions.x = 70;
            this.dimensions.z = 70;
            break;
         }
         case 'huge': {
            this.dimensions.x = 140;
            this.dimensions.z = 140;
            break;
         }
         default: {
            this.dimensions.x = 35;
            this.dimensions.z = 35;
            break;
         }
      }
   }


   addRoom( room ) {

   }


   generate = ( position ) => {

   }

}
