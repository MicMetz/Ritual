/**
 * @author MicMetzger /
 * original Mugen87 / https://github.com/Mugen87
 */

import { Vector3 } from 'yuka';
import { dumpObject, GUARDTYPE } from "../etc/Utilities.js";
import { DefaultCombatPattern, SpreadCombatPattern, FocusCombatPattern, RandomCombatPattern } from '../patterns/CombatPatterns';
import { LeftRightMovementPattern, WavyMovementPattern, CircleMovementPattern, PursuitBehaviorMovementPattern } from '../patterns/MovementPatterns';
import { Obstacle } from '../entities/Obstacle';
import { PropertyAnimation } from '../system/AnimationSystem.js';



class SceneManager {

   constructor( world ) {

      this.world = world;

   }


   load( id ) {

      switch (id) {

         case 1:
            this._loadStage01();
            break;

         case 2:
            this._loadStage02();
            break;

         case 3:
            this._loadStage03();
            break;

         case 4:
            this._loadStage04();
            break;

         case 5:
            this._loadStage05();
            break;

         case 6:
            this._loadStage06();
            break;

         case 7:
            this._loadStage07();
            break;

         case 8:
            this._loadStage08();
            break;

         case 9:
            this._loadStage09();
            break;

         case 10:
            this._loadStage10();
            break;

         case 11:
            this._loadStage11();
            break;

         case 12:
            this._loadStage12();
            break;

         case 13:
            this._loadStage13();
            break;

         case 14:
            this._loadStage14();
            break;

         default:
            console.error( 'SceneManager: Unknown level ID', id );

      }

   }


   _loadStage01() {

      const world = this.world;

      // field
      // world.environmentManager.update(15, 1, 15);
      world.field.x = 10000;
      world.field.y = 1;
      world.field.z = 10000;
      world.environmentManager.update( 10000, 1, 10000 );

      // controls
      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies
      const guard = world._createGuard( GUARDTYPE.ASSAULT );
      console.log( dumpObject( guard ) );
      // console.log(guard);
      guard.position.set( 0, 0.5, -4 );
      guard.setCombatPattern( new DefaultCombatPattern() );
      guard.setMovementPattern( new LeftRightMovementPattern() );
      world.addGuard( guard );

      const pursuer = world._createPursuer();

      const x = -5 + ( 1 % 4 ) * 3;
      const z = -4 + Math.floor( 1 / 4 ) * 3;

      pursuer.position.set( x, 0, z );

      const combatPattern                   = new FocusCombatPattern();
      combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
      combatPattern.destructibleProjectiles = 1;
      pursuer.setCombatPattern( combatPattern );
      pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

      world.addPursuer( pursuer );
   }


   _loadStage02() {

      const world = this.world;

      // field

      // world.environmentManager.update(15, 1, 15);
      world.environmentManager.update( 30, 1, 30 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, 0 );
      const combatPattern          = new DefaultCombatPattern();
      combatPattern.shotsPerSecond = 1;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new WavyMovementPattern() );

