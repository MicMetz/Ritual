import { Vector2 } from "three";
import { EventDispatcher } from "yuka";



class Pickable {
   constructor( args ) {
      this.deleted = false;
      this.id      = args.id;
      this.radius  = .3;
      this.pos     = new Vector2( args.x, args.y );
      this.type    = args.type;
   }


   collideCircle( item ) {
      return !this.deleted && this.pos.distanceTo( item.pos ) < this.radius + item.radius;
   };


   delete() {
      if ( this.deleted ) {
         return;
      }

      this.deleted = true;
      this.pos.set( 0, 0 );
   };


   get data() {
      return {
         id: this.id,
         t : this.type,
         r : this.radius,
         x : this.pos.x,
         y : this.pos.y
      };
   }
}



export default Pickable;
