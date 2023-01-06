import {Group}    from "three";
import {Obstacle} from "../entities/Obstacle.js";



class Ship extends Group {
   constructor(world, floor, walls, doors, obstacles, props, items, player) {
      super();
      this.world     = world;
      this.floor     = floor;
      this.walls     = walls;
      this.obstacles = obstacles;
      this.props     = props;
      this.items     = items;
      this.player    = player;

      this.add(floor);
      this.add(walls);
      this.add(doors);
      this.add(obstacles);
      this.add(props);
      this.add(items);
      this.add(player);
   }



}
