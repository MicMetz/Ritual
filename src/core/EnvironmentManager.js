/**
 * @author MicMetzger /
 */


import {
   Color, Group, Object3D, Points, PointsMaterial, MathUtils,
   BoxGeometry, Mesh, AmbientLight, DirectionalLight, CameraHelper,
   MeshBasicMaterial, Fog, InstancedMesh, DoubleSide, ShaderMaterial,
   PlaneGeometry, BufferGeometry, MeshToonMaterial, BoxBufferGeometry
} from "three";
import * as YUKA from "yuka";
import { FogController } from "../environment/FogController.js";
// import SpacialHashGrid from "../environment/SpacialHashGrid.js";
// import {Terrain}       from "../environment/terrain/Terrain.js";



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
   constructor( world ) {
      this.world          = world;
      this.props          = [];
      this.environmentmap = new Map();

      // TODO
      // this.grid          = new SpacialHashGrid([[-2500, -2500], [2500, 2500]], [5000, 5000]);
      this.terrain       = null;
      this.floorMesh     = new Group();
      this.wallsMeshes   = new Group();
      this.background    = new Color( 'black' );
      this.fogController = null;
      this.grass         = null;
      this.uniforms      = {
         time: {
            value: 0
         }
      };

      this.width  = 0;
      this.depth  = 0;
      this.height = 0;

      this.rooms = new Group();

      this.stargeometry = new BufferGeometry();
      this.stars        = new Points();

      this._options = {
         type: 'default', constraints: {
            minX: 0, maxX: 0, x: 0,

            minZ: 0, maxZ: 0, z: 0
         },


      };

   }


   init() {

      this.width = this.world.field.x;
      this.depth = this.world.field.z;
      // this.terrain       = new Terrain(this.world);

      this.generateBackground( 0x030303 );
      this.generateLights( null, true );
      this.generateFloor();
      // this.generateWalls();
      this.fogController = new FogController( this.world );

   }


   createHardWall() {

   }


   createSoftWall() {

   }



   generateWalls() {

      let wallMaterial = new MeshBasicMaterial( { color: 0x8e8e8e } );
      this.wallsMeshes.clear();

      // let x = Math.floor(-this.width / 2);
      // let z = Math.floor(-this.depth / 2);
      let x = this.width;
      let z = this.depth;

      let wallGeometry       = new BoxGeometry( 0.5, 2, 0.5 );
      var cornerWallMesh     = new Mesh( wallGeometry, wallMaterial );
      var oppoCornerWallMesh = new Mesh( wallGeometry, wallMaterial );

      cornerWallMesh.matrixAutoUpdate     = false;
      oppoCornerWallMesh.matrixAutoUpdate = false;

      cornerWallMesh.position.set( x, 0, z );
      oppoCornerWallMesh.position.set( Math.abs( x ), 0, Math.abs( z ) );

      cornerWallMesh.updateMatrix();
      oppoCornerWallMesh.updateMatrix();

      cornerWallMesh.castShadow        = true;
      oppoCornerWallMesh.castShadow    = true;
      cornerWallMesh.receiveShadow     = true;
      oppoCornerWallMesh.receiveShadow = true;

      this.wallsMeshes.add( cornerWallMesh );
      this.wallsMeshes.add( oppoCornerWallMesh );

      cornerWallMesh     = new Mesh( wallGeometry, wallMaterial );
      oppoCornerWallMesh = new Mesh( wallGeometry, wallMaterial );

      cornerWallMesh.matrixAutoUpdate     = false;
      oppoCornerWallMesh.matrixAutoUpdate = false;

      cornerWallMesh.position.set( x, 0, Math.abs( z ) );
      oppoCornerWallMesh.position.set( Math.abs( x ), 0, z );

      cornerWallMesh.updateMatrix();
      oppoCornerWallMesh.updateMatrix();

      cornerWallMesh.castShadow        = true;
      oppoCornerWallMesh.castShadow    = true;
      cornerWallMesh.receiveShadow     = true;
      oppoCornerWallMesh.receiveShadow = true;

      this.wallsMeshes.add( cornerWallMesh );
      this.wallsMeshes.add( oppoCornerWallMesh );

      for ( let i = Math.ceil( -this.depth / 2 ); i < Math.ceil( this.depth / 2 ); i++ ) {
         wallGeometry = new BoxGeometry( 0.5, 2, 1 );

         if ( i === Math.floor( this.depth / 2 ) || i === Math.ceil( -this.depth / 2 ) ) {
            wallGeometry = new BoxGeometry( 0.5, 2, 1.5 );
         }

         let wallMesh     = new Mesh( wallGeometry, wallMaterial );
         let oppoWallMesh = new Mesh( wallGeometry, wallMaterial );

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;


         wallMesh.position.set( x, 0, i );
         oppoWallMesh.position.set( Math.abs( x ), 0, i );

         wallMesh.updateMatrix();
         oppoWallMesh.updateMatrix();

         wallMesh.castShadow        = true;
         oppoWallMesh.castShadow    = true;
         wallMesh.receiveShadow     = true;
         oppoWallMesh.receiveShadow = true;

         this.wallsMeshes.add( wallMesh );
         this.wallsMeshes.add( oppoWallMesh );
      }

      for ( let i = Math.ceil( -this.width / 2 ); i < Math.ceil( this.width / 2 ); i++ ) {
         wallGeometry = new BoxGeometry( 1, 2, 0.5 );

         if ( i === Math.floor( this.width / 2 ) || i === Math.ceil( -this.width / 2 ) ) {
            wallGeometry = new BoxGeometry( 1.5, 2, 0.5 );
         }

         let wallMesh     = new Mesh( wallGeometry, wallMaterial );
         let oppoWallMesh = new Mesh( wallGeometry, wallMaterial );

         wallMesh.matrixAutoUpdate     = false;
         oppoWallMesh.matrixAutoUpdate = false;

         wallMesh.position.set( i, 0, z );
         oppoWallMesh.position.set( i, 0, Math.abs( z ) );

         wallMesh.updateMatrix();
         oppoWallMesh.updateMatrix();

         wallMesh.castShadow        = true;
         oppoWallMesh.castShadow    = true;
         wallMesh.receiveShadow     = true;
         oppoWallMesh.receiveShadow = true;

         this.wallsMeshes.add( wallMesh );
         this.wallsMeshes.add( oppoWallMesh );
      }


      this.world.scene.add( this.wallsMeshes );

   }


   generateRooms( count, options = null ) {

   }


   generateBackground( options = null ) {

      if ( options === null ) {
         this.world.scene.background = this.background;
         this.world.scene.fog        = this.outBoundFog;


      }

   }


   updateFog( delta ) {



   }


   generateFloor() {
      this.floorMesh.clear();

      const floorGeometry = new PlaneGeometry( this.width, this.depth, 1, 1 );
      const grass         = new MeshBasicMaterial( { map: this.world.assetManager.textures.get( 'Grass' ) } );
      const summerGrass   = new MeshBasicMaterial( { map: this.world.assetManager.textures.get( 'SummerGrass' ) } );
      const leaves        = new MeshBasicMaterial( { map: this.world.assetManager.textures.get( 'BushLeaves' ) } );
      // var floorMaterials           = {};
      // floorMaterials['grass']      = new MeshBasicMaterial({map: this.world.assetManager.textures.get('SummerGrass')});
      // floorMaterials['dirt']       = new MeshBasicMaterial({map: this.world.assetManager.textures.get('SummerDirt')});
      // floorMaterials['moss']       = new MeshBasicMaterial({map: this.world.assetManager.textures.get('SummerMoss')});
      // floorMaterials['mud']        = new MeshBasicMaterial({map: this.world.assetManager.textures.get('SummerMud')});
      // floorMaterials['bushLeaves'] = new MeshBasicMaterial({map: this.world.assetManager.textures.get('BushLeaves')});

      var material        = new MeshToonMaterial( { map: this.world.assetManager.textures.get( 'Grass' ) } );
      var plane           = new Mesh( floorGeometry, material );
      plane.rotation.x    = -1 * Math.PI / 2;
      plane.position.y    = 0.1;
      plane.receiveShadow = true;
      plane.castShadow    = false;
      // plane.matrixAutoUpdate = false;
      plane.name          = 'Ground';

      this.grass = new ShaderMaterial( {
         vertexShader, fragmentShader, uniforms: this.uniforms, side: DoubleSide
      } );

      const instanceNumber = 1800000;
      const dummy          = new Object3D();

      const grassGeometry = new PlaneGeometry( 0.1, 2, 1, 2 );
      grassGeometry.translate( 0, 0.2, 0 );

      const leavesGeometry = new PlaneGeometry( 0.2, 0.1, 2, 1 );

      const grassMesh  = new InstancedMesh( grassGeometry, leaves, instanceNumber );
      const leavesMesh = new InstancedMesh( leavesGeometry, leaves, instanceNumber );

      const grassInstancedMesh = new InstancedMesh( grassGeometry, this.grass, instanceNumber );
      grassInstancedMesh.name  = 'Grass';

      const leavesInstancedMesh = new InstancedMesh( leavesGeometry, leaves, instanceNumber );
      leavesInstancedMesh.name  = 'Leaves';

      for ( let i = 0; i < instanceNumber; i++ ) {

         dummy.position.set( MathUtils.randFloatSpread( 150 ), 0, MathUtils.randFloatSpread( 150 ) );
         dummy.rotation.y = Math.random() * Math.PI;
         dummy.updateMatrix();
         grassInstancedMesh.setMatrixAt( i, dummy.matrix );

         // dummy.position.set(MathUtils.randFloatSpread(500), 0, MathUtils.randFloatSpread(500));
         // dummy.updateMatrix();
         // leavesInstancedMesh.setMatrixAt(i, dummy.matrix);

      }

      this.floorMesh.add( plane );
      this.floorMesh.add( grassInstancedMesh );
      this.floorMesh.add( leavesInstancedMesh );
      this.world.scene.add( this.floorMesh );

   }


   generateLights( options = null, DEBUG = false ) {
      const dirLight     = new DirectionalLight( 0xffffff, 0.6 );
      const ambientLight = new AmbientLight( 0xcccccc, 0.4 );

      if ( options === null ) {

         ambientLight.matrixAutoUpdate = false;

         this.world.scene.add( ambientLight );

         dirLight.position.set( 1, 10, -1 );
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

         this.world.scene.add( dirLight );
      } else {

      }

      /* TODO: DEBUG */
      if ( DEBUG ) {
         this.world.scene.add( new CameraHelper( dirLight.shadow.camera ) );
      }

   }



   update( x, y, z ) {

      if ( x === this.width && y === this.height && z === this.depth ) {
         return;
      }

      this.width  = x;
      this.depth  = z;
      this.height = y;

      this.generateFloor();
      // this.generateWalls();

   }


   animate( delta ) {
      this.grass.uniforms.time.value = delta;
      this.grass.uniformsNeedUpdate  = true;


   }



}



export { EnvironmentManager };



