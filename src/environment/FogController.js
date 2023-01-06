class FogController {
   constructor(world, fog) {
      this._world = world;
      this.fog    = fog;
   }


   get near() {
      return this.fog.near;
   }


   set near(value) {
      this.fog.near = value;
   }


   get far() {
      return this.fog.far;
   }


   set far(value) {
      this.fog.far = value;
   }

}
