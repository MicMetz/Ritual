/**
 * @author MicMetzger /
 */

import {
   AnimationMixer, AudioLoader, FileLoader, LoadingManager, LoopOnce, PositionalAudio, RepeatWrapping, Skeleton, Texture, TextureLoader, Audio
}                   from "three";
import * as THREE   from 'three';
import {FontLoader} from "three/addons/loaders/FontLoader.js";
import {FBXLoader}  from "three/examples/jsm/loaders/FBXLoader.js";
import {OBJLoader}  from "three/examples/jsm/loaders/OBJLoader.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {dumpObject} from '../etc/Utilities.js';



class AssetManager {
   /**
    * @description Asset manager class.
    * @param world {World} - World instance.
    * @constructor
    */
   constructor(world) {

      this.world          = world;
      this.loadingManager = new LoadingManager();

      // @description Loading manager loaders. (THREE.Loaders)
      this.objectLoader  = new OBJLoader(this.loadingManager);
      this.gltfLoader    = new GLTFLoader(this.loadingManager);
      this.fbxLoader     = new FBXLoader(this.loadingManager);
      this.fontLoader    = new FontLoader(this.loadingManager);
      this.textureLoader = new TextureLoader(this.loadingManager);
      this.jsonLoader    = new THREE.FileLoader(this.loadingManager);
      this.audioLoader   = new THREE.AudioLoader(this.loadingManager);
      this.listener      = new THREE.AudioListener();

      // @description Loading manager asset containers. (Maps)
      this.animations      = new Map();
      this.mixers          = new Map();
      this.audios          = new Map();
      this.textures        = new Map();
      this.fonts           = new Map();
      // --------------------------------------------
      this.characterModels = new Map();
      this.enemyModels     = new Map();
      this.npcModels       = new Map();
      // --------------------------------------------
      this.items           = new Map();
      this.weapons         = new Map();
      this.props           = new Map();
      this.interiors       = new Map();
      this.exteriors       = new Map();
      this.descriptors     = new Map();

   }


   /**
    * @description Public method to initialize asset manager.
    * @returns {Promise<unknown>}
    */
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

