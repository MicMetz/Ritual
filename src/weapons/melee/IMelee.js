import {Weapon} from "../Weapon.js";



class IMelee extends Weapon {
   /**
    * @description Interface for all melee weapons.
    * @param owner
    * @param mesh
    */
   constructor(owner, mesh) {
      super(owner, mesh);

      this._damage = 0;
      this._range  = 0;

   }
}
