import {AnimationMixer}               from "three";
import {BoundingSphere, StateMachine} from "yuka";
import {ZOMBIETYPE} from "../../etc/Utilities.js";
import Enemy        from "../Enemy.js";



class Zombie extends Enemy {
   /**
    * Zombie Enemy type.
    * @param world
    * @param type
    */
   constructor(world, type = ZOMBIETYPE.NORMAL) {
      super(type);

      this.world      = world;
      this.bodyMesh   = world.assetManager.enemyModels.get(type).clone();
      this.zombieType = type;

      // Animations
      this.animations           = new AnimationMixer(this.bodyMesh);
      this.stateMachineMovement = new StateMachine(this);
      this.stateMachineCombat   = new StateMachine(this);

      this.boundingRadius = 0.5;

      this.MAX_HEALTH_POINTS = 8;
      this.healthPoints      = this.MAX_HEALTH_POINTS;

      this.boundingSphere        = new BoundingSphere();
      this.boundingSphere.radius = this.boundingRadius;

      this.audios = new Map();

      this.protectionMesh = null;
      this.protected      = false;

      this.hitMesh = null;
      this.hitted  = false;

      this.hitEffectDuration    = 0.25;
      this.hitEffectMinDuration = 0.15;
      this._hideHitEffectTime   = -Infinity;

   }


   enableProtection() {
      this.protected              = true;
      this.protectionMesh.visible = true;
   }


   disableProtection() {
      this.protected              = false;
      this.protectionMesh.visible = false;
   }


   enableHitEffect() {
      this.hitted          = true;
      this.hitMesh.visible = true;
   }


   disableHitEffect() {
      this.hitted          = false;
      this.hitMesh.visible = false;
   }


   updateHitEffect(timelapsed) {
      if (this.hitted && this._hideHitEffectTime < this.world.time) {
         this.disableHitEffect();
      }
   }


   update(timelapsed) {
      super.update(timelapsed);
      this.animations.update(timelapsed);
      this.stateMachineMovement.update();
      this.stateMachineCombat.update();
      this.updateHitEffect(timelapsed);
   }


}



export {Zombie};
