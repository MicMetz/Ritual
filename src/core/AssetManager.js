/**
 * @author MicMetzger /
 */

import {LoopOnce}            from "three";
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
   constructor(world) {

      this.world          = world;
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
      this.exteriors = new Map();

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

         textures.set('moss', texture);
      });

      textureLoader.load('./textures/Summer_Mud_A.png', (textureA) => {
         textureLoader.load('./textures/Summer_Mud_B.png', (textureB) => {
            const texture        = new THREE.Texture();
            texture.image        = textureA.image;
            texture.image.height = textureA.image.height + textureB.image.height;
            texture.image.width  = textureA.image.width;
            texture.image.data   = new Uint8Array(texture.image.width * texture.image.height * 4);
            texture.image.data.set(textureA.image.data);
            // texture.image.data.set(textureB.image.data, textureA.image.data.length);
            texture.needsUpdate = true;

            texture.repeat.x = 1;
            texture.repeat.y = 1;

            textures.set('moss', texture);
         });
      });

      textureLoader.load('./textures/carbon/Bush_Leaves.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('bushLeaves', texture);
      });

      textureLoader.load('./textures/Rocks.png', (texture) => {
         texture.repeat.x = 1;
         texture.repeat.y = 1;

         textures.set('rocks', texture);
      });

      // Tree Bark
      textureLoader.load('./textures/carbon/NormalTree_Bark.png', (texture) => {
         textureLoader.load('./textures/carbon/NormalTree_Bark_Normal.png', (normalMap) => {
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

         clone.scene.scale.set(0.1, 0.1, 0.1);
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
         // biteAction.enabled = false;
         // biteAction.play();

         const crawlClip   = clone.animations[1];
         const crawlAction = mixer.clipAction(crawlClip);
         // crawlAction.enabled = false;
         // crawlAction.play();

         const idleClip   = clone.animations[2];
         const idleAction = mixer.clipAction(idleClip);
         // idleAction.enabled = false;
         // idleAction.play();

         const runClip   = clone.animations[3];
         const runAction = mixer.clipAction(runClip);
         // runAction.enabled = false;
         // runAction.play();

         const walkClip   = clone.animations[4];
         const walkAction = mixer.clipAction(walkClip);
         // walkAction.enabled = false;
         // walkAction.play();

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
         // deathAction.enabled = false;
         // deathAction.play();

         const shootClip   = clone.animations[1];
         const shootAction = mixer.clipAction(shootClip);
         // shootAction.enabled = false;
         // shootAction.play();

         const hitClip   = clone.animations[2];
         const hitAction = mixer.clipAction(hitClip);
         // hitAction.enabled = false;
         // hitAction.play();

         const idleClip   = clone.animations[4];
         const idleAction = mixer.clipAction(idleClip);
         // idleAction.enabled = false;
         // idleAction.play();

         const idleGunPointClip   = clone.animations[6];
         const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         // idleGunPointAction.enabled = false;
         // idleGunPointAction.play();

         const idleGunShootClip   = clone.animations[7];
         const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         // idleGunShootAction.enabled = false;
         // idleGunShootAction.play();

         const idleMeleeClip   = clone.animations[9];
         const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         // idleMeleeAction.enabled = false;
         // idleMeleeAction.play();

         const interactClip   = clone.animations[10];
         const interactAction = mixer.clipAction(interactClip);
         // interactAction.enabled = false;
         // interactAction.play();

         const rollClip   = clone.animations[15];
         const rollAction = mixer.clipAction(rollClip);
         // rollAction.enabled = false;
         // rollAction.play();

         const runClip   = clone.animations[16];
         const runAction = mixer.clipAction(runClip);
         // runAction.enabled = false;
         // runAction.play();

         const runBackClip   = clone.animations[17];
         const runBackAction = mixer.clipAction(runBackClip);
         // runBackAction.enabled = false;
         // runBackAction.play();

         const runLeftClip   = clone.animations[18];
         const runLeftAction = mixer.clipAction(runLeftClip);
         // runLeftAction.enabled = false;
         // runLeftAction.play();

         const runRightClip   = clone.animations[19];
         const runRightAction = mixer.clipAction(runRightClip);
         // runRightAction.enabled = false;
         // runRightAction.play();

         const runShootClip   = clone.animations[20];
         const runShootAction = mixer.clipAction(runShootClip);
         // runShootAction.enabled = false;
         // runShootAction.play();

         const slashClip   = clone.animations[21];
         const slashAction = mixer.clipAction(slashClip);
         // slashAction.enabled = false;
         // slashAction.play();

         const walkClip   = clone.animations[22];
         const walkAction = mixer.clipAction(walkClip);
         // walkAction.enabled = false;
         // walkAction.play();

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


      // Task Force Operator
      gltfLoader.load('./models/enemies/TaskForceOperator.glb', (gltf) => {
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

         clone.scene.scale.set(0.1, 0.1, 0.1);

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();
         // const animations = {};

         // const deathClip   = clone.animations[0];
         // const deathAction = mixer.clipAction(deathClip);
         // // deathAction.enabled = false;
         // // deathAction.play();
         //
         // const shootClip   = clone.animations[1];
         // const shootAction = mixer.clipAction(shootClip);
         // // shootAction.enabled = false;
         // // shootAction.play();
         //
         // const hitClip   = clone.animations[2];
         // const hitAction = mixer.clipAction(hitClip);
         // // hitAction.enabled = false;
         // // hitAction.play();
         //
         // const idleClip   = clone.animations[4];
         // const idleAction = mixer.clipAction(idleClip);
         // // idleAction.enabled = false;
         // // idleAction.play();
         //
         // const idleGunPointClip   = clone.animations[6];
         // const idleGunPointAction = mixer.clipAction(idleGunPointClip);
         // // idleGunPointAction.enabled = false;
         // // idleGunPointAction.play();
         //
         // const idleGunShootClip   = clone.animations[7];
         // const idleGunShootAction = mixer.clipAction(idleGunShootClip);
         // // idleGunShootAction.enabled = false;
         // // idleGunShootAction.play();
         //
         // const idleMeleeClip   = clone.animations[9];
         // const idleMeleeAction = mixer.clipAction(idleMeleeClip);
         // // idleMeleeAction.enabled = false;
         // // idleMeleeAction.play();
         //
         // const interactClip   = clone.animations[10];
         // const interactAction = mixer.clipAction(interactClip);
         // // interactAction.enabled = false;
         // // interactAction.play();
         //
         // const rollClip   = clone.animations[15];
         // const rollAction = mixer.clipAction(rollClip);
         // // rollAction.enabled = false;
         // // rollAction.play();
         //
         // const runClip   = clone.animations[16];
         // const runAction = mixer.clipAction(runClip);
         // // runAction.enabled = false;
         // // runAction.play();
         //
         // const runBackClip   = clone.animations[17];
         // const runBackAction = mixer.clipAction(runBackClip);
         // // runBackAction.enabled = false;
         // // runBackAction.play();
         //
         // const runLeftClip   = clone.animations[18];
         // const runLeftAction = mixer.clipAction(runLeftClip);
         // // runLeftAction.enabled = false;
         // // runLeftAction.play();
         //
         // const runRightClip   = clone.animations[19];
         // const runRightAction = mixer.clipAction(runRightClip);
         // // runRightAction.enabled = false;
         // // runRightAction.play();
         //
         // const runShootClip   = clone.animations[20];
         // const runShootAction = mixer.clipAction(runShootClip);
         // // runShootAction.enabled = false;
         // // runShootAction.play();
         //
         // const slashClip   = clone.animations[21];
         // const slashAction = mixer.clipAction(slashClip);
         // // slashAction.enabled = false;
         // // slashAction.play();
         //
         // const walkClip   = clone.animations[22];
         // const walkAction = mixer.clipAction(walkClip);
         // // walkAction.enabled = false;
         // // walkAction.play();
         //
         // animations.set('idle', {clip: idleClip, action: idleAction});
         // animations.set('shoot', {clip: shootClip, action: shootAction});
         // animations.set('die', {clip: deathClip, action: deathAction});
         // animations.set('hit', {clip: hitClip, action: hitAction});
         // animations.set('idleGunPoint', {clip: idleGunPointClip, action: idleGunPointAction});
         // animations.set('idleGunShoot', {clip: idleGunShootClip, action: idleGunShootAction});
         // animations.set('idleMelee', {clip: idleMeleeClip, action: idleMeleeAction});
         // animations.set('interact', {clip: interactClip, action: interactAction});
         // animations.set('roll', {clip: rollClip, action: rollAction});
         // animations.set('run', {clip: runClip, action: runAction});
         // animations.set('runBack', {clip: runBackClip, action: runBackAction});
         // animations.set('runLeft', {clip: runLeftClip, action: runLeftAction});
         // animations.set('runRight', {clip: runRightClip, action: runRightAction});
         // animations.set('runShoot', {clip: runShootClip, action: runShootAction});
         // animations.set('slash', {clip: slashClip, action: slashAction});
         // animations.set('walk', {clip: walkClip, action: walkAction});


         clone.name = 'task_force';
         this.animations.set('task_force', animations);
         this.mixers.set('task_force', mixer);
         this.enemyModels.set('task_force', clone.scene);

      });


   }


   _loadCharacterModels() {

      const gltfLoader    = this.gltfLoader;
      const fbxLoader     = this.fbxLoader;
      const textureLoader = this.textureLoader;
      const models        = this.characterModels;
      const animations    = this.animations;

      // Wanderer Player model

      // Android Player model
      gltfLoader.load('./models/player/Woman2.glb', (gltf) => {
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
         clone.scene.scale.set(0.1, 0.1, 0.1);


         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

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

         const slashClip   = clone.animations[19];
         const slashAction = mixer.clipAction(slashClip);

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);

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

         clone.scene.visible = true;
         clone.name          = 'WomanSurvivor';
         this.animations.set('WomanSurvivor', animations);
         this.mixers.set('WomanSurvivor', mixer);
         this.characterModels.set('WomanSurvivor', clone.scene);
      })


      // Android Player model
      gltfLoader.load('./models/player/Android.gltf', (gltf) => {
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

         clone.scene.scale.set(0.1, 0.1, 0.1);

         const mixer      = new THREE.AnimationMixer(clone.scene);
         const animations = new Map();

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

         const slashClip   = clone.animations[19];
         const slashAction = mixer.clipAction(slashClip);

         const walkClip   = clone.animations[20];
         const walkAction = mixer.clipAction(walkClip);

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

         clone.scene.visible = true;
         clone.name = 'Android';
         this.animations.set('Android', animations);
         this.mixers.set('Android', mixer);
         this.characterModels.set('Android', clone.scene);
      })


      // Wanderer
      gltfLoader.load('./models/player/Soldier.glb', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }
         const mixer = new THREE.AnimationMixer(clone.scene);

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

         clone.scene.scale.set(0.1, 0.1, 0.1);

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

         const slashClip   = clone.animations.find(clip => clip.name.includes('Sword_Slash'));
         const slashAction = mixer.clipAction(slashClip);

         const walkClip   = clone.animations.find(clip => clip.name.includes('Walk'));
         const walkAction = mixer.clipAction(walkClip);

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

         clone.scene.visible = true;
         clone.name = 'Wanderer';
         this.animations.set('Wanderer', animations);
         this.mixers.set('Wanderer', mixer);
         this.characterModels.set('Wanderer', clone.scene);
      })


      // Adventurer
      gltfLoader.load('./models/player/Adventurer.glb', (gltf) => {
         const clone = {
            animations: gltf.animations,
            scene     : gltf.scene.clone(true)
         }
         const mixer = new THREE.AnimationMixer(clone.scene);

         const cloneBones         = {};
         const cloneSkinnedMeshes = {};

         clone.scene.traverse(node => {
            // node.scale.set(0.5, 0.5, 0.5);
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

         const slashClip   = clone.animations.find(clip => clip.name.includes('Sword_Slash'));
         const slashAction = mixer.clipAction(slashClip);

         const walkClip   = clone.animations.find(clip => clip.name.includes('Walk'));
         const walkAction = mixer.clipAction(walkClip);

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

         clone.scene.visible = true;
         clone.name = 'Adventurer';
         this.animations.set('Adventurer', animations);
         this.mixers.set('Adventurer', mixer);
         this.characterModels.set('Adventurer', clone.scene);
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

      // Fire Axe
      gltfLoader.load('./models/weapons/FireAxe.glb', (gltf) => {
         const fireAxeMesh            = gltf.scene;
         fireAxeMesh.matrixAutoUpdate = false;
         weapons.set('FireAxe', fireAxeMesh);
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

   }


   _loadExteriorModels() {
      const gltfLoader = this.gltfLoader;
      const exteriors  = this.exteriors;


   }


}



export {AssetManager};
