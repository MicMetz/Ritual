/**
 * @author MicMetzger /
 */

class PlayerStateMachine {
   constructor() {
      this.states       = {};
      this.currentState = null
   }


   addState(name, type) {
      this.states[name] = type;
   }


   changeTo(id) {

      const state = this.states[id];

      this._change(state);

      return this;

   }


   _change(state) {

      if (this.previousState) {
         if (this.currentState.name.includes('Attack')) {

         } else {
            this.previousState = this.currentState;
         }
      } else {
         this.previousState = this.currentState;
      }

      if (this.currentState !== null) {

         this.currentState.exit();

      }

      this.currentState = state;

      this.currentState.enter(this.previousState);

   }



   update(timeElapsed, input, moving) {
      this.currentState?.update(timeElapsed, input, moving);
   }
}



export default PlayerStateMachine
