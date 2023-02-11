import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from "three";



const redMaterial   = new MeshBasicMaterial( { color: 0xFF0000 } );
const whiteMaterial = new MeshBasicMaterial( { color: 0xFF8000 } );
const ray           = () => {
   const geometry   = new BoxGeometry( .01, .01, 100 );
   const rayVisible = new Mesh( geometry, whiteMaterial );
   const ray        = new Group();

   rayVisible.position.z = 50.3
   ray.add( rayVisible )
   ray.visible = false
   return ray
}
export default ray

export { redMaterial, whiteMaterial }
