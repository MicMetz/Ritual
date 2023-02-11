import StorageGridSystem from "../system/StorageGridSystem.js";



class InventorySystem {
   constructor() {
      this.grid         = new StorageGridSystem();
      this.imageFactory = new ImageFactory()
      this.tooltip      = new Tooltip()
   }


   show() {
      this.grid.show()
      let img = this.imageFactory.getOneImage( this.imageFactory.list().gold )
      this.tooltip.setDescription( img, this.imageFactory.list().gold.description )
      this.grid.get( 8 ).appendChild( img );
   }


   hide() {
      this.grid.hide()
   }
}
