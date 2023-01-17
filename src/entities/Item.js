/**
 * @author MicMetzger /
 */

import {GameEntity, Quaternion, Vector3} from "yuka";



class Item extends GameEntity {
   /**
    *
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
   constructor(world, name, type, parent, active, triggers, description, position, rotation) {
      super();

      this.world    = world;
      this._type     = type ? type : 'unknown';
      this._parent   = parent ? parent : null;
      this._active   = active ? active : false;
      this._triggers = triggers ? triggers : [];

      this._description = description ? description : 'This is a ' + name + ' of type ' + type;
      this._position    = position ? new Vector3(position) : new Vector3();
      this._rotation    = rotation ? new Quaternion(rotation) : new Quaternion();

   }


   get type() {
      return this._type
   }


   set type(type) {
      this._type = type;
   }


   get description() {
      return this._description
   }


   set description(value) {
      this._description = value;
   }


   get position() {
      return this._position;
   }


   set position(value) {
      this._position.copy(value);
   }


   get rotation() {
      return this._rotation;
   }


   set rotaion(value) {
      this._rotation.copy(value);
   }


   get trigger() {
      return this._triggers;
   }


   set trigger(func) {

      this._triggers.push(func);

   }


   handleMessage(telegram) {
      if (this._triggers.length > 0) {
         if (!(telegram.type in this._triggers)) {
            return false;
         } else {
            for (let handler of this._triggers[telegram.type]) {
               handler(telegram);
            }
         }
      }
   }


   update() {
      // temporary
   }

}



export {Item};
