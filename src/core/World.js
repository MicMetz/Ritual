/**
 * @author MicMetzger /
 */

import {
   AmbientLight, BoxBufferGeometry, CameraHelper, Color, CylinderBufferGeometry, DirectionalLight,
   DynamicDrawUsage, Geometry, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshLambertMaterial, Object3D, PCFSoftShadowMap,
   PerspectiveCamera, PlaneBufferGeometry, Points, PointsMaterial, Scene, ShaderMaterial, SphereBufferGeometry, sRGBEncoding,
   WebGLRenderer, MathUtils, BufferGeometry
}                                    from "three";
import * as THREE                    from 'three';
import * as YUKA                     from 'yuka';
import {AssetManager}                from './AssetManager.js';
import {PlayerControls}              from '../player/PlayerControls.js';
import {Player}                      from '../player/Player.js';
import {Guard}                       from '../entities/Guard.js';
import {Pursuer}                     from '../entities/Pursuer.js';
import {ProtectionShader, HitShader} from '../etc/Shaders.js';
import {PursuerGeometry}             from '../patterns/PursuerGeometry.js';
import {AnimationSystem}             from './AnimationSystem.js';
import {EnvironmentManager}          from "./EnvironmentManager.js";
import {InterfaceManager}            from "./InterfaceManager.js";
import {SceneManager}                from './SceneManager.js';
import {Tower}                       from '../entities/Tower.js';
import {dumpObject, GUARDTYPE}       from '../etc/Utilities.js';



export function start() {

   const game = new World();
   game.init();

}



const toVector     = new YUKA.Vector3();
const displacement = new YUKA.Vector3();


const _DEBUG_ = process.env.NODE_ENV === 'development' ? true : false;



class World {

   constructor() {

      this.active   = false;
      this.gameOver = false;

      this.entityManager = new YUKA.EntityManager();
      this.time          = new YUKA.Time();

      this.currentStage = 1;
      this.maxStage     = 14;

      this.environmentManager = new EnvironmentManager(this);
      this.stargeometry       = new Geometry();
      this.stars              = new Points();

      this.field = new YUKA.Vector3(16, 1, 16);

      this.wall        = new YUKA.Vector3(0.5, 1, 0.5);
      this.wallsMeshes = new Group();

      this.camera        = null;
      this.scene         = null;
      this.renderer      = null;
      this.userInterface = null;

      this.player   = null;
      this.controls = null;

      this.playerMesh           = null;
      this.playerProjectiles    = [];
      this.playerProjectileMesh = null;
      this.maxPlayerProjectiles = 100;

      this.enemyProjectiles                = [];
      this.enemyProjectileMesh             = null;
      this.enemyDestructibleProjectiles    = [];
      this.enemyDestructibleProjectileMesh = null;
      this.maxEnemyProjectiles             = 200;
      this.maxEnemyDestructibleProjectiles = 200;

      this.obstacles    = [];
      this.obstacleMesh = null;
      this.maxObstacles = 50;

      this.pursuers    = [];
      this.pursuerMesh = null;

      this.towers    = [];
      this.towerMesh = null;

      this.guards          = [];
      this.guardMesh       = null;
      this.protectionMesh  = null;
      this.hitMesh         = null;
      this.guardsProtected = false;

      this.assetManager    = null;
      this.animationSystem = new AnimationSystem();
      this.sceneManager    = new SceneManager(this);

      this._requestID = null;

      this._startAnimation        = startAnimation.bind(this);
      this._stopAnimation         = stopAnimation.bind(this);
      this._onContinueButtonClick = onContinueButtonClick.bind(this);
      this._onWindowResize        = onWindowResize.bind(this);
      this._onRestart             = onRestart.bind(this);
      this._onQuit                = onQuit.bind(this);

      this.ui = {
         continueButton       : document.getElementById('menu-continue'),
         restartButtonMenu    : document.getElementById('menu-restart'),
         restartButtonComplete: document.getElementById('complete-restart'),
         restartButtonGameOver: document.getElementById('gameover-restart'),
         quitButtonMenu       : document.getElementById('menu-quit'),
         quitButtonComplete   : document.getElementById('complete-quit'),
         quitButtonGameOver   : document.getElementById('gameover-quit'),
         menu                 : document.getElementById('menu'),
         levelComplete        : document.getElementById('level-complete'),
         gameComplete         : document.getElementById('game-complete'),
         gameOver             : document.getElementById('game-over'),
         stagesCleared        : document.getElementById('stages-cleared'),
         startScreen          : document.getElementById('splash-screen'),
         loadingScreen        : document.getElementById('loading-screen')
      };

   }


   init() {

      this.assetManager = new AssetManager();
      this.assetManager.init().then(() => {

         this._initEnvironment();
         this._initBackground();
         this._initPlayer();
         this._initControls();
         this._loadStage(this.currentStage);

         this.ui.startScreen.remove();

      });

   }


