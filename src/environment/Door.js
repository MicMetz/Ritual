import {GameEntity, TriggerRegion} from "yuka";



class Door extends GameEntity {

   constructor(world) {
      super();
      this.world   = world;
      this.mesh    = null;
      this.trigger = new TriggerRegion();
   }


   trigger() {

   }

}
