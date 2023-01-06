/**
 * @author MicMetzger /
 */

import * as THREE            from 'three';
import {FBXLoader}           from "three/examples/jsm/loaders/FBXLoader.js";
import {OBJLoader}           from "three/examples/jsm/loaders/OBJLoader.js";
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {GLTFLoader}          from 'three/examples/jsm/loaders/GLTFLoader.js';
import {dumpObject}          from '../etc/Utilities.js';



class AssetManager {
   /**
    *
    *
    */
   constructor() {

      this.loadingManager = new THREE.LoadingManager();

      this.objectLoader  = new OBJLoader(this.loadingManager);
      this.gltfLoader    = new GLTFLoader(this.loadingManager);
      this.fbxLoader     = new FBXLoader(this.loadingManager);
      this.jsonLoader    = new THREE.FileLoader(this.loadingManager);
      this.audioLoader   = new THREE.AudioLoader(this.loadingManager);
      this.fontLoader    = new THREE.FontLoader(this.loadingManager);
      this.textureLoader = new THREE.TextureLoader(this.loadingManager);
      this.listener      = new THREE.AudioListener();

      this.animations = new Map();
      this.mixers     = new Map();
      this.audios     = new Map();
      this.textures   = new Map();
      this.fonts      = new Map();

      this.characterModels = new Map();
      this.enemyModels     = new Map();
      this.npcModels       = new Map();

      this.items     = new Map();
      this.weapons   = new Map();
      this.props     = new Map();
      this.interiors = new Map();

      this.descriptors = new Map();

   }


   init() {

      this._loadAudios();
      this._loadFonts();
      this._loadCharacterModels();
      this._loadEnemyModels();
      this._loadItemModels();
      this._loadTextures();
      this._loadWeaponModels();
      this._loadPropModels();
      this._loadInteriorModels();

      const loadingManager = this.loadingManager;

      return new Promise((resolve) => {

         loadingManager.onLoad = () => {
            // this._itemsLoaded();

            setTimeout(() => {

               resolve();

            }, 100);

         };

      });

   }


   _assetsLoading() {

      console.log('Items Loading');
      document.getElementById('loading-screen').classList.remove('loaded');
      document.getElementById('loading-screen').classList.add('loading');

   }


   _assetsLoaded() {

      console.log('Items Loaded');
      document.getElementById('loading-screen').classList.remove('loading');
      document.getElementById('loading-screen').classList.add('loaded');

   }


   getAnimation(type, name) {
      var result;
      this.animations.get(type).forEach((animation) => {
         if (animation.name === name) {
            result = animation;
         }
      });
      if (result == null) {
         console.error("animation: " + name + " cannot be found!")
      }
      return result
   }


   cloneAudio(id) {

      const source = this.audios.get(id);

      const audio  = new source.constructor(source.listener);
      audio.buffer = source.buffer;
      audio.setRefDistance(source.getRefDistance());
      audio.setVolume(source.getVolume());

      return audio;

   }


   cloneModel(id) {

      const source = this.characterModels.get(id);

      console.log(source);

      return source;

   }


   _loadTextures() {

      const textureLoader = this.textureLoader;
      const textures      = this.textures;

      textureLoader.load('./textures/star.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         textures.set('star', texture);
      });

