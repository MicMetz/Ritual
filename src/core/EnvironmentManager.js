import {
   Color, Geometry, Group, Object3D, Points, PointsMaterial, MathUtils,
   BoxBufferGeometry, MeshLambertMaterial, Mesh, AmbientLight, DirectionalLight,
   CameraHelper, MeshBasicMaterial, Fog, PlaneGeometry, InstancedMesh, DoubleSide, ShaderMaterial
}                from "three";
import * as YUKA from "yuka";



const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = ( vUv.y * 0.5 ) + 0.5;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`;



class EnvironmentManager {
   constructor(world) {
      this.world          = world;
      this.props          = [];
      this.environmentmap = new Map();

      this.floorMesh   = new Group();
      this.wallsMeshes = new Group();

      this.grass    = null;
      this.uniforms = {
         time: {
            value: 0
         }
      };

      this.outBoundFog = new Fog('lightblue', 0, 100);
      this.background  = new Color('black');

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

      this.generateBackground(0x030303);
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

      let wallGeometry       = new BoxBufferGeometry(0.5, 2, 0.5);
      var cornerWallMesh     = new Mesh(wallGeometry, wallMaterial);
      var oppoCornerWallMesh = new Mesh(wallGeometry, wallMaterial);

      cornerWallMesh.matrixAutoUpdate     = false;
      oppoCornerWallMesh.matrixAutoUpdate = false;

      cornerWallMesh.position.set(x, 0, z);
      oppoCornerWallMesh.position.set(Math.abs(x), 0, Math.abs(z));

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

      cornerWallMesh.position.set(x, 0, Math.abs(z));
      oppoCornerWallMesh.position.set(Math.abs(x), 0, z);

      cornerWallMesh.updateMatrix();
      oppoCornerWallMesh.updateMatrix();

      cornerWallMesh.castShadow        = true;
      oppoCornerWallMesh.castShadow    = true;
      cornerWallMesh.receiveShadow     = true;
      oppoCornerWallMesh.receiveShadow = true;

      this.wallsMeshes.add(cornerWallMesh);
      this.wallsMeshes.add(oppoCornerWallMesh);

      for (let i = Math.ceil(-this.depth / 2); i < Math.ceil(this.depth / 2); i++) {
         wallGeometry = new BoxBufferGeometry(0.5, 2, 1);

         if (i === Math.floor(this.depth / 2) || i === Math.ceil(-this.depth / 2)) {
            wallGeometry = new BoxBufferGeometry(0.5, 2, 1.5);
         }

         let wallMesh     = new Mesh(wallGeometry, wallMaterial);
         let oppoWallMesh = new Mesh(wallGeometry, wallMaterial);

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;


         wallMesh.position.set(x, 0, i);
         oppoWallMesh.position.set(Math.abs(x), 0, i);

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
         wallGeometry = new BoxBufferGeometry(1, 2, 0.5);

         if (i === Math.floor(this.width / 2) || i === Math.ceil(-this.width / 2)) {
            wallGeometry = new BoxBufferGeometry(1.5, 2, 0.5);
         }

         let wallMesh     = new Mesh(wallGeometry, wallMaterial);
         let oppoWallMesh = new Mesh(wallGeometry, wallMaterial);

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;

         wallMesh.position.set(i, 0, z);
         oppoWallMesh.position.set(i, 0, Math.abs(z));

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


   generateBackground(options = null) {

      if (options === null) {
         this.world.scene.background = this.background;
         this.world.scene.fog        = this.outBoundFog;


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
      const floorGeometry = new BoxBufferGeometry(1, 0.2, 1);
      const floorMaterial = new MeshBasicMaterial({map: this.world.assetManager.textures.get('SummerGrass')});
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

      this.grass = new ShaderMaterial({
         vertexShader,
         fragmentShader,
         uniforms: this.uniforms,
         side: DoubleSide
      });

      const instanceNumber = this.width * this.depth * 2;
      const dummy          = new Object3D();

      const geometry = new PlaneGeometry(0.1, 1, 1, 4);
      geometry.translate(0, 0.2, 0);

      const instancedMesh = new InstancedMesh(geometry, this.grass, instanceNumber);

      for (let i = 0; i < instanceNumber; i++) {

         dummy.position.set(MathUtils.randFloatSpread(this.width), 0, MathUtils.randFloatSpread(this.depth));
         // dummy.position.set(Math.random() * 100 - 50, 0, Math.random() * 100 - 50);
         dummy.rotation.y = Math.random() * Math.PI;
         dummy.updateMatrix();

         instancedMesh.setMatrixAt(i, dummy.matrix);

      }

      this.floorMesh.add(instancedMesh);
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


   animate(delta) {
      this.grass.uniforms.time.value = delta;
      this.grass.uniformsNeedUpdate  = true;


   }



}



export {EnvironmentManager};
