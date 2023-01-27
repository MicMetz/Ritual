import {Weapon} from "../Weapon.js";



class ITrap extends Weapon {
   /**
    * @description Interface for all traps weapons.
    * @param world
    * @param owner
    * @param mesh
    * @param type
    */
   constructor(world, owner, mesh, type = "trap") {
      super(world, owner, type);

      this.weapon = mesh;
      this.damage = 1;
      this.range  = 1;


   }
}
