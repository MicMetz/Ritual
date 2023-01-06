/**
 * @author MicMetzger /
  */

import {WEAPON_TYPES_ABILITY, WEAPON_TYPES_MELEE, WEAPON_TYPES_RANGE}       from "../etc/Constants.js";
import { WEAPON_STATUS_EMPTY, WEAPON_STATUS_READY, WEAPON_STATUS_NOT_READY} from "../etc/Constants.js";


class WeaponSystem {
   /**
    *
    *
    * @param owner
    */
   constructor(owner) {

      this.owner         = owner;
      this.currentWeapon = null;
      this.weaponsStore  = new Map();

      this.nextWeapon = null;
      this.prevWeapon = null;

      this.weaponsStore.set(WEAPON_TYPES_RANGE, null);
      this.weaponsStore.set(WEAPON_TYPES_MELEE, null);
      this.weaponsStore.set(WEAPON_TYPES_ABILITY, null);

   }


}


export {WeaponSystem};
