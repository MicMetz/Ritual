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
            let enemies = this.owner.world.enemies.children;
            for (let i = 0; i < enemies.length; i++) {
               let enemy = enemies[i];
               if (enemy.isAlive) {
                  let distance = this.raycaster.ray.distanceSqToPoint(enemy.position);
                  if (distance < this.range) {
                     enemy.takeDamage(this);
                  }
               }
            }
         }
      }
   }


   setDamage(damage) {
      this.damage = damage;
   }


   setRange(range) {
      this.range = range;
   }


   // collide(hitting) {
   //
   // }



}
