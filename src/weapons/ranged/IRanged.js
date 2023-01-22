import {Weapon} from "../Weapon.js";



class IRanged extends Weapon {
   /**
    * @description Interface for all ranged weapons.
    * @param owner
    * @param mesh
    */
   constructor(owner, mesh) {
      super(owner, mesh);

      this._damage = 0;
      this._range  = 0;

   }
}