      world.addGuard( guard );

   }


   _loadStage03() {

      const world = this.world;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, 0 );
      guard.setCombatPattern( new SpreadCombatPattern() );
      guard.setMovementPattern( new CircleMovementPattern() );

      world.addGuard( guard );

   }


   _loadStage04() {

      const world = this.world;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -4 );
      const combatPattern                   = new DefaultCombatPattern();
      combatPattern.shotsPerSecond          = 2;
      combatPattern.destructibleProjectiles = 1;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new LeftRightMovementPattern() );

      world.addGuard( guard );

   }


   _loadStage05() {

      const world = this.world;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard    = world._createGuard();
      guard.maxSpeed = 2;
      guard.position.set( 0, 0.5, -4 );
      const combatPattern          = new SpreadCombatPattern();
      combatPattern.shotsPerSecond = 2;
      combatPattern.enableRotation = false;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );

      world.addGuard( guard );

   }


   _loadStage06() {

      const world = this.world;

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard    = world._createGuard();
      guard.maxSpeed = 2;
      guard.position.set( 0, 0.5, -4 );
      const combatPattern                   = new FocusCombatPattern();
      combatPattern.destructibleProjectiles = 0.5;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );

      world.addGuard( guard );

   }


   _loadStage07() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -6 );
      guard.setCombatPattern( new DefaultCombatPattern() );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );
      guard.enableProtection();

      world.addGuard( guard );

      // pursuer

      const pursuerCount = 7;

      for ( let i = 0; i < pursuerCount; i++ ) {

         const pursuer = world._createPursuer();

         const s = Math.PI * ( i / pursuerCount );
         const x = Math.cos( s ) * 4;
         const z = -4 + Math.sin( s ) * 4;

         pursuer.position.set( x, 0.5, z );

         const combatPattern              = new DefaultCombatPattern();
         combatPattern.projectilesPerShot = 0;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         world.addPursuer( pursuer );

      }

   }


   _loadStage08() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -6 );
      const combatPattern         = new FocusCombatPattern();
      combatPattern.pauseDuration = 1;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );
      guard.enableProtection();

      world.addGuard( guard );

      // pursuer

      const pursuerCount = 7;

      for ( let i = 0; i < pursuerCount; i++ ) {

         const pursuer = world._createPursuer();

         const s = Math.PI * ( i / pursuerCount );
         const x = Math.cos( s ) * 4;
         const z = -4 + Math.sin( s ) * 4;

         pursuer.position.set( x, 0.5, z );

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 1;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         world.addPursuer( pursuer );

      }

   }


   _loadStage09() {

      const world = this.world;

      // field

      world.environmentManager.update( 15, 1, 15 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // enemies

      const guardCount = 2;

      for ( let i = 0; i < guardCount; i++ ) {

         const guard = world._createGuard();
         guard.position.set( 3 - ( i * 6 ), 0.5, -6 );

         const combatPattern              = new SpreadCombatPattern();
         combatPattern.projectilesPerShot = 4;
         combatPattern.shotsPerSecond     = 8;
         combatPattern.enableRotation     = false;
         guard.setCombatPattern( combatPattern );

         const movementPattern = new PursuitBehaviorMovementPattern();
         guard.setMovementPattern( movementPattern );
         world.addGuard( guard );

      }

      // obstacles

      const obstacleCount = 5;

      for ( let i = 0; i < obstacleCount; i++ ) {

         const obstacle = new Obstacle();
         obstacle.position.set( 6 - ( i * 3 ), 0.5, 2 );
         world.addObstacle( obstacle );

      }

   }


   _loadStage10() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 25, 1, 25 );

      // controls

      world.controls.setPosition( 0, 0.5, 10 );
      world.controls.resetRotation();

      // guard

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, 0 );
      const combatPattern                   = new DefaultCombatPattern();
      combatPattern.projectilesPerShot      = 5;
      combatPattern.destructibleProjectiles = 0.5;
      combatPattern.shotsPerSecond          = 0.1;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );
      guard.enableProtection();

      const animation       = new PropertyAnimation();
      animation.object      = combatPattern;
      animation.property    = 'shotsPerSecond';
      animation.targetValue = 2;
      animation.duration    = 4;
      animation.delay       = 3;

      world.animationSystem.add( animation );

      world.addGuard( guard );

      // pursuer

      const pursuerCount = 12;

      for ( let i = 0; i < pursuerCount; i++ ) {

         const pursuer = world._createPursuer();

         const x = -5 + ( i % 4 ) * 3;
         const z = -4 + Math.floor( i / 4 ) * 3;

         pursuer.position.set( x, 0.5, z );

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         world.addPursuer( pursuer );

      }

   }


   _loadStage11() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 25, 1, 25 );

      // controls

      world.controls.setPosition( 0, 0.5, 7 );
      world.controls.resetRotation();

      // guard

      const guard             = world._createGuard();
      guard.updateOrientation = false;
      guard.position.set( 0, 0.5, -10 );
      const combatPattern                   = new SpreadCombatPattern();
      combatPattern.projectilesPerShot      = 8;
      combatPattern.destructibleProjectiles = 0.5;
      combatPattern.shotsPerSecond          = 0.1;
      combatPattern.rotationSpeed           = 0.4;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );
      guard.enableProtection();

      const animation       = new PropertyAnimation();
      animation.object      = combatPattern;
      animation.property    = 'shotsPerSecond';
      animation.targetValue = 8;
      animation.duration    = 4;
      animation.delay       = 4;

      world.animationSystem.add( animation );

      world.addGuard( guard );


      // puruser

      function createPursuer() {

         const pursuer = world._createPursuer();

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         return pursuer;

      }


      // pursuers behind obstacles

      let pursuer = createPursuer();
      pursuer.position.set( 0, 0.5, 11 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -10, 0.5, 1 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( 10, 0.5, 1 );
      world.addPursuer( pursuer );

      // pursuers in front of guard

      const pursuerCount = 6;

      for ( let i = 0; i < pursuerCount; i++ ) {

         pursuer = createPursuer();

         const x = -3 + ( i % 3 ) * 3;
         const z = -3 + Math.floor( i / 3 ) * 3;

         pursuer.position.set( x, 0.5, z );
         world.addPursuer( pursuer );

      }

      // obstacles

      // bottom row

      let obstacle = new Obstacle();
      obstacle.position.set( 0, 0.5, 9 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -1.25, 0.5, 9 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 1.25, 0.5, 9 );
      world.addObstacle( obstacle );

      // left row

      obstacle = new Obstacle();
      obstacle.position.set( -8, 0.5, -1.25 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -8, 0.5, 0 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -8, 0.5, 1.25 );
      world.addObstacle( obstacle );

      // right row

      obstacle = new Obstacle();
      obstacle.position.set( 8, 0.5, -1.25 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 8, 0.5, 0 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 8, 0.5, 1.25 );
      world.addObstacle( obstacle );

   }


   _loadStage12() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 20, 1, 20 );

      // controls

      world.controls.setPosition( 0, 0.5, 5 );
      world.controls.resetRotation();

      // guard

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -5 );
      guard.enableProtection();

      const combatPattern                   = new FocusCombatPattern();
      combatPattern.pauseDuration           = 4;
      combatPattern.destructibleProjectiles = 0.5;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );

      const animation       = new PropertyAnimation();
      animation.object      = combatPattern;
      animation.property    = 'pauseDuration';
      animation.targetValue = 0;
      animation.duration    = 6;
      animation.delay       = 2;

      world.animationSystem.add( animation );

      world.addGuard( guard );

      // puruser

      const pursuerCount = 8;

      for ( let i = 0; i < pursuerCount; i++ ) {

         const pursuer = world._createPursuer();

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         const x = -8 + ( i % 4 ) * 5;
         const z = -8 + Math.floor( i / 4 ) * 5;

         pursuer.position.set( x, 0.5, z );
         world.addPursuer( pursuer );

      }

      // obstacles

      // top row

      let obstacle = new Obstacle();
      obstacle.position.set( 0, 0.5, -6 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -5, 0.5, -6 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 5, 0.5, -6 );
      world.addObstacle( obstacle );

      // left row

      obstacle = new Obstacle();
      obstacle.position.set( -5, 0.5, -1 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -5, 0.5, 4 );
      world.addObstacle( obstacle );

      // right row

      obstacle = new Obstacle();
      obstacle.position.set( 5, 0.5, -1 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 5, 0.5, 4 );
      world.addObstacle( obstacle );

   }


   _loadStage13() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 20, 1, 20 );

      // controls

      world.controls.setPosition( 0, 0.5, 7 );
      world.controls.resetRotation();

      // guard

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -7 );
      guard.enableProtection();

      const combatPattern                   = new DefaultCombatPattern();
      combatPattern.shotsPerSecond          = 0.2;
      combatPattern.destructibleProjectiles = 0.5;
      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );

      const animation       = new PropertyAnimation();
      animation.object      = combatPattern;
      animation.property    = 'shotsPerSecond';
      animation.targetValue = 8;
      animation.duration    = 10;
      animation.delay       = 4;

      world.animationSystem.add( animation );

      world.addGuard( guard );


      // puruser

      function createPursuer() {

         const pursuer = world._createPursuer();

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         return pursuer;

      }


      const pursuerCount = 4;

      for ( let i = 0; i < pursuerCount; i++ ) {

         const pursuer = createPursuer();

         const x = -6 + ( i % 4 ) * 4;
         const z = 0;

         pursuer.position.set( x, 0.5, z );
         world.addPursuer( pursuer );

      }

      let pursuer = createPursuer();
      pursuer.position.set( 4, 0.5, -4 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -4, 0.5, -4 );
      world.addPursuer( pursuer );

      // towers

      const tower = world._createTower();
      tower.position.set( 0, 0.5, 0 );
      tower.updateBoundingVolumes(); // towers are static

      const towerCombatPattern              = new SpreadCombatPattern();
      towerCombatPattern.projectilesPerShot = 4;
      towerCombatPattern.enableRotation     = false;
      tower.setCombatPattern( towerCombatPattern );

      world.addTower( tower );

      // obstacles

      let obstacle = new Obstacle();
      obstacle.position.set( 2.5, 0.5, 2.5 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( -2.5, 0.5, 2.5 );
      world.addObstacle( obstacle );

      obstacle = new Obstacle();
      obstacle.position.set( 0, 0.5, -2.5 );
      world.addObstacle( obstacle );

   }


   _loadStage14() {

      const world = this.world;

      world.guardsProtected = true;

      // field

      world.environmentManager.update( 20, 1, 20 );

      // controls

      world.controls.setPosition( 0, 0.5, 7 );
      world.controls.resetRotation();

      const guard = world._createGuard();
      guard.position.set( 0, 0.5, -7 );
      guard.enableProtection();

      const combatPattern                   = new RandomCombatPattern();
      combatPattern.shotsPerSecond          = 0.5;
      combatPattern.destructibleProjectiles = 0.5;

      guard.setCombatPattern( combatPattern );
      guard.setMovementPattern( new PursuitBehaviorMovementPattern() );

      const animation       = new PropertyAnimation();
      animation.object      = combatPattern;
      animation.property    = 'shotsPerSecond';
      animation.targetValue = 8;
      animation.duration    = 6;
      animation.delay       = 0;

      world.animationSystem.add( animation );

      world.addGuard( guard );


      // purusers

      function createPursuer() {

         const pursuer = world._createPursuer();

         const combatPattern                   = new FocusCombatPattern();
         combatPattern.shotsPerSecond          = 0.25 + Math.random() * 0.75;
         combatPattern.destructibleProjectiles = 1;
         pursuer.setCombatPattern( combatPattern );
         pursuer.setMovementPattern( new PursuitBehaviorMovementPattern() );

         return pursuer;

      }


      let pursuer = createPursuer();
      pursuer.position.set( 4, 0.5, 0 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -4, 0.5, 0 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -7, 0.5, -4 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( 7, 0.5, -4 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -1, 0.5, -4 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( 1, 0.5, -4 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( 4, 0.5, -7 );
      world.addPursuer( pursuer );

      pursuer = createPursuer();
      pursuer.position.set( -4, 0.5, -7 );
      world.addPursuer( pursuer );


      // obstacles

      function generateBlock( position ) {

         const obstalceCount = 9;

         for ( let i = 0; i < obstalceCount; i++ ) {

            const obstacle = new Obstacle();

            let x = 1.25 - ( i % 3 ) * 1.25;
            let z = 1.25 - Math.floor( i / 3 ) * 1.25;

            x += position.x;
            z += position.z;

            obstacle.position.set( x, 0.5, z );
            world.addObstacle( obstacle );

         }

      }


      const position = new Vector3();

      // bottom right

      position.set( 4, 0, 4 );
      generateBlock( position );

      // bottom left

      position.set( -4, 0, 4 );
      generateBlock( position );

      // top right

      position.set( 4, 0, -4 );
      generateBlock( position );

      // top left

      position.set( -4, 0, -4 );
      generateBlock( position );

   }

}



export { SceneManager };
