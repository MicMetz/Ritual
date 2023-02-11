export class Inventory {
   stats = {}


   constructor( params ) {
      this.map        = new Map();
      this.categories = new Map();
      this.size       = 0;
      this.maxSize    = 10;
   }


   add( item ) {
      if ( this.size >= this.maxSize ) {
         console.log( 'inventory full' );
         return false;
      }

      if ( this.map.has( item.name ) ) {
         if ( this.map.get( item.name ).stackable ) {
            this.map.get( item.name ).quantity++;
            this.size++;
            if ( this.categories.has( item.category ) ) {
               this.categories.get( item.category ).quantity++;
               this.categories.append( item.category, item.name );
            } else {
               this.categories.set( item.category, { quantity: 1, items: [ ...item.name ] } );
            }
            return true;

         } else {
            console.log( 'item not stackable' );
            return false;
         }
      } else {
         this.map.set( item.name, item );
         this.size++;
         if ( this.categories.has( item.category ) ) {
            this.categories.get( item.category ).quantity++;
            this.categories.append( item.category, item.name );
         } else {
            this.categories.set( item.category, { quantity: 1, items: [ ...item.name ] } );
         }
         return true;
      }
   }


   remove( item ) {
      if ( this.map.has( item.name ) ) {
         if ( this.map.get( item.name ).stackable ) {
            if ( this.map.get( item.name ).quantity > 1 ) {
               this.map.get( item.name ).quantity--;
               this.size--;
               this.categories.get( item.category ).quantity--;
               this.categories.get( item.category ).items.splice( this.categories.get( item.category ).items.indexOf( item.name ), 1 );
               return true;
            } else {
               this.map.delete( item.name );
               this.size--;
               this.categories.get( item.category ).quantity--;
               this.categories.get( item.category ).items.splice( this.categories.get( item.category ).items.indexOf( item.name ), 1 );
               return true;
            }
         } else {
            this.map.delete( item.name );
            this.size--;
            this.categories.get( item.category ).quantity--;
            this.categories.get( item.category ).items.splice( this.categories.get( item.category ).items.indexOf( item.name ), 1 );
            return true;
         }
      } else {
         console.log( 'item not in inventory' );
         return false;
      }
   }


   getSize() {
      return this.size;
   }


   getMaxSize() {
      return this.maxSize;
   }


   getItems() {
      return this.map;
   }


   getCategories() {
      return this.categories;
   }


   getItemsByCategory( category ) {
      return this.categories.get( category );
   }


   getItemByName( name ) {
      return this.map.get( name );
   }


   getItemByIndex( index ) {
      return this.map[ index ];
   }


   getItemByCategoryAndIndex( category, index ) {
      return this.categories.get( category ).items[ index ];
   }


   getItemByCategoryAndName( category, name ) {
      return this.categories.get( category ).items[ name ];
   }


   getInventory() {}


   getInventoryItem( item ) {

   }


   getInventoryMenu() {
      const inventoryMenu = document.createElement( 'div' );
      inventoryMenu.classList.add( 'inventory-menu' );
      inventoryMenu.innerHTML = `
            <div class="inventory-menu__header">
                <h2>Inventory</h2>
                ${this.getInventory().map( item => `
                    <div class="inventory-menu__item">
                        <img src="${item.image}" alt="${item.name}" />
                        <span>${item.name}</span>
                    </div>
                ` ).join( '' )}
            </div>
        `;
      return inventoryMenu;
   }


   getStats() {

   }


   getStatsMenu() {
      const statsMenu = document.createElement( 'div' );
      statsMenu.classList.add( 'stats-menu' );
      statsMenu.innerHTML = `
            <div class="stats-menu__header">
                <h2>Stats</h2>
                ${this.getStats().map( stat => `
                    <div class="stats-menu__item">
                        <span>${stat.name}+ : </span>
                        <span>${stat.value}</span>
                    </div>
                ` ).join( '' )}
            </div>
        `;
      return statsMenu;
   }
}
