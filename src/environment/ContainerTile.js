import {TriggerRegion} from "yuka";



class ContainerTile extends TriggerRegion {

   constructor(mesh, objects = [], position, rotation) {
      super();
      this.mesh     = mesh;
      this.objects  = objects;
      this.position = position;
      this.rotation = rotation;
   }



}



export {ContainerTile};
