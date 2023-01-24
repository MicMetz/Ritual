/**
 * @author MicMetzger /
 */

import {LoopOnce}           from "three";
import {INFINITY}           from "three/nodes";
import PlayerState          from "./PlayerState.js";
import {PlayerStateMachine} from "./PlayerStateMachine.js";



export class PlayerProxy extends PlayerStateMachine {
   /**
    * @description A finite state machine design pattern for the player character animation states.
    * @param proxy
    */
   constructor(proxy) {
      super()

      this._proxy = proxy

      this.addState('idle', IdleState);
      this.addState('interact', InteractState);
      this.addState('walk', WalkState);
      this.addState('run', RunState);
      this.addState('runBack', RunBackState);
      this.addState('runLeft', RunLeftState);
      this.addState('runRight', RunRightState);
      this.addState('roll', RollState);
      this.addState('stun', StunState);
      this.addState('die', DeathState);
      this.addState('shoot', ShootAttackState);
      this.addState('melee', MeleeAttackState);
      this.addState('meleeIdle', MeleeIdleState);
      this.addState('shootIdle', ShootIdleState);
      this.addState('respawn', RespawnState);

   }
}



class IdleState extends PlayerState {
   /**
    * @description Idle state for the player.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'idle';
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('idle').action;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }


   cleanup() {}


   exit() {}

}



class InteractState extends PlayerState {
   /**
    * @description InteractState is a state that is entered when the player interacts with a pickup.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'interact';
   }


   enter(prevState) {
      const action = this._parent._proxy.animations.get('interact').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('interact').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   update() {}


   exit() {
      this.cleanup();
   }

}



class DeathState extends PlayerState {
   /**
    * @description DeadState is a state that is entered when the player dies.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'die';
   }


   enter(prevState) {
      const action = this._parent._proxy.animations.get('dead').action;
      action.setLoop(INFINITY, 1.0);

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   update() {
      if (this._parent._proxy.health <= 0) {
         this._parent.isDead = true;
      }
      if (this._parent._proxy.health > 0) {
         this._parent.isDead = false;
         this._parent.changeTo('idle');
      }
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('dead').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   exit() {
      this.cleanup();
   }

}



class RespawnState extends PlayerState {
   /**
    * @description RespawnState is a state that is entered if the player respawns after dying.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'respawn';
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('respawn').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {

      const action = this._parent._proxy.animations.get('respawn').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);

   }


   update() {}


   exit() {
      this.cleanup();
   }

}



class WalkState extends PlayerState {
   /**
    * @description WalkState is a state that is entered when the player is walking.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {

      return 'walk'

   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('walk').action;

      if (prevState) {

         const previousAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.enabled = true;

         if (prevState.Name === 'run') {

            const ratio = action.getClip().duration / previousAction.getClip().duration;
            action.time = previousAction.time * ratio;

         } else {

            action.time = 0.0;

            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);

         }

         action.crossFadeFrom(previousAction, 0.5, true);
         action.play();

      } else {

         action.play();

      }
   }


   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }


   exit() {
      this.cleanup();
   }


};



class RunState extends PlayerState {
   /**
    * @description RunState is a state that is entered when the player is running forward.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'run'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('run').action;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.enabled = true;

         if (prevState.Name === 'walk' || prevState.Name.includes('run')) {
            const ratio = action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
         } else {
            action.time = 0.0;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
         }

         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }



   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }



   exit() {}

}



class RunLeftState extends PlayerState {
   /**
    * @description RunLeftState is a state that is entered when the player is running left.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'runLeft'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('runLeft').action;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.enabled = true;

         if (prevState.Name === 'walk' || prevState.Name.includes('run')) {
            const ratio = action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
         } else {
            action.time = 0.0;
            // action.setDuration(1.0);
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
         }

         // action.fadeIn(0.1);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }

   }



   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }



   exit() {}

}



class RunRightState extends PlayerState {
   /**
    * @description RunRightState is a state that is entered when the player is running right.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'runRight';
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('runRight').action;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.enabled = true;

         if (prevState.Name === 'walk' || prevState.Name.includes('run')) {
            const ratio = action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
         } else {
            action.time = 0.0;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
         }

         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }



   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }


   exit() {}

}



class RunBackState extends PlayerState {
   /**
    * @description RunBackState is a state that is entered when the player is running backwards.
    * @param parent
    */
   constructor(parent) {
      super(parent);
   }


