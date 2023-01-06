import {Color, Geometry, Group, Object3D, Points, PointsMaterial, MathUtils, BoxBufferGeometry, MeshLambertMaterial, Mesh, AmbientLight, DirectionalLight, CameraHelper, MeshBasicMaterial} from "three";
import * as YUKA                                                                                                                                                                            from "yuka";



class EnvironmentManager {
   constructor(world) {
      this.world          = world;
      this.props          = [];
      this.environmentmap = new Map();

      this.floorMesh   = new Group();
      this.wallsMeshes = new Group();

      this.width  = 0;
      this.depth  = 0;
      this.height = 0;

      this.rooms = new Group();
      this.ship  = null;

      this.stargeometry = new Geometry();
      this.stars        = new Points();

      this._options = {
         type       : 'default',
         constraints: {
            minX: 0,
            maxX: 0,
            x   : 0,

            minZ: 0,
            maxZ: 0,
            z   : 0
         },


      };

   }


   init() {

      this.width = this.world.field.x;
      this.depth = this.world.depth;

      this.generateBackground(0x030303, true);
      this.generateLights(null, true);
      this.generateFloor();
      this.generateWalls();

   }


   generateShell() {

   }


   generateWalls() {

      let wallMaterial = new MeshLambertMaterial({color: 0x8e8e8e});
      this.wallsMeshes.clear();

      let x = Math.floor(-this.width / 2);
      let z = Math.floor(-this.depth / 2);

      let wallGeometry       = new BoxBufferGeometry(0.5, this.height, 0.5);
      var cornerWallMesh     = new Mesh(wallGeometry, wallMaterial);
      var oppoCornerWallMesh = new Mesh(wallGeometry, wallMaterial);

      cornerWallMesh.matrixAutoUpdate     = false;
      oppoCornerWallMesh.matrixAutoUpdate = false;

      cornerWallMesh.position.set(x, 1, z);
      oppoCornerWallMesh.position.set(Math.abs(x), 1, Math.abs(z));

      cornerWallMesh.updateMatrix();
      oppoCornerWallMesh.updateMatrix();

      cornerWallMesh.castShadow        = true;
      oppoCornerWallMesh.castShadow    = true;
      cornerWallMesh.receiveShadow     = true;
      oppoCornerWallMesh.receiveShadow = true;

      this.wallsMeshes.add(cornerWallMesh);
      this.wallsMeshes.add(oppoCornerWallMesh);

      cornerWallMesh     = new Mesh(wallGeometry, wallMaterial);
      oppoCornerWallMesh = new Mesh(wallGeometry, wallMaterial);

      cornerWallMesh.matrixAutoUpdate     = false;
      oppoCornerWallMesh.matrixAutoUpdate = false;

      cornerWallMesh.position.set(x, 1, Math.abs(z));
      oppoCornerWallMesh.position.set(Math.abs(x), 1, z);

      cornerWallMesh.updateMatrix();
      oppoCornerWallMesh.updateMatrix();

      cornerWallMesh.castShadow        = true;
      oppoCornerWallMesh.castShadow    = true;
      cornerWallMesh.receiveShadow     = true;
      oppoCornerWallMesh.receiveShadow = true;

      this.wallsMeshes.add(cornerWallMesh);
      this.wallsMeshes.add(oppoCornerWallMesh);

      for (let i = Math.ceil(-this.depth / 2); i < Math.ceil(this.depth / 2); i++) {
         wallGeometry = new BoxBufferGeometry(0.5, 1, 1);

         if (i === Math.floor(this.depth / 2) || i === Math.ceil(-this.depth / 2)) {
            wallGeometry = new BoxBufferGeometry(0.5, 1, 1.5);
         }

         let wallMesh     = new Mesh(wallGeometry, wallMaterial);
         let oppoWallMesh = new Mesh(wallGeometry, wallMaterial);

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;


         wallMesh.position.set(x, 1, i);
         oppoWallMesh.position.set(Math.abs(x), 1, i);

         wallMesh.updateMatrix();
         oppoWallMesh.updateMatrix();

         wallMesh.castShadow        = true;
         oppoWallMesh.castShadow    = true;
         wallMesh.receiveShadow     = true;
         oppoWallMesh.receiveShadow = true;

         this.wallsMeshes.add(wallMesh);
         this.wallsMeshes.add(oppoWallMesh);
      }

      for (let i = Math.ceil(-this.width / 2); i < Math.ceil(this.width / 2); i++) {
         wallGeometry = new BoxBufferGeometry(1, 1, 0.5);

         if (i === Math.floor(this.width / 2) || i === Math.ceil(-this.width / 2)) {
            wallGeometry = new BoxBufferGeometry(1.5, 1, 0.5);
         }

         let wallMesh     = new Mesh(wallGeometry, wallMaterial);
         let oppoWallMesh = new Mesh(wallGeometry, wallMaterial);

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;

         wallMesh.position.set(i, 1, z);
         oppoWallMesh.position.set(i, 1, Math.abs(z));

         wallMesh.updateMatrix();
         oppoWallMesh.updateMatrix();

         wallMesh.castShadow        = true;
         oppoWallMesh.castShadow    = true;
         wallMesh.receiveShadow     = true;
         oppoWallMesh.receiveShadow = true;

         this.wallsMeshes.add(wallMesh);
         this.wallsMeshes.add(oppoWallMesh);
      }


      this.world.scene.add(this.wallsMeshes);

   }


