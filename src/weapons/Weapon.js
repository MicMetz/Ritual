/**
 * @author MicMetzger /
 * original {@link https://github.com/Mugen87|Mugen87}
 */

import {GameEntity, MathUtils}                                                                      from 'yuka';
import {Item}                                                                                       from "../entities/Item.js";
import {WEAPON_STATUS_READY, WEAPON_STATUS_NOT_READY, WEAPON_STATUS_EQUIPPED, WEAPON_STATUS_HIDDEN} from '../etc/Constants.js';



class Weapon extends Item {

   constructor(owner) {
      super(owner);

      this._owner = owner;

      this._canActivateTrigger = false;

      this._type   = null;
      this._status = WEAPON_STATUS_NOT_READY;

      // use to restore the state after a weapon change
      this._previousState = WEAPON_STATUS_READY;

      this._ammoRemaining = 0;
      this._ammoPerLoad   = 0;
      this._ammo          = 0;
      this._maxAmmo       = 0;

      this._currentTime = 0;

      this._shotTime   = Infinity;
      this._reloadTime = Infinity;
      this._equipTime  = Infinity;
      this._hideTime   = Infinity;

      this._endTimeShot       = Infinity;
      this._endTimeReload     = Infinity;
      this._endTimeEquip      = Infinity;
      this._endTimeHide       = Infinity;
      this._endTimeMuzzleFire = Infinity;

      // used for weapon selection
      this._fuzzyModule = null;

      // render specific properties
      this._muzzle     = null;
      this._audios     = null;
      this._mixer      = null;
      this._animations = null;

   }


   /**
    * Adds the given amount of rounds to the ammo.
    *
    * @param {Number} rounds - The amount of ammo.
    * @return {Weapon} A reference to this weapon.
    */
   addAmmo(rounds) {

      this._ammo = MathUtils.clamp(this._ammo + rounds, 0, this._maxAmmo);

      return this;

   }


   getAmmoRemaining() {

      return this._ammo;

   }


   /**
    * Returns a value representing the desirability of using the weapon.
    *
    * @param {Number} distance - The distance to the target.
    * @return {Number} A score between 0 and 1 representing the desirability.
    */
   getDesirability() {

      return 0;

   }


   /**
    * Equips the weapon.
    *
    * @return {Weapon} A reference to this weapon.
    */
   equip() {

      this._status       = WEAPON_STATUS_EQUIPPED;
      this._endTimeEquip = this._currentTime + this._equipTime;

      if (this._mixer) {

         let animation = this._animations.get('hide');
         animation.stop();

         animation = this._animations.get('equip');
         animation.stop();
         animation.play();

      }

      if (this._owner.isPlayer()) {

         this._owner.world.userInterface._updateAmmoStatus();


      }

      return this;

   }


   /**
    * Hides the weapon.
    *
    * @return {Weapon} A reference to this weapon.
    */
   hide() {

      this._previousState = this._status;
      this._status        = WEAPON_STATUS_HIDDEN;
      this._endTimeHide   = this._currentTime + this._hideTime;

      if (this._mixer) {

         const animation = this._animations.get('hide');
         animation.stop();
         animation.play();

      }

      return this;

   }


   /**
    * Reloads the weapon.
    *
    * @return {Weapon} A reference to this weapon.
    */
   reload() {}


   /**
    * Shoots at the given position.
    *
    * @param {Vector3} targetPosition - The target position.
    * @return {Weapon} A reference to this weapon.
    */
   fire() {}


   /**
    * Update method of this weapon.
    *
    * @param {Number} delta - The time delta value;
    * @return {Weapon} A reference to this weapon.
    */
   update(delta) {

      this._currentTime += delta;

      if (this._currentTime >= this._endTimeEquip) {

         this._status       = this._previousState; // restore previous state
         this._endTimeEquip = Infinity;

      }

      if (this._currentTime >= this._endTimeHide) {

         this._status      = WEAPON_STATUS_NOT_READY;
         this._endTimeHide = Infinity;

      }

      // update animations

      if (this._mixer) {

         this._mixer.update(delta);

      }

      return this;

   }

}



export {Weapon};
