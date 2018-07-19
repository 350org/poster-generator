/*
* MemeModel
* Manages rendering parameters and source image datas.
*/
MEME.MemeModel = Backbone.Model.extend({
  defaults: {
    aspectRatio: 'twitter',
    aspectRatioOpts: [
      {text: 'US Letter (8.5x11")', value: 'us-letter'},
      {text: 'US Flyer (11x17")', value: 'us-tabloid'},
      {text: 'A4 (210 x 297mm)', value: 'a4'},
      {text: 'A3 (297 x 420mm)', value: 'a3'}
    ],
    /* backgroundColor: '',
    backgroundColorOpts: ['#ffffff', '#17292e', '#0f81e8', '#40d7d4', '#FFAB03'], */
    backgroundPosition: { x: null, y: null },
    creditText: 'Source:',
    creditSize: 12,
    downloadName: 'share',
    fontColor: 'white',
    fontColorOpts: ['#ffffff', '#17292e', '#0f81e8', '#40d7d4', '#FFAB03'],
    fontFamily: 'Klima',
    fontFamilyOpts: ['Klima', 'Graph FF Condensed', 'Katwijk Mono'],
    fontSize: 26,
    headlineText: 'Write your own headline',
    dateTimeText: 'Monday, January 1 2020 – 8pm',
    websiteUrlText: 'myeventurl.org',
    height: 1060,
    imageScale: 1,
    imageSrc: '',
    overlayAlpha: 0.5,
    overlayColor: '#17292e',
    overlayColorOpts: ['#ffffff', '#17292e', '#0f81e8', '#40d7d4', '#FFAB03'],
    paddingRatio: 0.07,
    textAlign: 'left',
    textAlignOpts: [
      {text: 'Left-aligned', value: 'left'},
      {text: 'Center-aligned', value: 'center'},
      {text: 'Right-aligned', value: 'right'}
    ],
    /*textShadow: false,
    textShadowEdit: true, */
    watermarkAlpha: 1,
    watermarkMaxWidthRatio: 0.2,
    watermarkSrc: '<%= image_path("350-logo-v3-white.png") %>',
    watermarkOpts: [],
    width: 824
  },

  // Initialize with custom image members used for background and watermark:
  // These images will (sort of) behave like managed model fields.
  initialize: function() {
    this.background = new Image();
    this.watermark = new Image();

    // Set image sources to trigger "change" whenever they reload:
    this.background.onload = this.watermark.onload = _.bind(function() {
      this.trigger('change');
    }, this);

    // Set initial image and watermark sources:
    if (this.get('imageSrc')) this.background.src = this.get('imageSrc');
    if (this.get('watermarkSrc')) this.setWatermarkSrc(this.get('watermarkSrc'));

    // Update image and watermark sources if new source URLs are set:
    this.listenTo(this, 'change:imageSrc', function() {
      this.background.src = this.get('imageSrc');
    });
    this.listenTo(this, 'change:watermarkSrc', function() {
      this.setWatermarkSrc(this.get('watermarkSrc'));
    });
  },

  // Specifies if the background image currently has data:
  hasBackground: function() {
    return this.background.width && this.background.height;
  },

  // Loads a file stream into an image object:
  loadFileForImage: function(file, image) {
    var reader = new FileReader();
    reader.onload = function() { image.src = reader.result; };
    reader.readAsDataURL(file);
  },

  // Loads a file reference into the background image data source:
  loadBackground: function(file) {
    this.loadFileForImage(file, this.background);
  },

  // Loads a file reference into the watermark image data source:
  loadWatermark: function(file) {
    this.loadFileForImage(file, this.watermark);
  },

  // When setting a new watermark "src",
  // this method looks through watermark options and finds the matching option.
  // The option's "data" attribute will be set as the watermark, if defined.
  // This is useful for avoiding cross-origin resource loading issues.
  setWatermarkSrc: function(src) {
    var opt = _.findWhere(this.get('watermarkOpts'), {value: src});
    var data = (opt && opt.data) || src;

    // Toggle cross-origin attribute for Data URI requests:
    if (data.indexOf('data:') === 0) {
      this.watermark.removeAttribute('crossorigin');
    } else {
      this.watermark.setAttribute('crossorigin', 'anonymous');
    }

    this.watermark.src = data;
    this.set('watermarkSrc', src);
  }
});
