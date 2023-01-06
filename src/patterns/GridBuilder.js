/**
 * @author MicMetzger /
 */

import {
   _LARGE_MAP_BOUNDRY_LIMIT_, _NORMAL_MAP_BOUNDRY_LIMIT_,
   _SMALL_MAP_BOUNDRY_LIMIT_, _HUGE_MAP_BOUNDRY_LIMIT_
} from "../etc/Utilities.js";



const range = (start, end, length = end - start + 1) => {
   return Array.from({length}, (_, i) => start + i);
};



class GridBuilder {

   constructor(world) {

      this.map = [];

   }


   buildGrid(size) {

   }


}
