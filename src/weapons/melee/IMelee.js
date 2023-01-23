import {Raycaster} from "three";
import {Weapon}    from "../Weapon.js";



class IMelee extends Weapon {
   /**
    * @description Interface for all melee weapons.
    * @param owner
    * @param mesh
    */
   constructor(owner, mesh) {
      super(owner);

      this.weapon      = mesh;
      this.damage      = 1;
      this.range       = 1;
      this.raycaster   = new Raycaster(undefined, undefined, 0, undefined);
      this.enemy       = null;
      this.isAttacking = false;

      this.engage    = () => {
         this.isAttacking = true;
         this.owner.stateMachine.setState("melee");
      }
      this.disengage = () => {
         this.isAttacking = false;
         this.owner.stateMachine.setState("idle");
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
