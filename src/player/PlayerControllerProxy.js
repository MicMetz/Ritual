/**
 * @author MicMetzger /
 */

class PlayerControllerProxy {
   constructor(animations) {
      this._animations = animations
   }


   get animations() {
      return this._animations;
   }


}



export {PlayerControllerProxy}
