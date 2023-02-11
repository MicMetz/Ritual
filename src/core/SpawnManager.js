import {
   ITEM_TYPE_AMMO_BOX, ITEM_TYPE_AMMO_PACK, ITEM_TYPE_ENTITY,
   ITEM_TYPE_HEALTH_HEART, ITEM_TYPE_HEALTH_PACK, ITEM_TYPE_MELEE_WEAPON,
   ITEM_TYPE_RANGED_WEAPON
} from "../etc/Constants.js";



const spawnType = {
   [ ITEM_TYPE_HEALTH_PACK ]  : "healthPackSpawner",
   [ ITEM_TYPE_AMMO_PACK ]    : "ammoPackSpawner",
   [ ITEM_TYPE_HEALTH_HEART ] : "healthHeartSpawner",
   [ ITEM_TYPE_AMMO_BOX ]     : "ammoBoxSpawner",
   [ ITEM_TYPE_RANGED_WEAPON ]: "rangedWeaponSpawner",
   [ ITEM_TYPE_MELEE_WEAPON ] : "meleeWeaponSpawner",
   [ ITEM_TYPE_ENTITY ]       : "entitySpawner",
};



class SpawnManager {
   /**
    * @description SpawnManager is responsible for spawning all the entities in the game.
    * @param {World} world - A reference to the game world controller.
    */
   constructor( world ) {

      this.world = world;

      // ------------------------------
      this.pickupSpawners    = new Map();
      this.pickupSpawnPoints = new Array();
      // ------------------------------

      // ------------------------------
      this.entitySpawners    = new Array();
      this.entitySpawnPoints = new Map();
      this.playerSpawnPoints = new Array();
      // ------------------------------

      // ------------------------------
      this.healthPackSpawner  = new Array();
      this.healthHeartSpawner = new Array();
      // ------------------------------

      // ------------------------------
      this.ammoPackSpawner = new Array();
      this.ammoBoxSpawner  = new Array();
      // ------------------------------

      // ------------------------------
      this.rangedWeaponSpawners = new Map();
      this.meleeWeaponSpawners  = new Map();
      // ------------------------------

      this.itemTriggerMap = new Map();


      this.pickupSpawners.set( ITEM_TYPE_HEALTH_PACK, this.healthPackSpawner );
      this.pickupSpawners.set( ITEM_TYPE_AMMO_PACK, this.ammoPackSpawner );
      this.pickupSpawners.set( ITEM_TYPE_HEALTH_HEART, this.healthHeartSpawner );
      this.pickupSpawners.set( ITEM_TYPE_AMMO_BOX, this.ammoBoxSpawner );


   }


   /**
    *  @description A method that is called every frame to update the spawnmanager.
    *  @param {Number} timelapsed - The time elapsed since the last frame.
    */
   update( timelapsed ) {

      for ( let i = 0; i < this.entitySpawners.length; i++ ) {
         this.updateLists( this.entitySpawners[ i ], timelapsed );
      }

      for ( let i = 0; i < this.pickupSpawners.length; i++ ) {
         this.updateLists( this.pickupSpawners[ i ], timelapsed );
      }

      for ( let i = 0; i < this.rangedWeaponSpawners.length; i++ ) {
         this.updateLists( this.rangedWeaponSpawners[ i ], timelapsed );
      }

      for ( let i = 0; i < this.meleeWeaponSpawners.length; i++ ) {
         this.updateLists( this.meleeWeaponSpawners[ i ], timelapsed );
      }

      this.updateLists( this.healthPackSpawner, timelapsed );

   }


   /**
    *
    */
   updateLists( list, time1 ) {

   }


   toggle() {

   }

}
