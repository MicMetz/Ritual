/**
 * @author MicMetzger /
 */

class StateMachine {
   constructor() {
      this.states       = {};
      this.currentState = null;
   }


   addState(name, type) {
      this.states[name] = type;
   }


   changeTo(name) {

      const previousState = this.currentState;

      if (previousState) {
         if (this.currentState.Name === name) {
            return;
         }
         previousState.exit();
      }

      const state       = new this.states[name](this);
      this.currentState = state;

      state.enter(previousState);

   }



   update(timeElapsed, input) {
      if (this.currentState) {
         this.currentState.update(timeElapsed, input);
      }
   }


}



export default StateMachine
