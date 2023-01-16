import {AudioLoader, AudioListener, Raycaster} from "three";



class PlayerActionController {

   constructor(owner) {
      this.owner         = owner;
      this.audioLoader   = new AudioLoader();
      this.audioListener = new AudioListener();
      this.raycaster     = new Raycaster();

      this._isShooting  = false;
      this._isReloading = false;
      this._isRunning   = false;

      this.shootingModes = ['SEMI', 'AUTO', 'BURST'];
      this.shootingMode  = 'SEMI';

      this.perspectiveHandler = this.onPerspectiveToggle.bind(this);
      this.interactionHandler = this.onInteractionToggle.bind(this);
      this.inventoryHandler   = this.onInventoryToggle.bind(this);
      this.reloadHandler      = this.onReloadToggle.bind(this);
      this.equipHandler       = this.onEquipToggle.bind(this);
      this.fireHandler        = this.onFireToggle.bind(this);
      this.hitmarkerHandler   = this.onHitMarker.bind(this);
      this.connect();
   }


   connect() {
      document.addEventListener('perspectiveToggle', this.perspectiveHandler, false);
      document.addEventListener('interactionToggle', this.interactionHandler, false);
      document.addEventListener('inventoryToggle', this.inventoryHandler, false);
      document.addEventListener('reloadToggle', this.reloadHandler, false);
      document.addEventListener('equipToggle', this.equipHandler, false);
      document.addEventListener('fireToggle', this.fireHandler, false);
      document.addEventListener('hitmarker', this.hitmarkerHandler, false);

   }


   disconnect() {
      document.removeEventListener('perspectiveToggle', this.perspectiveHandler, false);
      document.removeEventListener('interactionToggle', this.interactionHandler, false);
      document.removeEventListener('inventoryToggle', this.inventoryHandler, false);
      document.removeEventListener('reloadToggle', this.reloadHandler, false);
      document.removeEventListener('equipToggle', this.equipHandler, false);
      document.removeEventListener('fireToggle', this.fireHandler, false);
      document.removeEventListener('hitmarker', this.hitmarkerHandler, false);
   }


   onPerspectiveToggle() {

   }


   onInteractionToggle(e) {

   }


   onInventoryToggle() {

   }


   onReloadToggle() {

   }


   onEquipToggle() {

   }


   onFireToggle() {

   }


   onHitMarker() {

   }


}


export {PlayerActionController};
