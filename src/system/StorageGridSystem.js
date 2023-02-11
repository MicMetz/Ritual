import CACHE from '../etc/Cache.js';



export default class StorageGridSystem {
   constructor() {
      this.container = document.createElement( 'main' );

      for ( let index = 0; index < 9; index++ ) {
         let slot = document.createElement( 'div' );

         let slotNumber = this.createSlotNumber();
         slotNumber.classList.add( 'hide' );

         slot.appendChild( slotNumber );
         slot.classList.add( 'slot' );
         slot.id = 'slot' + index;
         slot.addEventListener( 'drop', ( e ) => {
            let originSlot = document.getElementById( e.dataTransfer.getData( "imgParent" ) );
            //to delete
            if ( slot.id === 'slot' + 0 ) {
               originSlot.querySelector( '.slot-number' ).classList.add( 'hide' );
               originSlot.querySelector( '.slot-number' ).innerText = '0';
               document.getElementById( e.dataTransfer.getData( "img" ) ).remove();
               return;
            }

            //is the origin and destiny are the same
            if ( slot.id === e.dataTransfer.getData( "imgParent" ) ) {
               return;
            }

            //same creator
            if ( slot.id === 'slot' + 8 ) {
               return;
            }

            //straight from creator-slot to rubbish bin
            if ( e.dataTransfer.getData( "imgParent" ) === 'slot' + 8 && slot.id === 'slot' + 0 ) {
               return;
            }

            //if slot is not empty
            if ( slot.children.length === 2 ) {
               let item = document.getElementById( e.dataTransfer.getData( "img" ) );
               if ( !item.dataset.stackable ) {
                  return;
               }

               //if it is the same item
               if ( slot.querySelector( 'img' ).id === item.id ) {
                  if ( e.dataTransfer.getData( "imgParent" ) !== 'slot' + 8 ) {
                     item.remove();
                     originSlot.querySelector( '.slot-number' ).classList.add( 'hide' );
                     let origiQ                                     = originSlot.querySelector( '.slot-number' ).innerText * 1;
                     let currentQ                                   = slot.querySelector( '.slot-number' ).innerText * 1;
                     slot.querySelector( '.slot-number' ).innerText = origiQ + currentQ;
                     return;
                  }
               }
            }

            //if slot is empty
            if ( slot.children.length === 1 ) {
               let item = document.getElementById( e.dataTransfer.getData( "img" ) );
               if ( e.dataTransfer.getData( "imgParent" ) !== 'slot' + 8 ) {
                  item.remove();
                  originSlot.querySelector( '.slot-number' ).classList.add( 'hide' );
                  originSlot.querySelector( '.slot-number' ).innerText = '0';
               }
               slot.appendChild( item );
               if ( item.dataset.stackable ) {
                  slot.querySelector( '.slot-number' ).classList.remove( 'hide' )
                  slot.querySelector( '.slot-number' ).innerText = '1'


               }

               return;
            }

         } );

      }

      this.ui = {
         container: this.container,
      }

   }


   connect() {
      CACHE.get( 'ui' ).appendChild( this.ui.container );
   }


   createSlotNumber() {
      let slotNumber = document.createElement( 'span' );
      slotNumber.classList.add( 'slot-number' );
      slotNumber.innerText = '0';
      return slotNumber;
   }


   get( index ) {

   }


   show() {

   }


   hide() {

   }

}
