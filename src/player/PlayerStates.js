/**
 * @author MicMetzger /
 */

import {LoopOnce}         from "three";
import PlayerState        from "./PlayerState.js";
import PlayerStateMachine from "./PlayerStateMachine.js";



export class PlayerProxy extends PlayerStateMachine {
   constructor(proxy) {
      super()

      this.proxy = proxy

      this.addState('idle', IdleState);
      this.addState('walk', WalkState);
      this.addState('run', RunState);
      this.addState('runBack', RunBackState);
      this.addState('runLeft', RunLeftState);
      this.addState('runRight', RunRightState);
      this.addState('roll', RollState);
      this.addState('stun', StunState);
      this.addState('die', DeathState);
      this.addState('shootAttack', ShootAttackState);
      this.addState('meleeAttack', MeleeAttackState);

   }
}



class IdleState extends PlayerState {
   constructor(parent) {
      super(parent);
      this._action = null;
   }


   get name() {
      return 'idle';
   }


   enter(prevState) {

      this._action = this.parent.proxy.animations.get('idle').action;

      if (prevState) {

         const prevAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.time    = 0.0;
         this._action.enabled = true;

         this._action.setEffectiveTimeScale(1.0);
         this._action.setEffectiveWeight(1.0);

         this._action.crossFadeFrom(prevAction, 0.25, true);

         this._action.play();

      } else {

         this._action.play();

      }
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }


   cleanup() {}


   exit() {}

}



class RespawnState extends PlayerState {
   constructor(parent) {
      super(parent);



   }


   get name() {
      return 'respawn';
   }


   enter(prevState) {

      this._action = this.parent.proxy.animations.get('respawn').action;

      if (prevState) {

         const prevAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.time    = 0.0;
         this._action.enabled = true;

         this._action.setEffectiveTimeScale(1.0);
         this._action.setEffectiveWeight(1.0);

         this._action.crossFadeFrom(prevAction, 0.25, true);

         this._action.play();

      } else {

         this._action.play();

      }
   }


   update(_) {

      return;

   }


   exit() {
      this.cleanup();
   }

}



class DeathState extends PlayerState {
   constructor(parent) {
      super(parent);



      this._FinishedCallback = () => {
         this.finished();
      }
   }


   get name() {

      return 'die';

   }


   Enter(prevState) {
      this._action = this.parent.proxy.animations.get('die').action;

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();

         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();

      } else {

         this._action.play();

      }
   }


   finished() {
      this.cleanup();
      this.parent.changeTo('idle');
   }


   cleanup() {
      this._action.getMixer().removeEventListener('finished', this._FinishedCallback);
   }


   update(_) {

      return;

   }


   exit() {
      this.cleanup();
   }

};



class WalkState extends PlayerState {
   constructor(parent) {
      super(parent);



   }


   get name() {

      return 'walk'

   }


   enter(prevState) {

      this._action = this.parent.proxy.animations.get('walk').action;

      if (prevState) {

         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.enabled = true;

         if (prevState.name === 'run') {

            const ratio       = this._action.getClip().duration / previousAction.getClip().duration;
            this._action.time = previousAction.time * ratio;

         } else {

            this._action.time = 0.0;

            this._action.setEffectiveTimeScale(1.0);
            this._action.setEffectiveWeight(1.0);

         }

         this._action.crossFadeFrom(previousAction, 0.1, true);
         this._action.play();

      } else {

         this._action.play();

      }
   }


   cleanup() {

      //

   }


   exit() {
      this.cleanup();
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }


};



class RunState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'run'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('run').action;
      this._action.setEffectiveTimeScale(2.0);

      this._action.enabled = true;
      this._action.play();
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }



   cleanup() {
      if (this._action) {

         //

      }
   }


   exit() {
      this.cleanup();
   }

}



class RunLeftState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runLeft'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('runLeft').action;


      this._action.enabled = true;
      this._action.play();
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }



   cleanup() {
      if (this._action) {



      }
   }


   exit() {
      this.cleanup();
   }

}