   update() {

      const delta = this.time.update().getDelta();

      if (this.active) {
         this.animationSystem.update(delta);
         this.controls.update(delta);
         this.entityManager.update(delta);
         this.userInterface.update(delta);

         this._enforceNonPenetrationConstraint();
         this._checkPlayerCollision();
         this._checkPlayerProjectileCollisions();
         this._checkEnemyProjectileCollisions();
         this._checkGameStatus();

         this._updateObstaclesMeshes();
         this._updateProjectileMeshes();

         this.stars.rotation.y += 0.01;

         this.renderer.render(this.scene, this.camera);

      }

   }


   addGuard(guard) {

      this.guards.push(guard);
      this.entityManager.add(guard);

      this.scene.add(guard._renderComponent);

   }


   removeGuard(guard) {

      const index = this.guards.indexOf(guard);
      this.guards.splice(index, 1);

      this.entityManager.remove(guard);
      this.scene.remove(guard._renderComponent);

   }


   addPursuer(pursuer) {

      this.pursuers.push(pursuer);
      this.entityManager.add(pursuer);

      this.scene.add(pursuer._renderComponent);

   }


   removePursuer(pursuer) {

      const index = this.pursuers.indexOf(pursuer);
      this.pursuers.splice(index, 1);

      this.entityManager.remove(pursuer);
      this.scene.remove(pursuer._renderComponent);

   }


   addTower(tower) {

      this.towers.push(tower);
      this.entityManager.add(tower);

      this.scene.add(tower._renderComponent);

   }


   removeTower(tower) {

      const index = this.towers.indexOf(tower);
      this.towers.splice(index, 1);

      this.entityManager.remove(tower);
      this.scene.remove(tower._renderComponent);

   }


   addProjectile(projectile) {

      if (projectile.isPlayerProjectile) {

         this.playerProjectiles.push(projectile);

      } else {

         if (projectile.isDestructible) {

            this.enemyDestructibleProjectiles.push(projectile);


         } else {

            this.enemyProjectiles.push(projectile);

         }

      }

      this.entityManager.add(projectile);

   }


   removeProjectile(projectile) {

      if (projectile.isPlayerProjectile) {

         const index = this.playerProjectiles.indexOf(projectile);
         this.playerProjectiles.splice(index, 1);

      } else {

         if (projectile.isDestructible) {

            const index = this.enemyDestructibleProjectiles.indexOf(projectile);
            this.enemyDestructibleProjectiles.splice(index, 1);

         } else {

            const index = this.enemyProjectiles.indexOf(projectile);
            this.enemyProjectiles.splice(index, 1);

         }

      }

      this.entityManager.remove(projectile);

   }


   addObstacle(obstacle) {

      this.obstacles.push(obstacle);
      this.entityManager.add(obstacle);

   }


   removeObstacle(obstacle) {

      const index = this.obstacles.indexOf(obstacle);
      this.obstacles.splice(index, 1);

      this.entityManager.remove(obstacle);

   }


   playAudio(audio) {

      if (audio.isPlaying === true) audio.stop();
      audio.play();

   }


   #_initUI() {

      const loadingScreen = this.ui.loadingScreen;

