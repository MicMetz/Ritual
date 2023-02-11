import { Item } from "./Item.js";



class Carryable extends Item {
   /**
    * @description  Carryable items are items that can be picked up and carried within either the player's inventory,
    *              or in the player's hand, or both.
    *
    * @param world
    * @param name
    * @param type
    * @param parent
    * @param active
    * @param triggers
    * @param description
    * @param position
    * @param rotation
    */
   constructor( world, name, type, parent, active, triggers, description, position, rotation ) {
      super( world, name, type, parent, active, triggers, description, position, rotation );

      this._isCarried = false;
   }


   get isCarried() {
      return this._isCarried;
   }


   set isCarried( value ) {
      this._isCarried = value;
   }
}
