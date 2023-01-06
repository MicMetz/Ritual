/**
 * @author MicMetzger /
 */



const startButton = document.getElementById('start-button');

import('./core/World.js').then((game) => {
    startButton.onclick = function () {
        game.start();
    }
});

