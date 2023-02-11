/**
 * @author MicMetzger /
 */
import { Object3D } from "three";



export const CONFIG = {
   UI: {
      CROSSHAIR       : {
         HIT_OUT_TIME: 0.3,
         OPACITY     : 0.5,
         SCALE       : 40
      },
      DAMAGE_INDICATOR: {
         OPACITY    : 0.5,
         SCALE      : 256,
         HIT_IN_TIME: 0.5,
      },
      GRENADES        : {
         TIME: 5,
      }
   },
}

/**
 *
 * |----------------------------------|   |----------------------------------|
 * |            Room Sizes            |   |            Map Sizes             |
 * |----------------------------------|   |----------------------------------|
 * |  Small | Normal | Large | Huge   |   |  Small | Normal | Large | Huge   |
 * |----------------------------------|   |----------------------------------|
 * |17.5x17.5| 35x35 | 70x70 | 140x140|   | 70x70 | 140x140| 280x280| 560x560|
 *
 * */
const _HUGE_MAP_BOUNDRY_LIMIT_ = {
   x             : { min: -560, max: 560 },
   z             : { min: -560, max: 560 },
   maxSmallRooms : 32,
   maxNormalRooms: 16,
   maxLargeRooms : 8,
}

const _LARGE_MAP_BOUNDRY_LIMIT_ = {
   x             : { min: -280, max: 280 },
   z             : { min: -280, max: 280 },
   maxSmallRooms : 16,
   maxNormalRooms: 8,
   maxLargeRooms : 4,
};

const _SMALL_MAP_BOUNDRY_LIMIT_ = {
   x             : { min: -70, max: 70 },
   z             : { min: -70, max: 70 },
   maxSmallRooms : 4,
   maxNormalRooms: 2,
   maxLargeRooms : 1,
};

const _NORMAL_MAP_BOUNDRY_LIMIT_ = {
   x             : { min: -140, max: 140 },
   z             : { min: -140, max: 140 },
   maxSmallRooms : 8,
   maxNormalRooms: 4,
   maxLargeRooms : 2,
}


const ZOMBIETYPE = {
   NORMAL: 'normal_zombie',
}


const GUARDTYPE = {

   NORMAL: 'default_guard', HEAVY: 'task_force', ASSAULT: 'assault_guard',

};


const PURSUERTYPE = {};


const TOWERTYPE = {};


const QUALITY = {

   COMMON: 'common', UNCOMMON: 'uncommon', RARE: 'rare', EPIC: 'epic', LEGENDARY: 'legendary'

};


const WEAPONTYPE = {

   MELEE: 'melee', RANGED: 'ranged'

};



function wrap( mesh ) {
   const object = new Object3D();
   object.add( mesh );
   return object;
}


/**
 * Inclusive test, boundaries are included in positive test
 * * @author Alex Goldring
 * * @copyright Alex Goldring 17/04/2016.

 * @param {Number} value
 * @param {Number} v0
 * @param {Number} v1
 * @returns {boolean}
 */
export function isValueBetweenInclusive( value, v0, v1 ) {
   return ( v0 >= value && value >= v1 ) || ( v1 >= value && value >= v0 );
}


function dumpObject( obj, lines = [], isLast = true, prefix = '' ) {
   const localPrefix = isLast ? '└─' : '├─';
   lines.push( `${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]` );
   const newPrefix = prefix + ( isLast ? '  ' : '│ ' );
   const lastNdx   = obj.children.length - 1;
   obj.children.forEach( ( child, ndx ) => {
      const isLast = ndx === lastNdx;
      dumpObject( child, lines, isLast, newPrefix );
   } );
   return lines;
}



function adjustVertices( geometry, scale = 2 ) {
   const p = geometry.vertices;
   for ( let i = 0; i < p.length; i++ ) {
      p[ i ].x += ( Math.random() - 0.5 ) * scale;
      p[ i ].y += ( Math.random() - 0.5 ) * scale;
      p[ i ].z += ( Math.random() - 0.5 ) * scale;
   }
}



function randomMovePositions( bufferGeometry, scale = 1 ) {
   const p = bufferGeometry.attributes.position.array;
   for ( let i = 0; i < p.length; i++ ) {
      p[ i ] += ( Math.random() - 0.5 ) * scale;
   }
   bufferGeometry.attributes.position.needsUpdate = true;
}



function randomString( length ) {
   const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split( '' );
   if ( !length ) {
      length = Math.floor( Math.random() * chars.length );
   }
   let str = '';
   for ( let i = 0; i < length; i++ ) {
      str += chars[ Math.floor( Math.random() * chars.length ) ];
   }
   return str;
}


function randomInt( min, max ) {
   return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}


function randomBool() {
   return Math.random() >= 0.5;
}


function randomExcept( arr, except ) {
   const filtered = arr.filter( item => item !== except );
   return filtered[ randomInt( 0, filtered.length - 1 ) ];
}


function randomExExcept( arr, exceptArr ) {
   const filtered = arr.filter( item => !exceptArr.includes( item ) );
   return filtered[ randomInt( 0, filtered.length - 1 ) ];
}


export {
   _SMALL_MAP_BOUNDRY_LIMIT_, _LARGE_MAP_BOUNDRY_LIMIT_, _HUGE_MAP_BOUNDRY_LIMIT_, _NORMAL_MAP_BOUNDRY_LIMIT_,
   dumpObject, randomString, randomInt, randomBool, randomExcept, randomExExcept,
   ZOMBIETYPE, GUARDTYPE, PURSUERTYPE, TOWERTYPE, QUALITY, WEAPONTYPE
};
