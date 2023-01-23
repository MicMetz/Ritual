import {Raycaster} from "three";
import {Weapon}    from "../Weapon.js";



class IRanged extends Weapon {
   /**
    * @description Interface for all ranged weapons.
    * @param owner
    * @param mesh
    */
   constructor(owner, mesh) {
      super(owner, mesh);

      this.weapon    = mesh;
      this.damage    = 1;
      this.range     = 1;
      this.raycaster = new Raycaster(undefined, undefined, 0, undefined);
      this.enemy     = null;

      this.engage    = () => {
         this.isAttacking = true;
         this.owner.stateMachine.setState("shoot");
      }
      this.disengage = () => {
         this.isAttacking = false;
         if (this.owner.stateMachine) {
            if (this.owner.stateMachine.states.has("shootIdle")) {
               this.owner.stateMachine.setState("shootIdle");
            } else {
               this.owner.stateMachine.setState("idle");
            }
         }
      }
      this.attack    = () => {
         if (this.isAttacking) {
            this.raycaster.set(this.owner.position, this.owner.direction);
            this.enemy = this.raycaster.intersectObjects(this.owner.world.enemies.children, true);
            if (this.enemy.length > 0) {
               this.enemy[0].object.parent.takeDamage(this);
            }
         }
      }
   }


   collide(hitting) {

   }


}
