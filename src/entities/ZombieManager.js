import {Zombie} from './enemies/Zombie.js';



class ZombieManager {
   constructor(world, zombieContainer) {
      this.world   = world;
      this.zombies = zombieContainer;
      this.count   = 0;
   }


   updateZombieCount() {
      this.count = this.zombies.length;
      return this.count;
   }


    addZombie(position) {
       let zombie = new Zombie(this.world, position);
       this.zombies.push(zombie);
       return zombie;
    }


}