      loadingScreen.classList.add('fade-out');
      loadingScreen.addEventListener('transitionend', onTransitionEnd);

   }


   _initEnvironment(callback) {

      // camera
      this.camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
      this.camera.add(this.assetManager.listener);

      // scene
      this.scene = new Scene();



      // player
      this.playerMesh                  = this.assetManager.characterModels.get('Android');
      this.playerMesh.matrixAutoUpdate = false;
      this.scene.add(this.playerMesh);

      // player projectiles
      const playerProjectileGeometry = new PlaneBufferGeometry(0.2, 1);
      playerProjectileGeometry.rotateX(Math.PI * -0.5);
      const playerProjectileMaterial = new MeshBasicMaterial({color: 0xfff9c2});

      this.playerProjectileMesh = new InstancedMesh(playerProjectileGeometry, playerProjectileMaterial, this.maxPlayerProjectiles);
      this.playerProjectileMesh.instanceMatrix.setUsage(DynamicDrawUsage);
      this.playerProjectileMesh.frustumCulled = false;
      this.scene.add(this.playerProjectileMesh);

      // enemy projectile
      const enemyProjectileGeometry = new SphereBufferGeometry(0.4, 16, 16);
      enemyProjectileGeometry.rotateX(Math.PI * -0.5);
      const enemyProjectileMaterial = new MeshLambertMaterial({color: 0x43254d});

      this.enemyProjectileMesh = new InstancedMesh(enemyProjectileGeometry, enemyProjectileMaterial, this.maxEnemyProjectiles);
      this.enemyProjectileMesh.instanceMatrix.setUsage(DynamicDrawUsage);
      this.enemyProjectileMesh.frustumCulled = false;
      this.scene.add(this.enemyProjectileMesh);

      // enemy destructible projectile
      const enemyDestructibleProjectileGeometry = new SphereBufferGeometry(0.4, 16, 16);
      enemyDestructibleProjectileGeometry.rotateX(Math.PI * -0.5);
      const enemyDestructibleProjectileMaterial = new MeshLambertMaterial({color: 0xf34d08});

      this.enemyDestructibleProjectileMesh = new InstancedMesh(enemyDestructibleProjectileGeometry, enemyDestructibleProjectileMaterial, this.maxEnemyProjectiles);
      this.enemyDestructibleProjectileMesh.instanceMatrix.setUsage(DynamicDrawUsage);
      this.enemyDestructibleProjectileMesh.frustumCulled = false;
      this.scene.add(this.enemyDestructibleProjectileMesh);

      // obstacle
      const obtacleGeometry = new BoxBufferGeometry(1, 1, 1);
      const obtacleMaterial = new MeshLambertMaterial({color: 0xdedad3});

      this.obstacleMesh               = new InstancedMesh(obtacleGeometry, obtacleMaterial, this.maxObstacles);
      this.obstacleMesh.frustumCulled = false;
      this.obstacleMesh.castShadow    = true;
      this.scene.add(this.obstacleMesh);

      // pursuer enemy
      const pursuerGeometry = new PursuerGeometry();
      const pursuerMaterial = new MeshLambertMaterial({color: 0x333132});

      this.pursuerMesh                  = new Mesh(pursuerGeometry, pursuerMaterial);
      this.pursuerMesh.matrixAutoUpdate = false;
      this.pursuerMesh.castShadow       = true;

      // tower enemy
      const towerGeometry = new CylinderBufferGeometry(0.5, 0.5, 1, 16);
      const towerMaterial = new MeshLambertMaterial({color: 0x333132});

      this.towerMesh                  = new Mesh(towerGeometry, towerMaterial);
      this.towerMesh.matrixAutoUpdate = false;
      this.towerMesh.castShadow       = true;


      const guardGeometry             = new SphereBufferGeometry(0.5, 16, 16);
      const guardMaterial             = new MeshLambertMaterial({color: 0x333132});
      this.guardMesh                  = new Mesh(guardGeometry, guardMaterial);
      this.guardMesh.matrixAutoUpdate = false;
      this.guardMesh.castShadow       = true;

      // this.guardMesh.add(this.assetManager.cloneModel('guard'));

      const protectionGeometry             = new SphereBufferGeometry(0.75, 16, 16);
      const protectionMaterial             = new ShaderMaterial(ProtectionShader);
      protectionMaterial.transparent       = true;
      this.protectionMesh                  = new Mesh(protectionGeometry, protectionMaterial);
      this.protectionMesh.matrixAutoUpdate = false;
      this.protectionMesh.visible          = false;

      const hitGeometry       = new PlaneBufferGeometry(2.5, 2.5);
      const hitMaterial       = new ShaderMaterial(HitShader);
      hitMaterial.transparent = true;
      this.hitMesh            = new Mesh(hitGeometry, hitMaterial);
      this.hitMesh.visible    = false;

      // renderer
      this.renderer = new WebGLRenderer({antialias: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.outputEncoding    = sRGBEncoding;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type    = PCFSoftShadowMap;
      document.body.appendChild(this.renderer.domElement);

      // listeners
      window.addEventListener('resize', this._onWindowResize, false);
      this.ui.continueButton.addEventListener('click', this._onContinueButtonClick, false);
      this.ui.restartButtonMenu.addEventListener('click', this._onRestart, false);
      this.ui.restartButtonComplete.addEventListener('click', this._onRestart, false);
      this.ui.restartButtonGameOver.addEventListener('click', this._onRestart, false);
      this.ui.quitButtonMenu.addEventListener('click', this._onQuit, false);
      this.ui.quitButtonComplete.addEventListener('click', this._onQuit, false);
      this.ui.quitButtonGameOver.addEventListener('click', this._onQuit, false);

      this.environmentManager.init();
      this.userInterface = new InterfaceManager(this);

   }



   _initBackground(params) {
      const background_color = new Color(0x030303);
      this.environmentManager.generateBackground(background_color, true);
   }


   _initPlayer() {

      const protectionMesh    = this.protectionMesh.clone();
      protectionMesh.material = this.protectionMesh.material.clone(); // cloning a mesh does not clone its material (but we need unique uniforms!)

      this.playerMesh.add(protectionMesh)
      // this.player                = new Player(this, this.playerMesh, this.assetManager.mixers.get('Android'), this.assetManager.animations.get('Android'));
      // this.player                = new Player(this, this.playerMesh, this.assetManager.mixers.get('Android'),
      //   this.assetManager.animations.get('Android'));
      this.player                = new Player(this, this.playerMesh, this.assetManager.mixers.get('Android'),
        this.assetManager.animations.get('Android'));
      this.player.protectionMesh = protectionMesh

      // particle system
      this.scene.add(this.player.particleSystem._points);

      // audio
      const playerShot    = this.assetManager.audios.get('playerShot');
      const playerHit     = this.assetManager.audios.get('playerHit');
      const playerExplode = this.assetManager.audios.get('playerExplode');

      this.playerMesh.add(playerShot, playerHit, playerExplode);

      this.player.audios.set('playerShot', playerShot);
      this.player.audios.set('playerHit', playerHit);
      this.player.audios.set('playerExplode', playerExplode);

      this.player.setRenderComponent(this.playerMesh, sync);

      //
      this.entityManager.add(this.player);

   }


   _initControls() {

      this.controls = new PlayerControls(this.player, this.camera);
      this.controls.setPosition(new YUKA.Vector3(0, 0, 0));

      this.controls.addEventListener('lock', () => {

         this.ui.menu.classList.add('hidden');

         this.time.reset();

         this._startAnimation();

      });

      this.controls.addEventListener('unlock', () => {

         if (this.gameOver === false) {

            this.ui.menu.classList.remove('hidden');

            this._stopAnimation();

         }

      });

   }


   _createGuard(type) {
      console.log(type);
      if (!type) {
         type = GUARDTYPE.ASSAULT;
      }

      const guardMesh = this.assetManager.enemyModels.get(type);
      const mixer     = this.assetManager.animations.get(type);
      const guard     = new Guard(this, type, guardMesh);
      // console.log(guardMesh);

      const protectionMesh    = this.protectionMesh.clone();
      protectionMesh.material = this.protectionMesh.material.clone(); // cloning a mesh does not clone its material (but we need unique uniforms!)
      const hitMesh           = this.hitMesh.clone();
      hitMesh.material        = this.hitMesh.material.clone();

      guardMesh.add(protectionMesh);
      guardMesh.add(hitMesh);

      guard.setRenderComponent(guardMesh, sync);
      guard.bodyMesh       = guardMesh;
      guard.protectionMesh = protectionMesh;
      guard.hitMesh        = hitMesh;
      // console.log('guard', guard);

      const enemyShot           = this.assetManager.cloneAudio('enemyShot');
      const enemyHit            = this.assetManager.cloneAudio('enemyHit');
      const coreExplode         = this.assetManager.cloneAudio('coreExplode');
      const coreShieldHit       = this.assetManager.cloneAudio('coreShieldHit');
      const coreShieldDestroyed = this.assetManager.cloneAudio('coreShieldDestroyed');

      guardMesh.add(enemyShot);
      guardMesh.add(enemyHit);
      guardMesh.add(coreExplode);
      guardMesh.add(coreShieldHit);
      guardMesh.add(coreShieldDestroyed);

      guard.audios.set('enemyShot', enemyShot);
      guard.audios.set('enemyHit', enemyHit);
      guard.audios.set('coreExplode', coreExplode);
      guard.audios.set('coreShieldHit', coreShieldHit);
      guard.audios.set('coreShieldDestroyed', coreShieldDestroyed);

      return guard;

   }


   _createPursuer() {

      const pursuer     = new Pursuer(this);
      const pursuerMesh = this.pursuerMesh.clone();
      pursuer.setRenderComponent(pursuerMesh, sync);

      const enemyShot    = this.assetManager.cloneAudio('enemyShot');
      const enemyExplode = this.assetManager.cloneAudio('enemyExplode');

      pursuer.audios.set('enemyShot', enemyShot);
      pursuer.audios.set('enemyExplode', enemyExplode);

      pursuerMesh.add(enemyShot);
      pursuerMesh.add(enemyExplode);

      return pursuer;

   }


   _createTower() {

      const tower     = new Tower(this);
      const towerMesh = this.towerMesh.clone();
      tower.setRenderComponent(towerMesh, sync);

      const enemyShot    = this.assetManager.cloneAudio('enemyShot');
      const enemyExplode = this.assetManager.cloneAudio('enemyExplode');
      const enemyHit     = this.assetManager.cloneAudio('enemyHit');

      tower.audios.set('enemyShot', enemyShot);
      tower.audios.set('enemyExplode', enemyExplode);
      tower.audios.set('enemyHit', enemyHit);

      towerMesh.add(enemyShot);
      towerMesh.add(enemyExplode);
      towerMesh.add(enemyHit);

      return tower;

   }


   _checkPlayerCollision() {

      const player   = this.player;
      const guards   = this.guards;
      const pursuers = this.pursuers;
      const towers   = this.towers;

      if (player._GOD_MODE_ === false) {

         // perform intersection test with guards
         for (let i = 0, l = guards.length; i < l; i++) {

            const guard = guards[i];

            const squaredDistance = player.position.squaredDistanceTo(guard.position);
            const range           = player.boundingRadius + guard.boundingRadius;

            if (squaredDistance <= (range * range)) {

               if (player.obb.intersectsBoundingSphere(guard.boundingSphere) === true) {

                  // dead

                  player.healthPoints--;
                  const audio = player.audios.get('playerHit');
                  this.playAudio(audio);



                  return;

               }

            }

         }

         // perform intersection test with pursuers
         for (let i = 0, l = pursuers.length; i < l; i++) {

            const pursuer = pursuers[i];

            const squaredDistance = player.position.squaredDistanceTo(pursuer.position);
            const range           = player.boundingRadius + pursuer.boundingRadius;

            if (squaredDistance <= (range * range)) {

               if (player.obb.intersectsBoundingSphere(pursuer.boundingSphere) === true) {

                  // dead

                  player.healthPoints = 0;

                  const audio = player.audios.get('playerExplode');
                  this.playAudio(audio);
                  return;

               }

            }

         }

         // perform intersection test with towers
         for (let i = 0, l = towers.length; i < l; i++) {

            const tower = towers[i];

            const squaredDistance = player.position.squaredDistanceTo(tower.position);
            const range           = player.boundingRadius + tower.boundingRadius;

            if (squaredDistance <= (range * range)) {

               if (player.obb.intersectsBoundingSphere(tower.boundingSphere) === true) {

                  // dead

                  player.healthPoints = 0;

                  const audio = player.audios.get('playerExplode');
                  this.playAudio(audio);
                  return;

               }

            }
         }
      }

   }


   _checkPlayerProjectileCollisions() {

      const playerProjectiles = this.playerProjectiles;

      // perform intersection test of player projectiles
      for (let i = (playerProjectiles.length - 1); i >= 0; i--) {

         this._checkPlayerProjectileCollision(playerProjectiles[i]);

      }

   }


   _checkEnemyProjectileCollisions() {

      const enemyProjectiles             = this.enemyProjectiles;
      const enemyDestructibleProjectiles = this.enemyDestructibleProjectiles;

      // perform intersection test of enemy projectiles
      for (let i = (enemyProjectiles.length - 1); i >= 0; i--) {

         this._checkEnemyProjectileCollision(enemyProjectiles[i]);

      }

      for (let i = (enemyDestructibleProjectiles.length - 1); i >= 0; i--) {

         this._checkEnemyProjectileCollision(enemyDestructibleProjectiles[i]);

      }

   }


   _checkEnemyProjectileCollision(projectile) {

      const obstacles         = this.obstacles;
      const player            = this.player;
      const playerProjectiles = this.playerProjectiles;

      for (let i = 0, l = obstacles.length; i < l; i++) {

         // first test (find out how close objects are)
         const obstacle = obstacles[i];

         const squaredDistance = projectile.position.squaredDistanceTo(obstacle.position);
         const range           = projectile.boundingRadius + obstacle.boundingRadius;

         if (squaredDistance <= (range * range)) {

            // second more expensive test (only performed if objects are close enough)
            if (obstacle.obb.intersectsBoundingSphere(projectile.boundingSphere) === true) {

               this.removeProjectile(projectile);
               return;

            }

         }

      }

      if (projectile.isDestructible === true) {

         // perform intersection test with player projectiles
         for (let i = (playerProjectiles.length - 1); i >= 0; i--) {

            // first test (find out how close objects are)
            const playerProjectile = playerProjectiles[i];

            const squaredDistance = projectile.position.squaredDistanceTo(playerProjectile.position);
            const range           = projectile.boundingRadius + playerProjectile.boundingRadius;

            if (squaredDistance <= (range * range)) {

               // second more expensive test (only performed if objects are close enough)
               if (playerProjectile.obb.intersectsBoundingSphere(projectile.boundingSphere) === true) {

                  this.removeProjectile(projectile);
                  this.removeProjectile(playerProjectile);
                  return;

               }

            }

         }

      }

      // perform intersection test with player
      const squaredDistance = projectile.position.squaredDistanceTo(player.position);
      const range           = projectile.boundingRadius + player.boundingRadius;

      if (squaredDistance <= (range * range)) {

         if (player.obb.intersectsBoundingSphere(projectile.boundingSphere) === true) {

            projectile.sendMessage(player, 'hit');
            this.removeProjectile(projectile);
            return;

         }

      }

   }


   _checkPlayerProjectileCollision(playerProjectile) {

      const guards    = this.guards;
      const pursuers  = this.pursuers;
      const towers    = this.towers;
      const obstacles = this.obstacles;

      // enemies

      // guards
      for (let i = 0, l = guards.length; i < l; i++) {

         // first test (find out how close objects are)
         const guard = guards[i];

         const squaredDistance = playerProjectile.position.squaredDistanceTo(guard.position);
         const range           = playerProjectile.boundingRadius + guard.boundingRadius;

         if (squaredDistance <= (range * range)) {

            // second more expensive test (only performed if objects are close enough)
            if (playerProjectile.obb.intersectsBoundingSphere(guard.boundingSphere) === true) {

               playerProjectile.sendMessage(guard, 'hit');
               this.removeProjectile(playerProjectile);
               return;

            }

         }

      }

      // pursuers
      for (let i = 0, l = pursuers.length; i < l; i++) {

         // first test (find out how close objects are)
         const pursuer = pursuers[i];

         const squaredDistance = playerProjectile.position.squaredDistanceTo(pursuer.position);
         const range           = playerProjectile.boundingRadius + pursuer.boundingRadius;

         if (squaredDistance <= (range * range)) {

            // second more expensive test (only performed if objects are close enough)
            if (playerProjectile.obb.intersectsBoundingSphere(pursuer.boundingSphere) === true) {

               playerProjectile.sendMessage(pursuer, 'hit');
               this.removeProjectile(playerProjectile);
               return;

            }

         }

      }

      // towers
      for (let i = 0, l = towers.length; i < l; i++) {

         // first test (find out how close objects are)
         const tower = towers[i];

         const squaredDistance = playerProjectile.position.squaredDistanceTo(tower.position);
         const range           = playerProjectile.boundingRadius + tower.boundingRadius;

         if (squaredDistance <= (range * range)) {

            // second more expensive test (only performed if objects are close enough)
            if (playerProjectile.obb.intersectsBoundingSphere(tower.boundingSphere) === true) {

               playerProjectile.sendMessage(tower, 'hit', 0, playerProjectile);
               this.removeProjectile(playerProjectile);
               return;

            }

         }

      }

      // obstacles
      for (let i = 0, l = obstacles.length; i < l; i++) {

         // first test (find out how close objects are)
         const obstacle = obstacles[i];

         const squaredDistance = playerProjectile.position.squaredDistanceTo(obstacle.position);
         const range           = playerProjectile.boundingRadius + obstacle.boundingRadius;

         if (squaredDistance <= (range * range)) {

            // second more expensive test (only performed if objects are close enough)
            if (playerProjectile.obb.intersectsOBB(obstacle.obb) === true) {

               this.removeProjectile(playerProjectile);
               return;

            }

         }

      }

   }


   _checkGameStatus() {

      const player   = this.player;
      const guards   = this.guards;
      const pursuers = this.pursuers;
      const towers   = this.towers;

      if (player.healthPoints === 0) {

         this.active   = false;
         this.gameOver = true;
         this.ui.gameOver.classList.remove('hidden');
         this.controls.exit();

      } else {

         // check guard protection
         if (this.guardsProtected === true && (pursuers.length === 0 && towers.length === 0)) {

            // disable protection when all pursuers are destroyed
            this.guardsProtected = false;

            for (let i = 0, l = guards.length; i < l; i++) {

               guards[i].disableProtection();

            }

         }

         // all guards have been destroyed
         if (guards.length === 0) {

            // advance
            this.currentStage++;

            // halt simulation
            this.active = false;

            // restore hit points after clearing a stage
            this.player.heal();

            if (this.currentStage > this.maxStage) {

               // game completed
               this.gameOver = true;

               this.controls.exit();
               this.ui.gameComplete.classList.remove('hidden');

            } else {

               // load next stage
               this.ui.levelComplete.classList.remove('hidden');

               setTimeout(() => {

                  this._loadStage(this.currentStage);
                  this.ui.levelComplete.classList.add('hidden');

               }, 1000);

            }

         }

      }

   }


   _loadStage(id) {

      this._clearStage();

      this._updateMenu(id);

      this.sceneManager.load(id);

      this.active = true;

      this.userInterface._showInterface();
   }



   updateField(x, y, z) {
      this.field.set(x, y, z);
      this.environmentManager.update(x, y, z);
   }


   _updateWalls() {

      const wallGeometry = new BoxBufferGeometry(1, 1, 1);
      const wallMaterial = new MeshLambertMaterial({color: 0x8e8e8e});

      this.wallsMeshes.clear();
      for (let x = -this.field.x; x <= this.field.x; x++) {
         if (x === -this.field.x / 2 || x === this.field.x / 2) {
            for (let z = -this.field.z; z <= this.field.z; z++) {
               if (z === -this.field.z / 2 || z === this.field.z / 2) {
                  for (let i = -this.field.x / 2; i <= this.field.x / 2; i++) {
                     const wallMesh            = new Mesh(wallGeometry, wallMaterial);
                     wallMesh.matrixAutoUpdate = false;
                     wallMesh.position.set(i, 0.5, z);
                     wallMesh.updateMatrix();
                     wallMesh.castShadow    = true;
                     wallMesh.receiveShadow = true;
                     this.wallsMeshes.add(wallMesh);
                  }
               } else {
                  const wallMesh            = new Mesh(wallGeometry, wallMaterial);
                  wallMesh.matrixAutoUpdate = false;
                  wallMesh.position.set(x, 0.5, z);
                  wallMesh.updateMatrix();
                  wallMesh.castShadow    = true;
                  wallMesh.receiveShadow = true;
                  this.wallsMeshes.add(wallMesh);
               }
            }
         }
      }
      this.scene.add(this.wallsMeshes);

   }


   _updateMenu(currentStage) {

      if (currentStage > 1) {

         this.ui.continueButton.textContent = '■ Continue';

         this.ui.continueButton.classList.remove('hidden');
         this.ui.restartButtonMenu.classList.add('show-inline');

         this.ui.quitButtonMenu.classList.remove('hidden');
         this.ui.quitButtonMenu.classList.add('show-inline');

      } else {

         this.ui.continueButton.textContent = '■ Start';

         this.ui.continueButton.classList.remove('show-inline');
         this.ui.restartButtonMenu.classList.add('hidden');

         this.ui.quitButtonMenu.classList.remove('show-inline');
         this.ui.quitButtonMenu.classList.add('hidden');

      }

      this.ui.stagesCleared.textContent = currentStage - 1;

   }


   _clearStage() {

      const guards                       = this.guards;
      const pursuers                     = this.pursuers;
      const towers                       = this.towers;
      const obstacles                    = this.obstacles;
      const enemyProjectiles             = this.enemyProjectiles;
      const enemyDestructibleProjectiles = this.enemyDestructibleProjectiles;
      const playerProjectiles            = this.playerProjectiles;

      this.guardsProtected = false;

      for (let i = (guards.length - 1); i >= 0; i--) {

         this.removeGuard(guards[i]);

      }

      for (let i = (pursuers.length - 1); i >= 0; i--) {

         this.removePursuer(pursuers[i]);

      }

      for (let i = (towers.length - 1); i >= 0; i--) {

         this.removeTower(towers[i]);

      }

      for (let i = (obstacles.length - 1); i >= 0; i--) {

         this.removeObstacle(obstacles[i]);

      }

      for (let i = (enemyProjectiles.length - 1); i >= 0; i--) {

         this.removeProjectile(enemyProjectiles[i]);

      }

      for (let i = (enemyDestructibleProjectiles.length - 1); i >= 0; i--) {

         this.removeProjectile(enemyDestructibleProjectiles[i]);

      }

      for (let i = (playerProjectiles.length - 1); i >= 0; i--) {

         this.removeProjectile(playerProjectiles[i]);

      }

      this._updateObstaclesMeshes(true);

      this.player.particleSystem.clear();

   }


   _updateObstaclesMeshes(force) {

      let needsUpdate = force || false;

      const obstacleCount = this.obstacles.length;

      for (let i = 0; i < obstacleCount; i++) {

         const obstacle = this.obstacles[i];

         if (obstacle.needsUpdate === true) {

            obstacle.updateBoundingVolumes(); // ensure bounding volume is up-to-date

            this.obstacleMesh.setMatrixAt(i, obstacle.worldMatrix);
            obstacle.needsUpdate = false;
            needsUpdate          = true;

         }

      }

      if (needsUpdate === true) {

         this.obstacleMesh.count                      = obstacleCount;
         this.obstacleMesh.instanceMatrix.needsUpdate = true;

      }

   }


   _updateProjectileMeshes() {

      // player projectiles

      const playerProjectileCount = this.playerProjectiles.length;

      for (let i = 0; i < playerProjectileCount; i++) {

         const projectile = this.playerProjectiles[i];

         if (this.player.strategy === 'range') {
            this.playerProjectileMesh.setMatrixAt(i, projectile.worldMatrix);
         } else {

         }

      }

      this.playerProjectileMesh.count                      = playerProjectileCount;
      this.playerProjectileMesh.instanceMatrix.needsUpdate = true;

      // enemy projectiles

      const enemyProjectileCount = this.enemyProjectiles.length;


      for (let i = 0; i < enemyProjectileCount; i++) {

         const projectile = this.enemyProjectiles[i];
         this.enemyProjectileMesh.setMatrixAt(i, projectile.worldMatrix);

      }

      this.enemyProjectileMesh.count                      = enemyProjectileCount;
      this.enemyProjectileMesh.instanceMatrix.needsUpdate = true;

      // enemy destructible projectiles

      const enemyDestructibleProjectileCount = this.enemyDestructibleProjectiles.length;

      for (let i = 0; i < enemyDestructibleProjectileCount; i++) {

         const projectile = this.enemyDestructibleProjectiles[i];
         this.enemyDestructibleProjectileMesh.setMatrixAt(i, projectile.worldMatrix);

      }

      this.enemyDestructibleProjectileMesh.count                      = enemyDestructibleProjectileCount;
      this.enemyDestructibleProjectileMesh.instanceMatrix.needsUpdate = true;

   }


   _enforceNonPenetrationConstraint() {

      const guards    = this.guards;
      const pursuers  = this.pursuers;
      const towers    = this.towers;
      const obstacles = this.obstacles;

      // guards

      for (let i = 0, il = guards.length; i < il; i++) {

         const guard = guards[i];

         for (let j = 0, jl = guards.length; j < jl; j++) {

            const entity = guards[j];

            if (guard !== entity) {

               this._checkOverlappingEntites(guard, entity);

            }


         }

         for (let j = 0, jl = pursuers.length; j < jl; j++) {

            this._checkOverlappingEntites(guard, pursuers[j]);

         }

         for (let j = 0, jl = towers.length; j < jl; j++) {

            this._checkOverlappingEntites(guard, towers[j]);

         }

         for (let j = 0, jl = obstacles.length; j < jl; j++) {

            this._checkOverlappingEntites(guard, obstacles[j]);

         }

      }

      // pursuer

      for (let i = 0, il = pursuers.length; i < il; i++) {

         const pursuer = pursuers[i];

         for (let j = 0, jl = guards.length; j < jl; j++) {

            const entity = guards[j];

            this._checkOverlappingEntites(pursuer, entity);

         }

         for (let j = 0, jl = pursuers.length; j < jl; j++) {

            const entity = pursuers[j];

            if (pursuer !== entity) {

               this._checkOverlappingEntites(pursuer, entity);

            }

         }

         for (let j = 0, jl = towers.length; j < jl; j++) {

            this._checkOverlappingEntites(pursuer, towers[j]);

         }

         for (let j = 0, jl = obstacles.length; j < jl; j++) {

            this._checkOverlappingEntites(pursuer, obstacles[j]);

         }

      }

   }


   _checkOverlappingEntites(entity1, entity2) {

      // code based on "Programming Game AI by Example", chapter 3 section "Ensuring Zero Overlap"

      toVector.subVectors(entity1.position, entity2.position);

      const distance = toVector.length();
      const range    = entity1.boundingRadius + entity2.boundingRadius;

      const overlap = range - distance;

      if (overlap >= 0) {

         toVector.divideScalar(distance || 1); // normalize
         displacement.copy(toVector).multiplyScalar(overlap);
         entity1.position.add(displacement);

      }

   }



}



function sync(entity, renderComponent) {

   renderComponent.matrix.copy(entity.worldMatrix);

}


// function onIntroClick() {
//
//     this.controls.connect();
//
//     const context = AudioContext.getContext();
//
//     if ( context.state === 'suspended' ) context.resume();
//
// }


function onRestart() {

   this._stopAnimation();

   this.controls.connect();

   this.player.heal();

   this.gameOver = false;

   this.currentStage = 1;

   this._loadStage(this.currentStage);

   this.ui.gameComplete.classList.add('hidden');
   this.ui.gameOver.classList.add('hidden');

   const audio = this.assetManager.audios.get('buttonClick');
   this.playAudio(audio);

}


function onQuit() {

   this._stopAnimation();

   this.controls.disconnect();

   this.player                       = null;
   this.enemies                      = null;
   this.projectiles                  = null;
   this.obstacles                    = null;
   this.towers                       = null;
   this.guards                       = null;
   this.pursuers                     = null;
   this.playerProjectiles            = null;
   this.enemyProjectiles             = null;
   this.enemyDestructibleProjectiles = null;
   this.assetManager.dispose();

   this.gameOver = false;

   this.currentStage = -1;


   this.ui.gameComplete.classList.add('hidden');
   this.ui.gameOver.classList.add('hidden');
   this.ui.intro.classList.remove('hidden');

}


function onContinueButtonClick() {

   this.controls.connect();

   const audio = this.assetManager.audios.get('buttonClick');
   this.playAudio(audio);

}


function onTransitionEnd(event) {

   event.target.remove();

}


function onWindowResize() {

   this.camera.aspect = window.innerWidth / window.innerHeight;
   this.camera.updateProjectionMatrix();

   this.renderer.setSize(window.innerWidth, window.innerHeight);

}


function startAnimation() {

   this._requestID = requestAnimationFrame(this._startAnimation);

   this.update();

}


function stopAnimation() {

   cancelAnimationFrame(this._requestID);

}


export default new World();