      textureLoader.load('./textures/quad.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         textures.set('quad', texture);
      });

      textureLoader.load('./textures/WoodFloor.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         textures.set('woodFloor', texture);
      });

      textureLoader.load('./textures/Grass.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         texture.repeat.set(100, 100);
         textures.set('grass', texture);
      });

      textureLoader.load('./textures/Grass_1.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         texture.repeat.set(100, 100);
         textures.set('grass1', texture);
      });

      textureLoader.load('./textures/Bush_Leaves.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         texture.repeat.set(100, 100);
         textures.set('bushLeaves', texture);
      });

      textureLoader.load('./textures/Rocks.png', (texture) => {
         texture.wrapS = THREE.RepeatWrapping;
         texture.wrapT = THREE.RepeatWrapping;
         texture.repeat.set(100, 100);
         textures.set('rocks', texture);
      });

      // Tree Bark
      textureLoader.load('./textures/NormalTree_Bark.png', (texture) => {
         textureLoader.load('./textures/NormalTree_Bark_Normal.png', (normalMap) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(100, 100);
            normalMap.wrapS = THREE.RepeatWrapping;
            normalMap.wrapT = THREE.RepeatWrapping;
            normalMap.repeat.set(100, 100);
            textures.set('treeBark', {
               map      : texture,
               normalMap: normalMap
            });
         });
      });


   }


   _loadAudios() {

      const audioLoader = this.audioLoader;
      const audios      = this.audios;
      const listener    = this.listener;

      const refDistance = 20;

      const playerShot = new THREE.PositionalAudio(listener);
      playerShot.setRefDistance(refDistance);
      const playerHit = new THREE.PositionalAudio(listener);
      playerHit.setRefDistance(refDistance);
      const playerExplode = new THREE.PositionalAudio(listener);
      playerExplode.setRefDistance(refDistance);
      const enemyShot = new THREE.PositionalAudio(listener);
      enemyShot.setRefDistance(refDistance);
      enemyShot.setVolume(0.3);
      const enemyHit = new THREE.PositionalAudio(listener);
      enemyHit.setRefDistance(refDistance);
      const coreExplode = new THREE.PositionalAudio(listener);
      coreExplode.setRefDistance(refDistance);
      const coreShieldHit = new THREE.PositionalAudio(listener);
      coreShieldHit.setRefDistance(refDistance);
      const coreShieldDestroyed = new THREE.PositionalAudio(listener);
      coreShieldDestroyed.setRefDistance(refDistance);
      const enemyExplode = new THREE.PositionalAudio(listener);
      enemyExplode.setRefDistance(refDistance);
      const playerSwing = new THREE.PositionalAudio(listener);
      playerSwing.setRefDistance(refDistance);
      const playerHeavySwing = new THREE.PositionalAudio(listener);
      playerHeavySwing.setRefDistance(refDistance);
      const playerRoll = new THREE.PositionalAudio(listener);
      playerRoll.setRefDistance(refDistance);
      // const fleshHit = new THREE.PositionalAudio(listener);
      // fleshHit.setRefDistance(refDistance);

      const buttonClick = new THREE.Audio(listener);
      buttonClick.setVolume(0.5);

      audioLoader.load('./audio/playerShot.ogg', buffer => playerShot.setBuffer(buffer));
      audioLoader.load('./audio/playerHit.ogg', buffer => playerHit.setBuffer(buffer));
      audioLoader.load('./audio/playerExplode.ogg', buffer => playerExplode.setBuffer(buffer));
      audioLoader.load('./audio/enemyShot.ogg', buffer => enemyShot.setBuffer(buffer));
      audioLoader.load('./audio/enemyHit.ogg', buffer => enemyHit.setBuffer(buffer));
      audioLoader.load('./audio/coreExplode.ogg', buffer => coreExplode.setBuffer(buffer));
      audioLoader.load('./audio/coreShieldHit.ogg', buffer => coreShieldHit.setBuffer(buffer));
      audioLoader.load('./audio/coreShieldDestroyed.ogg', buffer => coreShieldDestroyed.setBuffer(buffer));
      audioLoader.load('./audio/enemyExplode.ogg', buffer => enemyExplode.setBuffer(buffer));
      audioLoader.load('./audio/buttonClick.ogg', buffer => buttonClick.setBuffer(buffer));
      audioLoader.load('./audio/playerSwing.ogg', buffer => playerSwing.setBuffer(buffer));
      audioLoader.load('./audio/playerHeavySwing.ogg', buffer => playerHeavySwing.setBuffer(buffer));
      audioLoader.load('./audio/playerRoll.ogg', buffer => playerRoll.setBuffer(buffer));
      // audioLoader.load('./audio/fleshHit.ogg', buffer => fleshHit.setBuffer(buffer));

      audios.set('playerShot', playerShot);
      audios.set('playerHit', playerHit);
      audios.set('playerExplode', playerExplode);
      audios.set('enemyShot', enemyShot);
      audios.set('enemyHit', enemyHit);
      audios.set('coreExplode', coreExplode);
      audios.set('coreShieldHit', coreShieldHit);
      audios.set('coreShieldDestroyed', coreShieldDestroyed);
      audios.set('enemyExplode', enemyExplode);
      audios.set('buttonClick', buttonClick);
      audios.set('playerSwing', playerSwing);
      audios.set('playerHeavySwing', playerHeavySwing);
      audios.set('playerRoll', playerRoll);
      // audios.set('fleshHit', fleshHit);

   }


   _loadFonts() {

      const fontLoader = this.fontLoader;
      const fonts      = this.fonts;

      fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => fonts.set('helvetiker', font));
      fontLoader.load('./fonts/gentilis_bold.typeface.json', font => fonts.set('gentilis', font));

   }


   _loadEnemyModels() {
      const gltfLoader    = this.gltfLoader;
      const textureLoader = this.textureLoader;
      const models        = this.enemyModels;
      const animations    = this.animations;

      // Zombie
      gltfLoader.load('./models/enemies/Zombie.glb', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }

         clone.scene.scale.set(0.3, 0.3, 0.3);
         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            if (node.isBone) {
               cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
               cloneSkinnedMeshes[node.name] = node;
            }
         });

         for (let name in cloneSkinnedMeshes) {
            const cloneSMesh = cloneSkinnedMeshes[name];
            const skeleton   = cloneSMesh.skeleton;

            const orderedCloneBone = [];

            for (let i = 0; i < skeleton.bones.length; i++) {
               const cloneBone = cloneBones[skeleton.bones[i].name];
               orderedCloneBone.push(cloneBone);
            }

            cloneSMesh.bind(
              new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
              cloneSMesh.matrixWorld
            );
         }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

         const biteClip   = clone.animations[0];
         const biteAction = mixer.clipAction(biteClip);
         biteAction.play();
         biteAction.enabled = false;

         const crawlClip   = clone.animations[1];
         const crawlAction = mixer.clipAction(crawlClip);
         crawlAction.play();
         crawlAction.enabled = false;

         const idleClip   = clone.animations[2];
         const idleAction = mixer.clipAction(idleClip);
         idleAction.play();
         idleAction.enabled = false;

         const runClip   = clone.animations[3];
         const runAction = mixer.clipAction(runClip);
         runAction.play();
         runAction.enabled = false;

         const walkClip   = clone.animations[4];
         const walkAction = mixer.clipAction(walkClip);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('bite', {clip: biteClip, action: biteAction});
         animations.set('crawl', {clip: crawlClip, action: crawlAction});
         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('run', {clip: runClip, action: runAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Zombie';
         this.animations.set('Zombie', animations);
         this.mixers.set('Zombie', mixer);
         this.enemyModels.set('Zombie', clone.scene);
      });


      // Swat Officer model
      gltfLoader.load('./models/enemies/swat.glb', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            if (node.isBone) {
               cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
               cloneSkinnedMeshes[node.name] = node;
            }
         });

         for (let name in cloneSkinnedMeshes) {
            // const SMesh      = skinnedMeshes[name];
            const cloneSMesh = cloneSkinnedMeshes[name];
            const skeleton   = cloneSMesh.skeleton;

            const orderedCloneBone = [];

            for (let i = 0; i < skeleton.bones.length; i++) {
               const cloneBone = cloneBones[skeleton.bones[i].name];
               orderedCloneBone.push(cloneBone);
            }

            cloneSMesh.bind(
              new THREE.Skeleton(orderedCloneBone, skeleton.boneInverses),
              cloneSMesh.matrixWorld
            );
         }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();
         // const animations = {};

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);
         deathAction.play();
         deathAction.enabled = false;

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);
         shootAction.play();
         shootAction.enabled = false;

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);
         hitAction.play();
         hitAction.enabled = false;

         const idleClip   = clone.animations[4];
         const idleAction = mixer.clipAction(idleClip);
         idleAction.play();
         idleAction.enabled = false;

         const idleGunPointClip   = clone.animations[6];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         idleGunPointAction.play();
         idleGunPointAction.enabled = false;

         const idleGunShootClip   = clone.animations[7];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         idleGunShootAction.play();
         idleGunShootAction.enabled = false;

         const idleMeleeClip   = clone.animations[9];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         idleMeleeAction.play();
         idleMeleeAction.enabled = false;

         const interactClip   = clone.animations[10];
         const interactAction = mixer.clipAction(interactClip);
         interactAction.play();
         interactAction.enabled = false;

         const rollClip   = clone.animations[15];
         const rollAction = mixer.clipAction(rollClip);
         rollAction.play();
         rollAction.enabled = false;

         const runClip   = clone.animations[16];
         const runAction = mixer.clipAction(runClip);
         runAction.play();
         runAction.enabled = false;

         const runBackClip   = clone.animations[17];
         const runBackAction = mixer.clipAction(runBackClip);
         runBackAction.play();
         runBackAction.enabled = false;

         const runLeftClip   = clone.animations[18];
         const runLeftAction = mixer.clipAction(runLeftClip);
         runLeftAction.play();
         runLeftAction.enabled = false;

         const runRightClip   = clone.animations[19];
         const runRightAction = mixer.clipAction(runRightClip);
         runRightAction.play();
         runRightAction.enabled = false;

         const runShootClip   = clone.animations[20];
         const runShootAction = mixer.clipAction(runShootClip);
         runShootAction.play();
         runShootAction.enabled = false;

         const slashClip   = clone.animations[21];
         const slashAction = mixer.clipAction(slashClip);
         slashAction.play();
         slashAction.enabled = false;

         const walkClip   = clone.animations[22];
         const walkAction = mixer.clipAction(walkClip);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hit', {clip: hitClip, action: hitAction});
         animations.set('idleGunPoint', {clip: idleGunPointClip, action: idleGunPointAction});
         animations.set('idleGunShoot', {clip: idleGunShootClip, action: idleGunShootAction});
         animations.set('idleMelee', {clip: idleMeleeClip, action: idleMeleeAction});
         animations.set('interact', {clip: interactClip, action: interactAction});
         animations.set('roll', {clip: rollClip, action: rollAction});
         animations.set('run', {clip: runClip, action: runAction});
         animations.set('runBack', {clip: runBackClip, action: runBackAction});
         animations.set('runLeft', {clip: runLeftClip, action: runLeftAction});
         animations.set('runRight', {clip: runRightClip, action: runRightAction});
         animations.set('runShoot', {clip: runShootClip, action: runShootAction});
         animations.set('slash', {clip: slashClip, action: slashAction});
         animations.set('walk', {clip: walkClip, action: walkAction});


         clone.name = 'assault_guard';
         this.animations.set('assault_guard', animations);
         this.mixers.set('assault_guard', mixer);
         this.enemyModels.set('assault_guard', clone.scene);

      });


   }


   _loadCharacterModels() {

      const gltfLoader    = this.gltfLoader;
      const textureLoader = this.textureLoader;
      const models        = this.characterModels;
      const animations    = this.animations;

      // Wanderer Player model

      // Android Player model
      gltfLoader.load('./models/player/Android.gltf', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(function (child) {
            if ((child in THREE.SkinnedMesh) && (child.name in cloneBones)) {
                cloneSkinnedMeshes[child.name] = child;
            }
          });

          for (let name in cloneBones) {
            cloneSkinnedMeshes[name].bind(
              new THREE.Skeleton(cloneBones[name], cloneSkinnedMeshes[name].skeleton.boneInverses),
              cloneSkinnedMeshes[name].matrixWorld
            );
          }

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);
         deathAction.play();
         deathAction.enabled = false;

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);
         shootAction.play();
         shootAction.enabled = false;

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);
         hitAction.play();
         hitAction.enabled = false;

         const idleClip   = clone.animations[6];
         const idleAction = mixer.clipAction(idleClip);
         idleAction.play();
         idleAction.enabled = false;

         const idleGunPointClip   = clone.animations[4];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         idleGunPointAction.play();
         idleGunPointAction.enabled = false;

         const idleGunShootClip   = clone.animations[5];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         idleGunShootAction.play();
         idleGunShootAction.enabled = false;

         const idleMeleeClip   = clone.animations[7];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         idleMeleeAction.play();
         idleMeleeAction.enabled = false;

         const interactClip   = clone.animations[8];
         const interactAction = mixer.clipAction(interactClip);
         interactAction.play();
         interactAction.enabled = false;

         const rollClip   = clone.animations[13];
         const rollAction = mixer.clipAction(rollClip);
         rollAction.play();
         rollAction.enabled = false;

         const runClip   = clone.animations[14];
         const runAction = mixer.clipAction(runClip);
         runAction.play();
         runAction.enabled = false;

         const runBackClip   = clone.animations[15];
         const runBackAction = mixer.clipAction(runBackClip);
         runBackAction.play();
         runBackAction.enabled = false;

         const runLeftClip   = clone.animations[16];
         const runLeftAction = mixer.clipAction(runLeftClip);
         runLeftAction.play();
         runLeftAction.enabled = false;

         const runRightClip   = clone.animations[17];
         const runRightAction = mixer.clipAction(runRightClip);
         runRightAction.play();
         runRightAction.enabled = false;

         const runShootClip   = clone.animations[18];
         const runShootAction = mixer.clipAction(runShootClip);
         runShootAction.play();
         runShootAction.enabled = false;

         const slashClip   = clone.animations[19];
         const slashAction = mixer.clipAction(slashClip);
         slashAction.play();
         slashAction.enabled = false;

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);
         walkAction.play();
         walkAction.enabled = false;

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hit', {clip: hitClip, action: hitAction});
         animations.set('idleGunPoint', {clip: idleGunPointClip, action: idleGunPointAction});
         animations.set('idleGunShoot', {clip: idleGunShootClip, action: idleGunShootAction});
         animations.set('idleMelee', {clip: idleMeleeClip, action: idleMeleeAction});
         animations.set('interact', {clip: interactClip, action: interactAction});
         animations.set('roll', {clip: rollClip, action: rollAction});
         animations.set('run', {clip: runClip, action: runAction});
         animations.set('runBack', {clip: runBackClip, action: runBackAction});
         animations.set('runLeft', {clip: runLeftClip, action: runLeftAction});
         animations.set('runRight', {clip: runRightClip, action: runRightAction});
         animations.set('runShoot', {clip: runShootClip, action: runShootAction});
         animations.set('slash', {clip: slashClip, action: slashAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Android';
         this.animations.set('Android', animations);
         this.mixers.set('Android', mixer);
         this.characterModels.set('Android', clone.scene);
      })



   }


   _loadItemModels() {
      const gltfLoader = this.gltfLoader;
      const items      = this.items;

      // Collectible Health
      gltfLoader.load('./models/pickups/PickupHealth.glb', (gltf) => {
         const healthpackMesh            = gltf.scene;
         healthpackMesh.matrixAutoUpdate = false;
         items.set('pickupHealth', healthpackMesh);
      });

      // Collectible Heart
      gltfLoader.load('./models/pickups/PickupHeart.glb', (gltf) => {
         const heartMesh            = gltf.scene;
         heartMesh.matrixAutoUpdate = false;
         items.set('pickupHeart', heartMesh);
      });

      // Collectible Tank
      gltfLoader.load('./models/pickups/PickupTank.glb', (gltf) => {
         const tankMesh            = gltf.scene;
         tankMesh.matrixAutoUpdate = false;
         items.set('pickupTank', tankMesh);
      });

   }


   _loadWeaponModels() {
      const gltfLoader = this.gltfLoader;
      const weapons    = this.weapons;

      // Energy Pistol
      gltfLoader.load('./models/weapons/EnergyPistol.glb', (gltf) => {
         const pistolMesh            = gltf.scene;
         pistolMesh.matrixAutoUpdate = false;
         weapons.set('pistol', pistolMesh);
      });

      // Long Pistol
      gltfLoader.load('./models/weapons/LongPistol.glb', (gltf) => {
         const longPistolMesh            = gltf.scene;
         longPistolMesh.matrixAutoUpdate = false;
         weapons.set('longPistol', longPistolMesh);
      });

      // Lightning Gun
      gltfLoader.load('./models/weapons/LightningGun.glb', (gltf) => {
         const lightningGunMesh            = gltf.scene;
         lightningGunMesh.matrixAutoUpdate = false;
         weapons.set('lightningGun', lightningGunMesh);
      });

   }


   _loadPropModels() {
      const gltfLoader = this.gltfLoader;
      const props      = this.props;

      // Space Station
      gltfLoader.load('./models/environment/Apartment.glb', (gltf) => {
         const apartment            = gltf.scene;
         apartment.matrixAutoUpdate = false;
         props.set('Apartment', apartment);
      });


   }


   _loadInteriorModels() {
      const objectLoader = this.objectLoader;
      const interiors    = this.interiors;

      const floorPath = './materials/floor/FloorTile_';

      // Floors 1
      objectLoader.load('./materials/floor/FloorTile_Basic.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('BasicFloor', object);
      });

      // Floors 2
      objectLoader.load(floorPath + 'Basic2.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('BasicFloor2', object);
      });

      // Floors Empty
      objectLoader.load(floorPath + 'Empty.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('EmptyFloor', object);
      });

      // Floors Corner
      objectLoader.load(floorPath + 'Corner.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('CornerFloor', object);
      });

      // Floors Inner Corner
      objectLoader.load(floorPath + 'InnerCorner.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('InnerCornerFloor', object);
      });

      // Floors Double Hallway
      objectLoader.load(floorPath + 'Double_Hallway.obj', (object) => {

         object.matrixAutoUpdate = false;
         interiors.set('DoubleHallwayFloor', object);
      });


      // Walls
      const wallPath = './materials/wall/Wall_';

      let i = 1;
      for (i; i <= 5; i++) {
         objectLoader.load(wallPath + i + '.obj', (object) => {

            object.matrixAutoUpdate = false;
            interiors.set('BasicWall' + i, object);
         });
      }

      // Wall Empty
      objectLoader.load(wallPath + 'Empty.obj', (object) => {


         object.matrixAutoUpdate = false;
         interiors.set('EmptyWall', object);
      });

   }



}



export {AssetManager};
