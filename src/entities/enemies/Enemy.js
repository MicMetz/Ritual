import {BoundingSphere, Vehicle, StateMachine, Quaternion} from 'yuka';



class Enemy extends Vehicle {

   constructor(type) {
      super();

      this._type     = type;
      this._isPlayer = false;
      this._isAlive  = true;


      this._MAX_HEALTH_POINTS = 8;
      this._healthPoints      = this.MAX_HEALTH_POINTS;
   }


   get type() {
      return this._type;
   }


   get isPlayer() {
      return this._isPlayer;
   }


   get isAlive() {
      return this._isAlive;
   }


   set isAlive(bool) {
      this._isAlive = bool;
   }


   getMass() {
      return super.mass;
   }


   getSteering() {
      return super.steering;
   }


   takeDamage(from) {
      this._healthPoints -= from.damage;
      if (this._healthPoints <= 0) {
         this.isAlive(false);
      }
   }



}





export default Enemy;
