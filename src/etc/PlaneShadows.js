import {BackSide, Mesh, MeshStandardMaterial, PlaneGeometry} from "three";



const geometry      = new PlaneGeometry(300, 300, 60, 60);
let colorStr        = Math.random().toString().slice(2, 8)
colorStr            = 'ffff00'
const material      = new MeshStandardMaterial({
   color    : '#' + colorStr, side: BackSide,
   wireframe: true
});
const plane         = new Mesh(geometry, material);
plane.castShadow    = true; //default is false
plane.receiveShadow = true; //default
plane.position.set(0, 0, 0)
// plane.layers.enable( 1 );
plane.name = 'plane'

export default plane
