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


   changeTo(name) {

      this.previousState = this.currentState;

      if (this.previousState) {
         if (this.currentState.name === name) {
            return;
         }
         this.previousState.exit();
      }

      const state = new this.states[name](this);
      this.currentState = state;``

      state.enter(this.previousState);

   }



   update(timeElapsed, input) {
      if (this.currentState) {
         this.currentState.update(timeElapsed, input);
      }
   }


}



export default PlayerStateMachine