            setTimeout(() => {

               resolve();

            }, 100);

         };

      });

   }


   /**
    * @description Loading screening assets currently loading callback.
    * @private
    */
   _assetsLoading() {

      console.log('Items Loading');
      document.getElementById('loading-screen').classList.remove('loaded');
      document.getElementById('loading-screen').classList.add('loading');

   }


   /**
    * @description Loading screen assets loaded callback.
    * @private
    */
   _assetsLoaded() {

      console.log('Items Loaded');
      document.getElementById('loading-screen').classList.remove('loading');
      document.getElementById('loading-screen').classList.add('loaded');

   }


   /**
    * @description Produce animation mixer for a model.
    * @param type - type of model to get animation mixer for
    * @param name - name of model to get animation mixer for
    * @returns {*} - animation mixer for model
    */
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


   /**
    * @description Produces a clone of an audio clip from cache.
    * @param id - id of audio clip to clone
    * @returns {*} - clone of audio clip
    */
   cloneAudio(id) {

      const source = this.audios.get(id);

      const audio  = new source.constructor(source.listener);
      audio.buffer = source.buffer;
      audio.setRefDistance(source.getRefDistance());
      audio.setVolume(source.getVolume());

      return audio;

   }


   /**
    * @description Produces a clone of the model from cache.
    * @param id - id of model to clone
    * @returns {any}
    */
   cloneModel(id) {

      const source = this.characterModels.get(id);

      console.log(source);

      return source;

   }


   /**
    * @description Load all materials
    * @private
    */
   _loadTextures() {

      const textureLoader             = this.textureLoader;
      const textures                  = this.textures;
      const timesToRepeatHorizontally = 0
      const timesToRepeatVertically   = 0

      textureLoader.load('./textures/star.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('star', texture);
      });

      textureLoader.load('./textures/quad.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('quad', texture);
      });

      textureLoader.load('./textures/carbon/WoodFloor.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('woodFloor', texture);
      });

      textureLoader.load('./textures/carbon/Grass.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('Grass', texture);
      });

      textureLoader.load('./textures/Summer_Grass_A.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('SummerGrass', texture);
      });

      textureLoader.load('./textures/Summer_Dirt_A.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('SummerDirt', texture);
      });

      textureLoader.load('./textures/Summer_Moss.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('SummerMoss', texture);
      });

      textureLoader.load('./textures/Summer_Mud_A.png', (textureA) => {
         textureLoader.load('./textures/Summer_Mud_B.png', (textureB) => {
            const texture        = new Texture();
            texture.image        = textureA.image;
            texture.image.height = textureA.image.height + textureB.image.height;
            texture.image.width  = textureA.image.width;
            texture.image.data   = new Uint8Array(texture.image.width * texture.image.height * 4);
            texture.image.data.set(textureA.image.data);
            // texture.image.data.set(textureB.image.data, textureA.image.data.length);
            texture.needsUpdate = true;

            texture.repeat.x = 1;
            texture.repeat.y = 1;

            textures.set('SummerMud', texture);
         });
      });

      textureLoader.load('./textures/carbon/Bush_Leaves.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('BushLeaves', texture);
      });

      textureLoader.load('./textures/Rocks.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('rocks', texture);
      });

      textureLoader.load('./textures/carbon/Flowers.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;
         texture.wrapS    = RepeatWrapping;

         textures.set('flowers', texture);
      });

      // Tree Bark
      textureLoader.load('./textures/carbon/NormalTree_Bark.png', (texture) => {
         textureLoader.load('./textures/carbon/NormalTree_Bark_Normal.png', (normalMap) => {
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;

            texture.repeat.set(100, 100);
            normalMap.wrapS = RepeatWrapping;
            normalMap.wrapT = RepeatWrapping;

            normalMap.repeat.set(100, 100);
            textures.set('treeBark', {
               map: texture, normalMap: normalMap
            });
         });
      });

   }


   /**
    * @description Load all the audio files
    * @private
    */
   _loadAudios() {

      const audioLoader = this.audioLoader;
      const audios      = this.audios;
      const listener    = this.listener;

      const refDistance = 20;

      const playerShot = new PositionalAudio(listener);
      playerShot.setRefDistance(refDistance);
      const playerHit = new PositionalAudio(listener);
      playerHit.setRefDistance(refDistance);
      const playerExplode = new PositionalAudio(listener);
      playerExplode.setRefDistance(refDistance);
      const enemyShot = new PositionalAudio(listener);
      enemyShot.setRefDistance(refDistance);
      enemyShot.setVolume(0.3);
      const enemyHit = new PositionalAudio(listener);
      enemyHit.setRefDistance(refDistance);
      const coreExplode = new PositionalAudio(listener);
      coreExplode.setRefDistance(refDistance);
      const coreShieldHit = new PositionalAudio(listener);
      coreShieldHit.setRefDistance(refDistance);
      const coreShieldDestroyed = new PositionalAudio(listener);
      coreShieldDestroyed.setRefDistance(refDistance);
      const enemyExplode = new PositionalAudio(listener);
      enemyExplode.setRefDistance(refDistance);
      const playerSwing = new PositionalAudio(listener);
      playerSwing.setRefDistance(refDistance);
      const playerHeavySwing = new PositionalAudio(listener);
      playerHeavySwing.setRefDistance(refDistance);
      const playerRoll = new PositionalAudio(listener);
      playerRoll.setRefDistance(refDistance);
      const fleshHit = new PositionalAudio(listener);
      fleshHit.setRefDistance(refDistance);

      const buttonClick = new Audio(listener);
      buttonClick.setVolume(0.5);

      audioLoader.load('./audio/playerShot.ogg', buffer => playerShot.setBuffer(buffer), null, () => { console.log('error loading audio: playerShot'); });
      audioLoader.load('./audio/playerHit.ogg', buffer => playerHit.setBuffer(buffer), null, () => { console.log('error loading audio: playerHit'); });
      audioLoader.load('./audio/playerExplode.ogg', buffer => playerExplode.setBuffer(buffer), null, () => { console.log('error loading audio: playerExplode'); });
      audioLoader.load('./audio/enemyShot.ogg', buffer => enemyShot.setBuffer(buffer), null, () => { console.log('error loading audio: enemyShot'); });
      audioLoader.load('./audio/enemyHit.ogg', buffer => enemyHit.setBuffer(buffer), null, () => { console.log('error loading audio: enemyHit'); });
      audioLoader.load('./audio/coreExplode.ogg', buffer => coreExplode.setBuffer(buffer), null, () => { console.log('error loading audio: coreExplode'); });
      audioLoader.load('./audio/coreShieldHit.ogg', buffer => coreShieldHit.setBuffer(buffer), null, () => { console.log('error loading audio: coreShieldHit'); });
      audioLoader.load('./audio/coreShieldDestroyed.ogg', buffer => coreShieldDestroyed.setBuffer(buffer), null, () => { console.log('error loading audio: coreShieldDestroyed'); });
      audioLoader.load('./audio/enemyExplode.ogg', buffer => enemyExplode.setBuffer(buffer), null, () => { console.log('error loading audio: enemyExplode'); });
      audioLoader.load('./audio/buttonClick.ogg', buffer => buttonClick.setBuffer(buffer), null, () => { console.log('error loading audio: buttonClick'); });
      audioLoader.load('./audio/playerSwing.ogg', buffer => playerSwing.setBuffer(buffer), null, () => { console.log('error loading audio: playerSwing'); });
      audioLoader.load('./audio/playerHeavySwing.ogg', buffer => playerHeavySwing.setBuffer(buffer), null, () => { console.log('error loading audio: playerHeavySwing'); });
      audioLoader.load('./audio/playerRoll.ogg', buffer => playerRoll.setBuffer(buffer), null, () => { console.log('error loading audio: playerRoll'); });
      audioLoader.load('./audio/poly_gore01.wav', buffer => fleshHit.setBuffer(buffer), null, () => { console.log('error loading audio: fleshHit'); });

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
      audios.set('fleshHit', fleshHit);

   }


   /**
    * @description Load fonts
    * @private
    */
   _loadFonts() {

      const fontLoader = this.fontLoader;
      const fonts      = this.fonts;

      fontLoader.load('./fonts/helvetiker_regular.typeface.json', font => fonts.set('helvetiker', font));
      fontLoader.load('./fonts/gentilis_bold.typeface.json', font => fonts.set('gentilis', font));

   }


   /**
    * @description Load enemy models
    * @private
    */
   _loadEnemyModels() {
      const gltfLoader    = this.gltfLoader;
      const textureLoader = this.textureLoader;
      const models        = this.enemyModels;
      const animations    = this.animations;

      // ------------------------------------------------------------
      // Zombie
      gltfLoader.load('./models/enemies/Zombie.glb', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const biteClip   = clone.animations[0];
         const biteAction = mixer.clipAction(biteClip);

         const crawlClip   = clone.animations[1];
         const crawlAction = mixer.clipAction(crawlClip);

         const idleClip   = clone.animations[2];
         const idleAction = mixer.clipAction(idleClip);

         const runClip   = clone.animations[3];
         const runAction = mixer.clipAction(runClip);

         const walkClip   = clone.animations[4];
         const walkAction = mixer.clipAction(walkClip);

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
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Swat Officer model
      gltfLoader.load('./models/enemies/swat.glb', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);

         const idleClip   = clone.animations[4];
         const idleAction = mixer.clipAction(idleClip);

         const idleGunPointClip   = clone.animations[6];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);

         const idleGunShootClip   = clone.animations[7];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);

         const idleMeleeClip   = clone.animations[9];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);

         const interactClip   = clone.animations[10];
         const interactAction = mixer.clipAction(interactClip);

         const rollClip   = clone.animations[15];
         const rollAction = mixer.clipAction(rollClip);

         const runClip   = clone.animations[16];
         const runAction = mixer.clipAction(runClip);

         const runBackClip   = clone.animations[17];
         const runBackAction = mixer.clipAction(runBackClip);

         const runLeftClip   = clone.animations[18];
         const runLeftAction = mixer.clipAction(runLeftClip);

         const runRightClip   = clone.animations[19];
         const runRightAction = mixer.clipAction(runRightClip);

         const runShootClip   = clone.animations[20];
         const runShootAction = mixer.clipAction(runShootClip);

         const meleeClip   = clone.animations[21];
         const meleeAction = mixer.clipAction(meleeClip);

         const walkClip   = clone.animations[22];
         const walkAction = mixer.clipAction(walkClip);

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hitTaken', {clip: hitClip, action: hitAction});
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
         animations.set('melee', {clip: meleeClip, action: meleeAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'assault_guard';
         this.animations.set('assault_guard', animations);
         this.mixers.set('assault_guard', mixer);
         this.enemyModels.set('assault_guard', clone.scene);

      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Task Force Operator
      gltfLoader.load('./models/enemies/TaskForceOperator.glb', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         clone.name = 'task_force';
         this.animations.set('task_force', animations);
         this.mixers.set('task_force', mixer);
         this.enemyModels.set('task_force', clone.scene);

      });
      // ------------------------------------------------------------

   }


   /**
    * @description Load all character models
    * @private
    */
   _loadCharacterModels() {

      const gltfLoader = this.gltfLoader;
      const fbxLoader  = this.fbxLoader;

      // ------------------------------------------------------------
      // Female Survivor Player Model (Default)
      gltfLoader.load('./models/player/Woman2.glb', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);

         const idleClip   = clone.animations[6];
         const idleAction = mixer.clipAction(idleClip);

         const idleGunPointClip   = clone.animations[4];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);

         const idleGunShootClip   = clone.animations[5];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);

         const idleMeleeClip   = clone.animations[7];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);

         const interactClip   = clone.animations[8];
         const interactAction = mixer.clipAction(interactClip);

         const rollClip   = clone.animations[13];
         const rollAction = mixer.clipAction(rollClip);

         const runClip   = clone.animations[14];
         const runAction = mixer.clipAction(runClip);

         const runBackClip   = clone.animations[15];
         const runBackAction = mixer.clipAction(runBackClip);

         const runLeftClip   = clone.animations[16];
         const runLeftAction = mixer.clipAction(runLeftClip);

         const runRightClip   = clone.animations[17];
         const runRightAction = mixer.clipAction(runRightClip);

         const runShootClip   = clone.animations[18];
         const runShootAction = mixer.clipAction(runShootClip);

         const meleeClip   = clone.animations[19];
         const meleeAction = mixer.clipAction(meleeClip);

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hitTaken', {clip: hitClip, action: hitAction});
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
         animations.set('melee', {clip: meleeClip, action: meleeAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Female_Survivor';
         this.animations.set('Female_Survivor', animations);
         this.mixers.set('Female_Survivor', mixer);
         this.characterModels.set('Female_Survivor', clone.scene);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Android Player model
      gltfLoader.load('./models/player/Android.gltf', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const deathClip   = clone.animations[0];
         const deathAction = mixer.clipAction(deathClip);

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);

         const idleClip   = clone.animations[6];
         const idleAction = mixer.clipAction(idleClip);

         const idleGunPointClip   = clone.animations[4];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);

         const idleGunShootClip   = clone.animations[5];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);

         const idleMeleeClip   = clone.animations[7];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);

         const interactClip   = clone.animations[8];
         const interactAction = mixer.clipAction(interactClip);

         const rollClip   = clone.animations[13];
         const rollAction = mixer.clipAction(rollClip);

         const runClip   = clone.animations[14];
         const runAction = mixer.clipAction(runClip);

         const runBackClip   = clone.animations[15];
         const runBackAction = mixer.clipAction(runBackClip);

         const runLeftClip   = clone.animations[16];
         const runLeftAction = mixer.clipAction(runLeftClip);

         const runRightClip   = clone.animations[17];
         const runRightAction = mixer.clipAction(runRightClip);

         const runShootClip   = clone.animations[18];
         const runShootAction = mixer.clipAction(runShootClip);

         const meleeClip   = clone.animations[19];
         const meleeAction = mixer.clipAction(meleeClip);

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hitTaken', {clip: hitClip, action: hitAction});
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
         animations.set('melee', {clip: meleeClip, action: meleeAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Android';
         this.animations.set('Android', animations);
         this.mixers.set('Android', mixer);
         this.characterModels.set('Android', clone.scene);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Female Soldier Survivor Player Model
      gltfLoader.load('./models/player/Soldier.glb', (gltf) => {
         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const deathClip   = clone.animations.find(clip => clip.name.includes('Death'));
         const deathAction = mixer.clipAction(deathClip);

         const shootClip   = clone.animations.find(clip => clip.name.includes('Gun_Shoot'));
         const shootAction = mixer.clipAction(shootClip);

         const hitClip   = clone.animations.find(clip => clip.name.includes('HitRecieve'));
         const hitAction = mixer.clipAction(hitClip);

         const idleClip   = clone.animations.find(clip => clip.name.includes('Idle'));
         const idleAction = mixer.clipAction(idleClip);

         const idleGunPointClip   = clone.animations.find(clip => clip.name.includes('Gun_Pointing'));
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);

         const idleGunShootClip   = clone.animations.find(clip => clip.name.includes('Idle_Gun_Shoot'));
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);

         const idleMeleeClip   = clone.animations.find(clip => clip.name.includes('Idle_Sword'));
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);

         const interactClip   = clone.animations.find(clip => clip.name.includes('Interact'));
         const interactAction = mixer.clipAction(interactClip);

         const rollClip   = clone.animations.find(clip => clip.name.includes('Roll'));
         const rollAction = mixer.clipAction(rollClip);

         const runClip   = clone.animations.find(clip => clip.name.includes('Run'));
         const runAction = mixer.clipAction(runClip);

         const runBackClip   = clone.animations.find(clip => clip.name.includes('Run_Back'));
         const runBackAction = mixer.clipAction(runBackClip);

         const runLeftClip   = clone.animations.find(clip => clip.name.includes('Run_Left'));
         const runLeftAction = mixer.clipAction(runLeftClip);

         const runRightClip   = clone.animations.find(clip => clip.name.includes('Run_Right'));
         const runRightAction = mixer.clipAction(runRightClip);

         const runShootClip   = clone.animations.find(clip => clip.name.includes('Run_Shoot'));
         const runShootAction = mixer.clipAction(runShootClip);

         const meleeClip   = clone.animations.find(clip => clip.name.includes('Sword_Slash'));
         const meleeAction = mixer.clipAction(meleeClip);

         const walkClip   = clone.animations.find(clip => clip.name.includes('Walk'));
         const walkAction = mixer.clipAction(walkClip);

         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hitTaken', {clip: hitClip, action: hitAction});
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
         animations.set('melee', {clip: meleeClip, action: meleeAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Female_Soldier_Survivor';
         this.animations.set('Female_Soldier_Survivor', animations);
         this.mixers.set('Female_Soldier_Survivor', mixer);
         this.characterModels.set('Female_Soldier_Survivor', clone.scene);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Female Adventuring Survivor Player Model
      gltfLoader.load('./models/player/Adventurer.glb', (gltf) => {

         const clone = {
            animations: gltf.animations, scene: gltf.scene.clone(true)
         }

         // clone.scene.scale.set(0.2, 0.2, 0.2);

         const mixer      = new AnimationMixer(clone.scene);
         const animations = new Map();

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

            cloneSMesh.bind(new Skeleton(orderedCloneBone, skeleton.boneInverses), cloneSMesh.matrixWorld);
         }

         clone.scene.traverse(child => {
            if (child.isMesh) {
               child.castShadow        = true
               child.receiveShadow     = true
               child.material.skinning = true
               child.frustumCulled     = false;
            }
         });

         const deathClip   = clone.animations.find(clip => clip.name.includes('Death'));
         const deathAction = mixer.clipAction(deathClip);

         const idleClip   = clone.animations.find(clip => clip.name.includes('Idle'));
         const idleAction = mixer.clipAction(idleClip);

         const idleGunPointClip   = clone.animations.find(clip => clip.name.includes('Gun_Pointing'));
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);

         const idleGunShootClip   = clone.animations.find(clip => clip.name.includes('Idle_Gun_Shoot'));
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);

         const idleMeleeClip   = clone.animations.find(clip => clip.name.includes('Idle_Sword'));
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);

         const walkClip   = clone.animations.find(clip => clip.name.includes('Walk'));
         walkClip.loop    = LoopOnce;
         const walkAction = mixer.clipAction(walkClip);

         const runClip   = clone.animations.find(clip => clip.name.includes('Run'));
         runClip.loop    = LoopOnce;
         const runAction = mixer.clipAction(runClip);

         const runBackClip   = clone.animations.find(clip => clip.name.includes('Run_Back'));
         runBackClip.loop    = LoopOnce;
         const runBackAction = mixer.clipAction(runBackClip);

         const runLeftClip   = clone.animations.find(clip => clip.name.includes('Run_Left'));
         runLeftClip.loop    = LoopOnce;
         const runLeftAction = mixer.clipAction(runLeftClip);

         const runRightClip   = clone.animations.find(clip => clip.name.includes('Run_Right'));
         runRightClip.loop    = LoopOnce;
         const runRightAction = mixer.clipAction(runRightClip);

         const shootClip   = clone.animations.find(clip => clip.name.includes('Gun_Shoot'));
         shootClip.loop    = LoopOnce;
         const shootAction = mixer.clipAction(shootClip);

         const hitClip   = clone.animations.find(clip => clip.name.includes('HitRecieve'));
         hitClip.loop    = LoopOnce;
         const hitAction = mixer.clipAction(hitClip);

         const interactClip   = clone.animations.find(clip => clip.name.includes('Interact'));
         interactClip.loop    = LoopOnce;
         const interactAction = mixer.clipAction(interactClip);

         const runShootClip   = clone.animations.find(clip => clip.name.includes('Run_Shoot'));
         runShootClip.loop    = LoopOnce;
         const runShootAction = mixer.clipAction(runShootClip);

         const rollClip   = clone.animations.find(clip => clip.name.includes('Roll'));
         rollClip.loop    = LoopOnce;
         const rollAction = mixer.clipAction(rollClip);

         const meleeClip   = clone.animations.find(clip => clip.name.includes('Sword_Slash'));
         meleeClip.loop    = LoopOnce;
         const meleeAction = mixer.clipAction(meleeClip);


         animations.set('idle', {clip: idleClip, action: idleAction});
         animations.set('shoot', {clip: shootClip, action: shootAction});
         animations.set('die', {clip: deathClip, action: deathAction});
         animations.set('hitTaken', {clip: hitClip, action: hitAction});
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
         animations.set('melee', {clip: meleeClip, action: meleeAction});
         animations.set('walk', {clip: walkClip, action: walkAction});

         clone.name = 'Female_Adventuring_Survivor';
         this.animations.set('Female_Adventuring_Survivor', animations);
         this.mixers.set('Female_Adventuring_Survivor', mixer);
         this.characterModels.set('Female_Adventuring_Survivor', clone.scene);
      });
      // ------------------------------------------------------------


   }


   /**
    * @description Loads all item models into memory.
    * @private
    */
   _loadItemModels() {
      const gltfLoader = this.gltfLoader;
      const items      = this.items;

      // ------------------------------------------------------------
      // Collectible Health
      gltfLoader.load('./models/pickups/PickupHealth.glb', (gltf) => {
         const healthpackMesh            = gltf.scene;
         healthpackMesh.matrixAutoUpdate = false;
         items.set('pickupHealth', healthpackMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Collectible Heart
      gltfLoader.load('./models/pickups/PickupHeart.glb', (gltf) => {
         const heartMesh            = gltf.scene;
         heartMesh.matrixAutoUpdate = false;
         items.set('pickupHeart', heartMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Collectible Tank
      gltfLoader.load('./models/pickups/PickupTank.glb', (gltf) => {
         const tankMesh            = gltf.scene;
         tankMesh.matrixAutoUpdate = false;
         items.set('pickupTank', tankMesh);
      });
      // ------------------------------------------------------------


   }


   /**
    * @description Loads all weapon models
    * @private
    */
   _loadWeaponModels() {
      const gltfLoader = this.gltfLoader;
      const weapons    = this.weapons;

      // ------------------------------------------------------------
      // Fire Axe
      gltfLoader.load('./models/weapons/FireAxe.glb', (gltf) => {
         const fireAxeMesh            = gltf.scene;
         fireAxeMesh.matrixAutoUpdate = false;
         weapons.set('FireAxe', fireAxeMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Flare Gun
      gltfLoader.load('./models/weapons/FlareGun.glb', (gltf) => {
         const flareGunMesh            = gltf.scene;
         flareGunMesh.matrixAutoUpdate = false;
         weapons.set('FlareGun', flareGunMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Pistol (Default)
      gltfLoader.load('./models/weapons/Pistol.glb', (gltf) => {
         const pistolMesh            = gltf.scene;
         pistolMesh.matrixAutoUpdate = false;
         weapons.set('Pistol', pistolMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // AKM
      gltfLoader.load('./models/weapons/AKM.glb', (gltf) => {
         const akmMesh            = gltf.scene;
         akmMesh.matrixAutoUpdate = false;
         weapons.set('AKM', akmMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // M4a1
      gltfLoader.load('./models/weapons/M4a1.glb', (gltf) => {
         const m4a1Mesh            = gltf.scene;
         m4a1Mesh.matrixAutoUpdate = false;
         weapons.set('M4a1', m4a1Mesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Revolver (Default)
      gltfLoader.load('./models/weapons/Revolver.glb', (gltf) => {
         const revolverMesh            = gltf.scene;
         revolverMesh.matrixAutoUpdate = false;
         weapons.set('Revolver', revolverMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Android Saber
      gltfLoader.load('./models/weapons/AndroidSaber.glb', (gltf) => {
         const androidSaberMesh            = gltf.scene;
         androidSaberMesh.matrixAutoUpdate = false;
         weapons.set('AndroidSaber', androidSaberMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // Bowie Knife
      gltfLoader.load('./models/weapons/BowieKnife.glb', (gltf) => {
         const bowieKnifeMesh            = gltf.scene;
         bowieKnifeMesh.matrixAutoUpdate = false;
         weapons.set('BowieKnife', bowieKnifeMesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // P320 Pistol
      gltfLoader.load('./models/weapons/P320.glb', (gltf) => {
         const p320Mesh            = gltf.scene;
         p320Mesh.matrixAutoUpdate = false;
         weapons.set('P320', p320Mesh);
      });
      // ------------------------------------------------------------


      // ------------------------------------------------------------
      // P226 Pistol
      gltfLoader.load('./models/weapons/P226.glb', (gltf) => {
         const p226Mesh            = gltf.scene;
         p226Mesh.matrixAutoUpdate = false;
         weapons.set('P226', p226Mesh);
      });
      // ------------------------------------------------------------

   }


   /**
    * @description Loads all envrironment prop models
    * @private
    */
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


   /**
    * @description Loads all interior environment models
    * @private
    */
   _loadInteriorModels() {
      const objectLoader = this.objectLoader;
      const interiors    = this.interiors;

   }


   /**
    * @description Loads all exterior environment models
    * @private
    */
   _loadExteriorModels() {
      const gltfLoader = this.gltfLoader;
      const exteriors  = this.exteriors;


   }


}



export {AssetManager};
