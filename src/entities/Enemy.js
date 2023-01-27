import {Color, Mesh, MeshBasicMaterial, Object3D, SphereGeometry} from "three";
import {BoundingSphere, Vehicle, StateMachine, Quaternion}        from 'yuka';



class Enemy extends Vehicle {
   /**
    * @description Enemy class template pattern
    * @param world
    * @param type
    */
   constructor(world, type) {
      super();

      this._type     = type;
      this._isPlayer = false;
      this._isAlive  = true;

      this._MAX_HEALTH_POINTS = 8;
      this._healthPoints      = this.MAX_HEALTH_POINTS;

      this.pathLines = new Object3D();
      this.pathColor = new Color(0xFFFFFF);
      if (world.pathfinder) {
         this.pathfinder   = world.pathfinder;
         this.ZONE         = world.ZONE;
         this.navMeshGroup = this.pathfinder.getGroup(this.ZONE, this.object.position);
      }

   }


   newPath(path) {
      const player = this.object;

      if (this.pathfinder === undefined) {
         this.calculatedPath = [path.clone()];
         this.setTargetDirection();
         return;
      }

      // Calculate a path to the target and store it
      this.calculatedPath = this.pathfinder.findPath(player.position, path, this.ZONE, this.navMeshGroup);

      if (this.calculatedPath && this.calculatedPath.length) {
         this.action = 'walk';

         this.setTargetDirection();

         if (this.world.debug.showPath && !this.isPlayer) {
            this.showPathLines();
         }
      } else {
         this.action = 'idle';
         if (this.pathLines) this.world.scene.remove(this.pathLines);
      }
   }


   get type() {
      return this._type;
   }


   get isPlayer() {
      return this._isPlayer;
   }


   get isAlive() {
      return this._isAlive;
   }


   set isAlive(bool) {
      this._isAlive = bool;
   }


   getMass() {
      return super.mass;
   }


   getSteering() {
      return super.steering;
   }


   takeDamage(from) {
      this._healthPoints -= from.damage;
      if (this._healthPoints <= 0) {
         this.isAlive(false);
      }
   }


   setTargetDirection() {
      const player = this.object;

      if (this.calculatedPath.length > 1) {
         const nextPoint = this.calculatedPath[1];
         player.lookAt(nextPoint.x, player.position.y, nextPoint.z);
      }
   }


   showPathLines() {
      const player = this.object;

      if (this.pathLines) this.world.scene.remove(this.pathLines);

      this.pathLines = new Object3D();

      for (let i = 0; i < this.calculatedPath.length; i++) {
         const point = this.calculatedPath[i];

         const geometry = new SphereGeometry(0.1, 8, 8);
         const material = new MeshBasicMaterial({color: this.pathColor});
         const mesh     = new Mesh(geometry, material);

         mesh.position.copy(point);

         this.pathLines.add(mesh);
      }

      this.world.scene.add(this.pathLines);
   }

}



export default Enemy;
