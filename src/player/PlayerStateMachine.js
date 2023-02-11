/**
 * @author MicMetzger /
 */

class PlayerStateMachine {
   /**
    * @description A finite state machine design pattern for the player character animation states
    * @constructor PlayerStateMachine
    */
   constructor() {
      this.states       = {};
      this.currentState = null;
   }


   /**
    * @description Add a new state to the state machine
    *
    * @param name
    * @param type
    */
   addState( name, type ) {
      this.states[ name ] = type;
   }


   /**
    * @description Change the current state to the state with the given name
    *
    * @param name {string} - name of the state to transition to
    */
   changeTo( name ) {

      const previousState = this.currentState;

      if ( previousState ) {
         if ( this.currentState.Name === name ) {
            return;
         }
         previousState.exit();
      }

      const state       = new this.states[ name ]( this );
      this.currentState = state;

      state.enter( previousState );

   }


   /**
    * @description Update the current state with the given delta time elapsed
    *
    * @param timeElapsed {number}  - time elapsed since last update
    * @param input      {object}  - input object from the player
    */
   update( timeElapsed, input ) {
      if ( this.currentState ) {
         this.currentState.update( timeElapsed, input );
      }
   }


}



export { PlayerStateMachine };
