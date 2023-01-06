/**
 * @author MicMetzger /
 */

import PlayerStateMachine from './PlayerStateMachine.js'
import {RunState}         from './PlayerStates';
import {WalkState}        from './PlayerStates';
import {IdleState}        from './PlayerStates';
import {RollState}        from './PlayerStates';
import {StunState}        from './PlayerStates';
import {ShootAttackState} from './PlayerStates';
import {MeleeAttackState} from './PlayerStates';
import {RunBackState}     from './PlayerStates';
import {RunLeftState}     from './PlayerStates';
import {RunRightState}    from './PlayerStates';
import {DeathState}         from './PlayerStates';



class PlayerProxy extends PlayerStateMachine {
   constructor(proxy) {
      super()

      this.proxy = proxy

      this.addState('idle', new IdleState(this));
      this.addState('walk', new WalkState(this));
      this.addState('run', new RunState(this));
      this.addState('runBack', new RunBackState(this));
      this.addState('runLeft', new RunLeftState(this));
      this.addState('runRight', new RunRightState(this));
      this.addState('roll', new RollState(this));
      this.addState('stun', new StunState(this));
      this.addState('die', new DeathState(this));
      this.addState('shootAttack', new ShootAttackState(this));
      this.addState('meleeAttack', new MeleeAttackState(this));

   }
}



export default PlayerProxy
