import * as THREE                                                                                                                             from "three";
import {AmbientLight, BoxBufferGeometry, DirectionalLight, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry} from "three";
import * as YUKA                                                                                                                              from "yuka";



class Room {
   constructor(world, params, mapType) {
      this._world   = world;
      this._tiles   = new Group();
      this._props   = [];
      this._collectibles = [];
      this._enemies = [];
      this.bossRoom = false;
      this.exitRoom = false;

      switch (params.type) {
         case 'normal': {
            this.sizeX = 35;
            this.sizeZ = 35;
            break;
         }
         case 'small': {
            this.sizeX = 17.5;
            this.sizeZ = 17.5;
            break;
         }
         case 'large': {
            this.sizeX = 70;
            this.sizeZ = 70;
            break;
         }
         case 'huge': {
            this.sizeX = 140;
            this.sizeZ = 140;
            break;
         }
         default: {
            this.sizeX = 35;
            this.sizeZ = 35;
            break;
         }
      }

      this.field     = new YUKA.Vector3(this.sizeX, 1, this.sizeZ);
      this.fieldMesh = null;

      this.wall        = new YUKA.Vector3(0.5, 1, 0.5);
      this.wallsMeshes = new Group();

      this.obstacles    = [];
      this.obstacleMesh = null;
      this.maxObstacles = 50;

      this.init();
   }


   init() {

      this.generateFloor();
      this.generateWalls();
      this.generateLights();

   }


   generateFloor() {
      // field
      const fieldGeometry = new BoxBufferGeometry(this.field.x, this.field.y, this.field.z);
      const fieldMaterial = new MeshLambertMaterial({color: 0x9da4b0});

      this.fieldMesh                  = new Mesh(fieldGeometry, fieldMaterial);
      this.fieldMesh.matrixAutoUpdate = false;
      this.fieldMesh.position.set(0, -0.5, 0);
      this.fieldMesh.updateMatrix();
      this.fieldMesh.receiveShadow = true;
      this._world.scene.add(this.fieldMesh);
   }


   generateWalls() {
      const wallGeometry = new BoxBufferGeometry(1, 1, 1);
      const wallMaterial = new MeshLambertMaterial({color: 0x8e8e8e});
      for (let x = -this.field.x / 2; x <= this.field.x / 2; x++) {
         if (x === -this.field.x / 2 || x === this.field.x / 2) {
            for (let z = -this.field.z / 2; z <= this.field.z / 2; z++) {
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
      this._world.scene.add(this.wallsMeshes);
   }


   generateLights() {
      // lights
      const ambientLight            = new AmbientLight(0xcccccc, 0.4);
      ambientLight.matrixAutoUpdate = false;
      this._world.scene.add(ambientLight);

      const dirLight = new DirectionalLight(0xffffff, 0.6);
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
      this._world.scene.add(dirLight);
   }


   generateObstacles() {
      // obstacle
      const obtacleGeometry = new BoxBufferGeometry(1, 1, 1);
      const obtacleMaterial = new MeshLambertMaterial({color: 0xdedad3});

      this.obstacleMesh               = new InstancedMesh(obtacleGeometry, obtacleMaterial, this.maxObstacles);
      this.obstacleMesh.frustumCulled = false;
      this.obstacleMesh.castShadow    = true;
      this._world.scene.add(this.obstacleMesh);
   }



}
