import {
   HashMath
} from '../etc/HashMath';



export default class SpacialHashGrid {
   constructor(bounds, dimensions) {
      const [x, y]    = dimensions;
      this.cells      = [...Array(x)].map(_ => [...Array(y)].map(_ => (null)));
      this.dimensions = dimensions;
      this.bounds     = bounds;
      this.queryIds   = 0;
   }


   getCellIndex(position) {
      const x = HashMath.sat((position[0] - this.bounds[0][0]) / (
        this.bounds[1][0] - this.bounds[0][0]));
      const y = HashMath.sat((position[1] - this.bounds[0][1]) / (
        this.bounds[1][1] - this.bounds[0][1]));

      const xIndex = Math.floor(x * (this.dimensions[0] - 1));
      const yIndex = Math.floor(y * (this.dimensions[1] - 1));

      return [xIndex, yIndex];
   }


   newClient(position, dimensions) {
      const client = {
         position  : position,
         dimensions: dimensions,
         cells     : {
            min  : null,
            max  : null,
            nodes: null,
         },
         queryId   : -1,
      };

      this.insert(client);

      return client;
   }


   updateClient(client) {
      const [x, y] = client.position;
      const [w, h] = client.dimensions;

      const i1 = this.getCellIndex([x - w / 2, y - h / 2]);
      const i2 = this.getCellIndex([x + w / 2, y + h / 2]);

      if (client.cells.min[0] === i1[0] &&
        client.cells.min[1] === i1[1] &&
        client.cells.max[0] === i2[0] &&
        client.cells.max[1] === i2[1]) {
         return;
      }
      this.remove(client);
      this.insert(client);
      // this.PrintClientPositions();
   }


   findNear(position, bounds) {
      const [x, y] = position;
      const [w, h] = bounds;

      const i1 = this.getCellIndex([x - w / 2, y - h / 2]);
      const i2 = this.getCellIndex([x + w / 2, y + h / 2]);

      const clients = [];
      const queryId = this.queryIds++;

      for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
         for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
            let head = this.cells[x][y];

            while (head) {
               const v = head.client;
               head    = head.next;

               if (v.queryId !== queryId) {
                  v.queryId = queryId;
                  clients.push(v);
               }
            }
         }
      }
      return clients;
   }


   printClientPositions() {
      console.clear();
      let spaceDic    = {};
      let rowCount    = 0;
      let columnCount = 0;
      this.cells.map(function (row) {
         columnCount = 0;
         row.map(function (point) {
            if (point) {
               let position       = String(rowCount) + ", " + String(columnCount);
               spaceDic[position] = point.client.entity.name;
            }
            columnCount += 1;
            return point;
         });
         rowCount += 1;
         return row;
      });
      console.log(JSON.stringify(spaceDic, 0, 2));
   }


   insert(client) {
      const [x, y] = client.position;
      const [w, h] = client.dimensions;
      const i1     = this.getCellIndex([x - w / 2, y - h / 2]);
      const i2     = this.getCellIndex([x + w / 2, y + h / 2]);

      const nodes = [];

      for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
         nodes.push([]);

         for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
            const xi = x - i1[0];

            const head = {
               next  : null,
               prev  : null,
               client: client,
            };

            nodes[xi].push(head);

            head.next = this.cells[x][y];
            if (this.cells[x][y]) {
               this.cells[x][y].prev = head;
            }

            this.cells[x][y] = head;
         }
      }

      client.cells.min   = i1;
      client.cells.max   = i2;
      client.cells.nodes = nodes;

   }


   remove(client) {
      const i1 = client.cells.min;
      const i2 = client.cells.max;

      for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
         for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
            const xi   = x - i1[0];
            const yi   = y - i1[1];
            const node = client.cells.nodes[xi][yi];

            if (node.next) {
               node.next.prev = node.prev;
            }
            if (node.prev) {
               node.prev.next = node.next;
            }

            if (!node.prev) {
               this.cells[x][y] = node.next;
            }
         }
      }

      client.cells.min   = null;
      client.cells.max   = null;
      client.cells.nodes = null;
   }
}
