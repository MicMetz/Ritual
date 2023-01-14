/**
 * @author MicMetzger /
 */

import {LoopOnce}   from "three";
import State        from "./State.js";
import StateMachine from "./StateMachine.js";



export class PlayerProxy extends StateMachine {
   constructor(proxy) {
      super()

      this._proxy = proxy

      this.addState('idle', IdleState);
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

   }
}



class IdleState extends State {
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



class RespawnState extends State {
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



class DeathState extends State {
   constructor(parent) {
      super(parent);
      this.finishedCallback = () => {
         this.finished();
      }
   }


   get Name() {

      return 'die';

   }


   Enter(prevState) {
      const action = this._parent._proxy.animations.get('die').action;
      action.getMixer().addEventListener('finished', this.finishedCallback);

      if (prevState) {
         const previousAction = this._parent._proxy.animations.get(prevState.Name).action;

         // action.reset();

         action.setLoop(LoopOnce, 1);
         action.clampWhenFinished = true;
         action.crossFadeFrom(previousAction, 0.2, true);
         action.play();

      } else {

         action.play();

      }
   }


   finished() {
      this.cleanup();
      // this._parent.changeTo('idle');
   }


   cleanup() {
      const action = this._parent._proxy.animations.get('die').action;
      action.getMixer().removeEventListener('finished', this.finishedCallback);
   }


   update(_) {

      return;

   }


   exit() {
      this.cleanup();
   }

};



class WalkState extends State {
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



class RunState extends State {
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



class RunLeftState extends State {
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



class RunRightState extends State {
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



class RunBackState extends State {
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



class ShootAttackState extends State {
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



class MeleeAttackState extends State {
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



class RollState extends State {
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



class StunState extends State {
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
