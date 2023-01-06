import {Enemy} from "./Enemy.js";



class Humanoid extends Enemy {
   constructor(world) {
      super(world);
      this.maxSpeed              = 2;
      this.MAX_HEALTH_POINTS     = 1;
      this.healthPoints          = this.MAX_HEALTH_POINTS;
      this.boundingRadius        = 0.5;
      this.boundingSphere        = new BoundingSphere();
      this.boundingSphere.radius = this.boundingRadius;
      this.stateMachineMovement  = new StateMachine(this);
      this.stateMachineCombat    = new StateMachine(this);
      this.audios                = new Map();
   }


   isPlayer() {
      return false;
   }


   setCombatPattern(pattern) {
      this.stateMachineCombat.currentState = pattern;
      this.stateMachineCombat.currentState.enter(this);
      return this;
   }


   setMovementPattern(pattern) {
      this.stateMachineMovement.currentState = pattern;
      this.stateMachineMovement.currentState.enter(this);
      return this;
   }


   update(delta) {
      this.stateMachineMovement.update(delta);
      this.stateMachineCombat.update(delta);
      this.boundingSphere.center.copy(this.position);
      this.world.updateEntity(this);
   }


   onCollision(other) {
      if (other.isPlayer()) {
         this.stateMachineCombat.currentState.onCollision(this, other);
      }
   }


   takeDamage(amount) {
      this.healthPoints -= amount;
      if (this.healthPoints <= 0) {
         this.world.removeEntity(this);
         this.world.game.onEnemyKilled(this);
      }
   }


   playAudio(name) {
      const audio = this.audios.get(name);
      if (audio !== undefined) {
         audio.play();
      }
   }
}
