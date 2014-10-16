/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
    Created on : 7/07/2014, 08:35:16 AM
    Author     : Diego Martínez AKA Huron
*/

function resizeGame(Game) {
    var size = {
        width : window.innerWidth,
        height : window.innerHeight
    };


    console.log('resizing to ', size.width, size.height);


    Game.width = size.width;
    Game.height = size.height;
    Game.canvas.width = size.width;
    Game.canvas.height = size.height;


    Game.world.setBounds(0, 0, level.fullPixelW, level.fullPixelH);


    Game.scale.width = size.width;
    Game.scale.height = size.height;


    if (Game.debug.sprite) {
        Game.stage.removeChild(Game.debug.sprite);
        Game.debug.sprite = null;
        Game.debug.textureFrame = null;
        if (Game.debug.texture) {
            Game.debug.texture.destroy();
        }
        Game.debug.texture = null;
        if (Game.debug.baseTexture) {
            Game.debug.baseTexture.destroy();
        }
        Game.debug.baseTexture = null;
        Game.debug.context = null;
        Game.debug.canvas = null;
        Game.debug.boot();
    }


    Game.renderer.resize(size.width, size.height);
    Game.scale.setSize();


    Game.camera.setSize(size.width, size.height);
    Game.camera.setBoundsToWorld();


    resizeTimeout = false;
}

function asyncEach(array, fn, progress, finished) {
  var i = 0,
      maxBurnTime = 100, // ms to run before yielding to user agent
      finishedFn = finished || progress,
      progressFn = (finishedFn === progress ? null : progress);
 
  function iter() {
    var startTime = Date.now();
 
    while(i < array.length) {
      fn.call(array, array[i], i++);
 
      if(Date.now() - startTime > maxBurnTime) {
        if(progressFn) progressFn(i, array.length);
        return window.setTimeout(iter, 0);
      }
    }
 
    if(progressFn) progressFn(i, array.length);
    if(finishedFn) finishedFn(null, array);
  }
  window.setTimeout(iter, 0);
}