   generateRooms(count, options = null) {

   }


   generateBackground(newColor, stars = true, options = null) {
      if (options === null) {

         for (var i = 0; i < 8000; i++) {

            var star = new Object3D();

            star.x = MathUtils.randFloat(-200, 200);
            star.y = MathUtils.randFloat(-75, -50);
            star.z = MathUtils.randFloat(-200, 200);

            star.scale.set(1, 1, 1).multiplyScalar(Math.random());

            star.updateMatrixWorld();

            star.velocity     = 0;
            star.acceleration = 0.002;
            this.stargeometry.vertices.push(star);

         }

         let sprite       = this.world.assetManager.textures.get('star');
         let starMaterial = new PointsMaterial({
            color: 0xaaaaaa,
            size : 0.7,
            map  : sprite,
         });
         this.stars       = new Points(this.stargeometry, starMaterial);

         let color;
         if (newColor) {color = new Color(newColor);} else {color = new Color(0x030303);}
         this.world.scene.background = new Color(color);

         if (stars) {

            this.world.scene.add(this.stars);

         } else {

            this.world.scene.remove(this.stars);

         }
      } else {

      }

   }


   _updateBackground(delta) {

      this.stargeometry.vertices.forEach((vertex) => {

         vertex.velocity += vertex.acceleration * (delta * 0.01);
         vertex.y -= vertex.velocity;

         if (vertex.y <= -80) {

            vertex.y        = -45;
            vertex.velocity = 0;

         }

      });

      this.stargeometry.verticesNeedUpdate = true;

   }


   generateFloor() {
      const totalcells    = this.width * this.depth;
      const floorGeometry = new BoxBufferGeometry(1, 0.5, 1);
      const floorMaterial = new MeshBasicMaterial({map: this.world.assetManager.textures.get('grass1')});
      this.floorMesh.clear();
      for (let x = -this.width / 2; x <= this.width / 2; x++) {
         for (let z = -this.depth / 2; z <= this.depth / 2; z++) {
            const floorMesh            = new Mesh(floorGeometry, floorMaterial);
            floorMesh.matrixAutoUpdate = false;
            floorMesh.position.set(x, 0, z);
            floorMesh.updateMatrix();
            floorMesh.castShadow    = true;
            floorMesh.receiveShadow = true;
            this.floorMesh.add(floorMesh);
         }
      }

      this.world.scene.add(this.floorMesh);

   }


   generateLights(options = null, DEBUG = false) {
      const dirLight     = new DirectionalLight(0xffffff, 0.6);
      const ambientLight = new AmbientLight(0xcccccc, 0.4);

      if (options === null) {

         ambientLight.matrixAutoUpdate = false;

         this.world.scene.add(ambientLight);

         dirLight.position.set(1, 10, -1);
         dirLight.matrixAutoUpdate = false;

         dirLight.updateMatrix();

         dirLight.castShadow           = true;
         dirLight.shadow.camera.top    = 15;
         dirLight.shadow.camera.bottom = -15;
         dirLight.shadow.camera.left   = -15;
         dirLight.shadow.camera.right  = 15;
         dirLight.shadow.camera.near   = 1;
         dirLight.shadow.camera.far    = 20;
         dirLight.shadow.mapSize.x     = 2048;
         dirLight.shadow.mapSize.y     = 2048;
         dirLight.shadow.bias          = 0.01;

         this.world.scene.add(dirLight);
      } else {

      }

      /* TODO: DEBUG */
      if (DEBUG) {
         this.world.scene.add(new CameraHelper(dirLight.shadow.camera));
      }

   }



   update(x, y, z) {

      this.width  = x;
      this.depth  = z;
      this.height = y;

      this.generateFloor();
      this.generateWalls();

   }



}



export {EnvironmentManager};
