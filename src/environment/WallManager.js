const EMPTY = 0, HARD_WALL = 1, SOFT_WALL = 2;



class Walls {
   constructor(world, columns, rows) {
      this.world   = world;
      this.columns = columns;
      this.rows    = rows;
      this.cells   = new Array(columns * rows).fill(0);
   }


   get(x, y) {
      return this.cells[this.index(x, y)];
   }


   set(x, y, v) {
      this.cells[this.index(x, y)] = v;
   }


   index(x, y) {
      return x + this.columns * y;
   }


   coords(i) {
      const x = i % this.columns;
      const y = i / this.columns | 0;
      return [x, y];
   }


   defaultWalls() {
      this.forEach((x, y) => {
         if (x === 0
           || x === this.columns - 1
           || y === 0
           || y === this.rows - 1
           || (x % 2 === 0 && y % 2 === 0)
         ) {
            this.cells[this.index(x, y)] = HARD_WALL;
         }
         ;
      })

      this.buildMaze();
   }


   emptyWalls() {
      this.forEach((x, y) => {
         if (x === 0
           || x === this.columns - 1
           || y === 0
           || y === this.rows - 1
         ) {
            this.cells[this.index(x, y)] = HARD_WALL;
         }
         ;
      })

   }


   blow(x, y) {
      if (x < 0 || y < 0 || x > this.columns - 1 || y > this.rows - 1) return;
      if (this.cells[this.index(x, y)] === SOFT_WALL) {
         this.cells[this.index(x, y)] = EMPTY;
         return true;
      }
   }


   forEach(cb) {
      for (let row = 0; row < this.rows; row++) {
         for (let col = 0; col < this.columns; col++) {
            cb(col, row, this.get(col, row));
         }
      }
   }


   debugWalls() {
      let s = '';
      for (let row = 0; row < this.rows; row++) {
         for (let col = 0; col < this.columns; col++) {
            s += this.get(col, row) ? '#' : '.';
         }
         s += '\n'
      }
      return s;
   }


   buildMaze() {
      const stack = [];
      let current = [1, 1];
      this.set(...current, EMPTY);
      stack.push(current);

      while (stack.length > 0) {
         const neighbors = this.getNeighbors(...current);
         if (neighbors.length > 0) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];
            stack.push(current);
            this.set((current[0] + next[0]) / 2, (current[1] + next[1]) / 2, EMPTY);
            this.set(...next, EMPTY);
            current = next;
         } else {
            current = stack.pop();
         }
      }
   }


   getNeighbors(...numbers) {
      return undefined;
   }
}