class RunRightState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runRight';
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('runRight').action;


      this._action.enabled = true;
      this._action.play();
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }



   cleanup() {
      if (this._action) {



      }
   }


   exit() {
      this.cleanup();
   }

}



class RunBackState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'runBack'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('runBack').action;

      this._action.enabled = true;
      this._action.play();
   }


   update(_, input) {
      if (!input) {
         return;
      }

      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      }

      if (!input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('run');
         return;
      }

      this.parent.changeTo('idle');
   }



   cleanup() {
      if (this._action) {



      }
   }


   exit() {
      this.cleanup();
   }

}



class ShootAttackState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'shootAttack'
   }


   enter(prevState) {
      this._action = this.parent.proxy.animations.get('shoot').action;
      const mixer  = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      mixer.stopAllAction();

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();
         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }

   }


   update(_, input) {
      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      } else {
         if (input.forward) {
            this.parent.changeTo('run');
            return;
         } else if (input.backward) {
            this.parent.changeTo('runBack');
            return;
         } else if (input.left) {
            this.parent.changeTo('runLeft');
            return;
         } else if (input.right) {
            this.parent.changeTo('runRight');
            return;
         }
      }


      this.parent.changeTo('idle')
   }


   finished() {

      this.cleanup();
      this.parent.changeTo('idle');

   }


   cleanup() {
      if (this._action) {
         this._action.getMixer().removeEventListener('finished', this.finishedCallback);


      }
   }


   exit() {
      this.cleanup();
   }

}



class MeleeAttackState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {

      return 'meleeAttack';

   }


   enter(prevState) {

      this._action = this.parent.proxy.animations.get('slash').action;
      const mixer  = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      mixer.stopAllAction();

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();
         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }
   }


   update(_, input) {
      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      } else {
         if (input.forward) {
            this.parent.changeTo('run');
            return;
         } else if (input.backward) {
            this.parent.changeTo('runBack');
            return;
         } else if (input.left) {
            this.parent.changeTo('runLeft');
            return;
         } else if (input.right) {
            this.parent.changeTo('runRight');
            return;
         }
      }


      this.parent.changeTo('idle')
   }


   finished() {

      this.cleanup();
      this.parent.changeTo('idle');

   }


   cleanup() {
      if (this._action) {

         this._action.getMixer().removeEventListener('finished', this.finishedCallback);


      }
   }


   exit() {
      this.cleanup();
   }

}



class RollState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }
   }


   get name() {
      return 'roll'
   }


   enter(prevState) {

      this._action = this.parent.proxy.animations.get('roll').action;
      const mixer  = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      mixer.stopAllAction();

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();
         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }


   }


   update(_, input) {
      if (input.shift && (input.forward || input.backward || input.left || input.right)) {
         this.parent.changeTo('walk');
         return;
      } else {
         if (input.forward) {
            this.parent.changeTo('run');
            return;
         } else if (input.backward) {
            this.parent.changeTo('runBack');
            return;
         } else if (input.left) {
            this.parent.changeTo('runLeft');
            return;
         } else if (input.right) {
            this.parent.changeTo('runRight');
            return;
         }
      }


      this.parent.changeTo('idle')
   }



   finished() {

      this.cleanup();
      this.parent.changeTo('idle');

   }


   cleanup() {
      if (this._action) {
         this._action.getMixer().removeEventListener('finished', this.finishedCallback);

      }
   }


   exit() {
      this.cleanup();
   }

}



class StunState extends PlayerState {
   constructor(parent) {
      super(parent);



      this.finishedCallback = () => {
         this.finished();
      }

   }


   get name() {
      return 'stun'
   }


   enter(prevState) {
      const mixer = this._action.getMixer();
      mixer.addEventListener('finished', this.finishedCallback);

      mixer.stopAllAction();

      if (prevState) {
         const previousAction = this.parent.proxy.animations.get(prevState.name).action;

         this._action.reset();
         this._action.setLoop(LoopOnce, 1);
         this._action.clampWhenFinished = true;
         this._action.crossFadeFrom(previousAction, 0.2, true);
         this._action.play();
      } else {
         this._action.play();
      }

   }


   cleanup() {
      this._action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   exit() {
      this.cleanup();
   }

}
