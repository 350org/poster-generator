function getBase64Image(img) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  // Copy the image contents to the canvas
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  // Get the data-URL formatted image
  // Firefox supports PNG and JPEG. You could check img.src to
  // guess the original format, but be aware the using "image/jpg"
  // will re-encode the image.
  var dataURL = canvas.toDataURL("image/png");

  // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  return dataURL;
}

MEME = {
  $: jQuery,

  render: function() {
    this.canvas && this.canvas.render();
  },

  init: function() {
    this.model = new this.MemeModel(window.MEME_SETTINGS || {});

    // Create renderer view:
    this.canvas = new this.MemeCanvasView({
      el: '#meme-canvas-view',
      model: this.model
    });

    // Create editor view:
    this.editor = new this.MemeEditorView({
      el: '#meme-editor-view',
      model: this.model
    });

    /* Re-render view after all fonts load:
    this.waitForFonts().then(function() {
      MEME.render();
    }); */


    fontDelay = function(){
      // console.log('delayed re-render.');
      setTimeout( MEME.render(), 100);
    }
    // Re-render after delay for webfonts
    setTimeout( fontDelay, 2000);
    setTimeout( fontDelay, 4000);
    setTimeout( fontDelay, 10000);
  }
};

MEME.$(function() {
  MEME.init();
});