   get Name() {
      return 'runBack'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('runBack').action;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.enabled = true;

         if (prevState.Name === 'walk' || prevState.Name.includes('run')) {
            const ratio = action.getClip().duration / prevAction.getClip().duration;
            action.time = prevAction.time * ratio;
         } else {
            action.time = 0.0;
            action.setEffectiveTimeScale(1.0);
            action.setEffectiveWeight(1.0);
         }

         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }



   update(_, input) {

      if (!input.forward && !input.backward && !input.left && !input.right && !input.space) {
         this._parent.changeTo('idle');
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this._parent.changeTo('walk');
         return;
      } else {
         if (!input.shift) {
            if (input.forward) {
               this._parent.changeTo('run');
               return;
            }

            if (input.right) {
               this._parent.changeTo('runRight');
               return;
            }

            if (input.left) {
               this._parent.changeTo('runLeft');
               return;
            }

            if (input.backward) {
               this._parent.changeTo('runBack');
               return;
            }

         }
      }

   }


   exit() {}

}



class ShootAttackState extends PlayerState {
   /**
    * @description ShootAttackState is a state that is entered when the player is shooting.
    * @param parent
    */
   constructor(parent) {
      super(parent);

      this.finishedCallback = () => {
         this.finished();
      }

   }


   get Name() {
      return 'shoot'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('shoot').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;

      if (prevState) {

         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();

      } else {

         action.play();

      }

   }


   finished() {

      this.cleanup();
      this._parent.changeTo('idle');

   }


   cleanup() {

      const action = this._parent._proxy.animations.get('shoot').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);

   }


   update() {}


   exit() {

      this.cleanup();

   }

}



class ShootIdleState extends PlayerState {
   /**
    * @description ShootIdleState is a state that is entered when the player is shooting and idle.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'shootIdle'
   }


   enter(prevState) {
      const action = this._parent._proxy.animations.get('idleGunPoint').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;
      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('idleGunPoint').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   update() {}


   exit() {
      this.cleanup();
   }

}



class MeleeAttackState extends PlayerState {
   /**
    * @description MeleeAttackState is a state that is entered when the player is melee attacking.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }

   }


   get Name() {

      return 'melee';

   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('melee').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {

      this.cleanup();
      this._parent.changeTo('idle');

   }


   cleanup() {

      const action = this._parent._proxy.animations.get('melee').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);

   }


   update() {}


   exit() {

      this.cleanup();

   }

}



class MeleeIdleState extends PlayerState {
   /**
    * @description MeleeIdleState is a state that is entered when the player is ending a melee attack.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'meleeIdle'
   }


   enter(prevState) {
      const action = this._parent._proxy.animations.get('idleMelee').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;
      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('idleMelee').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   update() {}


   exit() {
      this.cleanup();
   }

}



class HitState extends PlayerState {
   /**
    * @description HitState is a state that is entered when the player is hit.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'hitTaken';
   }


   enter(prevState) {
      const action = this._parent._proxy.animations.get('hitTaken').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;
      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('hitTaken').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   update() {}


   exit() {
      this.cleanup();
   }

}



class RollState extends PlayerState {
   /**
    * @description RollState is a state that is entered when the player is rolling.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {
      return 'roll'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('roll').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);
      action.loop = LoopOnce;

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;

         action.time    = 0.0;
         action.enabled = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();

      } else {

         action.play();

      }
   }


   finished() {

      this.cleanup();
      this._parent.changeTo('idle');

   }


   cleanup() {

      const action = this._parent._proxy.animations.get('roll').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);

   }


   update() {}


   exit() {

      this.cleanup();

   }

}



class StunState extends PlayerState {
   /**
    * @description StunState is a state that is entered when the player is stunned.
    * @param parent
    */
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }

   }


   get Name() {
      return 'stun'
   }


   enter(prevState) {

      const action = this._parent._proxy.animations.get('stun').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);

      if (prevState) {
         const prevAction = this._parent._proxy.animations.get(prevState.Name).action;
         action.time      = 0.0;
         action.enabled   = true;
         action.setEffectiveTimeScale(1.0);
         action.setEffectiveWeight(1.0);
         action.crossFadeFrom(prevAction, 0.5, true);
         action.play();
      } else {
         action.play();
      }
   }


   finished() {
      this.cleanup();
      this._parent.changeTo('idle');
   }


   cleanup() {

      const action = this._parent._proxy.animations.get('stun').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);

   }


   update() {}


   exit() {
      this.cleanup();
   }

}





