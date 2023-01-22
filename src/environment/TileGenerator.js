import {Group}    from "three";
import * as THREE from 'three';



const mapSize = 50;

let perlin = {
   randvect    : function () {
      let theta = Math.random() * 2 * Math.PI;
      return {x: Math.cos(theta), y: Math.sin(theta)};
   },
   dotprodgrid : function (x, y, vx, vy) {
      let gvect;
      let dvect = {x: x - vx, y: y - vy};
      if (this.gradients[[vx, vy]]) {
         gvect = this.gradients[[vx, vy]];
      } else {
         gvect                    = this.randvect();
         this.gradients[[vx, vy]] = gvect;
      }
      return dvect.x * gvect.x + dvect.y * gvect.y;
   },
   smootherstep: function (x) {
      return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
   },
   interp      : function (x, a, b) {
      return a + this.smootherstep(x) * (b - a);
   },
   seed        : function () {
      this.gradients = {};
      this.memory    = {};
   },
   get         : function (x, y) {
      if (this.memory.hasOwnProperty([x, y]))
         return this.memory[[x, y]];
      let xf              = Math.floor(x);
      let yf              = Math.floor(y);
      //interpolate
      let tl              = this.dotprodgrid(x, y, xf, yf);
      let tr              = this.dotprodgrid(x, y, xf + 1, yf);
      let bl              = this.dotprodgrid(x, y, xf, yf + 1);
      let br              = this.dotprodgrid(x, y, xf + 1, yf + 1);
      let xt              = this.interp(x - xf, tl, tr);
      let xb              = this.interp(x - xf, bl, br);
      let v               = this.interp(y - yf, xt, xb);
      this.memory[[x, y]] = v;
      return v;
   }
};
perlin.seed();


const setBlock = function () {

   const position   = new THREE.Vector3();
   const quaternion = new THREE.Quaternion();
   const scale      = new THREE.Vector3();

   return function (matrix, x, y, z) {
      position.x = x;
      position.y = y;
      position.z = z;

      scale.x = 1;
      scale.y = 3;
      scale.z = 1;

      matrix.compose(position, quaternion, scale);

   };

}();



class TileGenerator extends Group {
   constructor(params) {
      super();
      this.init(params);
   }


   init(params) {
      this.params = params;
      this.loadTiles();
   }


   initComponent() {
      // Register handles
   }


   loadTiles() {


      const GRIDSIZE   = 20;
      const RESOLUTION = 20;

      let numpixels  = GRIDSIZE / RESOLUTION;
      let totalCount = 0;
      let rowCount   = 0;


      for (let y = 0; y < GRIDSIZE; y += numpixels / GRIDSIZE) {
         for (let x = 0; x < GRIDSIZE; x += numpixels / GRIDSIZE) {
            totalCount++;
         }
      }
      const t0 = performance.now();

      // Create the projective grometry and material
      const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
      const material = new THREE.MeshLambertMaterial({color: '#f6e58d'});
      const mesh     = new THREE.InstancedMesh(geometry, material, totalCount);
      const matrix   = new THREE.Matrix4();
      let color      = new THREE.Color();

      let cellIndex = 0;
      for (let y = 0; y < GRIDSIZE; y += numpixels / GRIDSIZE) {
         rowCount++;

         let columnCount = 0;
         for (let x = 0; x < GRIDSIZE; x += numpixels / GRIDSIZE) {
            columnCount++;
            cellIndex++;
            setBlock(matrix, (columnCount - ((GRIDSIZE * RESOLUTION) / 2)) + .5, perlin.get(x, y) * 10, (rowCount - ((GRIDSIZE * RESOLUTION) / 2)) + .5);
            let v = parseInt(Math.abs(perlin.get(x, y) * 250));
            mesh.setColorAt(cellIndex, color.set('hsl(' + v + ',50%,50%)'));
            mesh.setMatrixAt(cellIndex, matrix);

         }
      }
      const t1 = performance.now();
      console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);

      console.log(mesh);

      this.params.scene.add(mesh);
      console.log(totalCount);
   }


};

export default TileGenerator;
