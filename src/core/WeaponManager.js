/**
 * @author MicMetzger /
 */

import { Vector3 } from "yuka";



function angleDifference( angle1, angle2 ) {
   const diff = ( ( angle2 - angle1 + Math.PI ) % ( Math.PI * 2 ) ) - Math.PI;
   return ( diff < -Math.PI ) ? diff + ( Math.PI * 2 ) : diff;
}


const easeInOut = x => x ** ( 2 / 5 );



class WeaponManager {
   /**
    * @param weapon {Weapon} The weapon to manage
    * @param owner {GameEntity} The entity that owns the weapon
    * @param position {Vector3} - The position of the weapon relative to the owner.
    * @param rotation {Vector3} - The rotation of the weapon relative to the owner.
    * @param scale {Vector3} (optional) default: 0.1, 0.1, 0.1
    */
   constructor( weapon, owner = null, { position, rotation, scale = new Vector3( 0.1, 0.1, 0.1 ) } = {} ) {

      this.weapon = weapon;
      this.owner  = owner;

      this.weapon.scale.copy( scale );
      this.weapon.position.copy( position );
      this.weapon.rotation.copy( rotation );

      this.defaultPosition = position;
      this.defaultRotation = rotation;

      this.targetWeaponRotations  = [];
      this.targetWeaponPositions  = [];
      this.currentWeaponRotations = new Vector3();
      this.currentWeaponPositions = new Vector3();

      this.priorUpdate = 0;

   }


   update( delta, yBounce ) {
      const time = ( delta - this.priorUpdate ) / 1000;

      if ( this.targetWeaponPositions.length > 0 ) {
         const targetPosition = this.targetWeaponPositions[ 0 ];
         const timeToTarget   = this.targetWeaponPositions[ 1 ];
         const attack         = this.targetWeaponPositions[ 2 ];
         const progress       = this.targetWeaponPositions[ 3 ];

         if ( time - this.priorUpdate > timeToTarget ) {
            this.currentWeaponPositions.copy( targetPosition );
            this.targetWeaponPositions.splice( 0, 4 );
         } else {
            const t = easeInOut( ( time - this.priorUpdate ) / timeToTarget );
            this.currentWeaponPositions.lerp( targetPosition, t );
         }
      }

      if ( this.targetWeaponRotations.length > 0 ) {
         const targetRotation = this.targetWeaponRotations[ 0 ];
         const timeToTarget   = this.targetWeaponRotations[ 1 ];
         const attack         = this.targetWeaponRotations[ 2 ];
         const progress       = this.targetWeaponRotations[ 3 ];

         if ( time - this.priorUpdate > timeToTarget ) {
            this.currentWeaponRotations.copy( targetRotation );
            this.targetWeaponRotations.splice( 0, 4 );
         } else {
            const t = easeInOut( ( time - this.priorUpdate ) / timeToTarget );
            this.currentWeaponRotations.lerp( targetRotation, t );
         }
      }

      this.priorUpdate = time;

      this.weapon.position.copy( this.currentWeaponPositions );
      this.weapon.rotation.copy( this.currentWeaponRotations );

      this.weapon.position.y += yBounce;

      if ( this.owner ) {
         this.weapon.position.add( this.owner.position );
         this.weapon.rotation.add( this.owner.rotation );
      }
   }


   addTargetPosition( x, y, z, time, attack ) {
      this.targetWeaponPositions.push( new Vector3( x, y, z ), time, attack, progress );
   }


   addTargetRotation( x, y, z, time, attack ) {
      this.targetWeaponRotations.push( new Vector3( x, y, z ), time, attack, progress );
   }


   checkSteady() {
      return this.targetWeaponPositions.length === 0 && this.targetWeaponRotations.length === 0;
   }


   setRay( ray ) {
      this.ray = ray;
   }


   setWeapon( weapon ) {
      this.weapon = weapon;
   }


   setChest( chest ) {
      this.chest = chest;
   }


   setRightHand( rightHand ) {
      this.rightHand = rightHand;
   }

}
