/*
* MemeEditorView
* Manages form capture, model updates, and selection state of the editor form.
*/
MEME.MemeEditorView = Backbone.View.extend({


  initialize: function() {
    //this.buildForms();
    this.buildFormsFromConfig();
    this.createEvents();
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  buildFormsFromConfig: function(){
    var d = this.model.toJSON();
    var editor = $('.m-editor');

    function buildSelectOptions(opts) {
      return _.reduce(
        opts,
        function(memo, opt) {
          return (memo += [
            '<option value="', opt.hasOwnProperty("value") ? opt.value : opt, '">', opt.hasOwnProperty("text") ? opt.text : opt,"</option>"].join(""));
        },
        ''
      );
    }
    // loop through config file and build the inputs
    for (var field in d) {
      if ( d.hasOwnProperty(field) ){

        // set up wrapper and label for input
        if ( d[field].hasOwnProperty('name') && d[field].hasOwnProperty('inputType') ){
          editor.append('<div id="' + d[field]["name"] + '-wrapper" class="input-' + d[field]["inputType"] +'">');
          var wrapper = $("#"+ d[field]["name"] + '-wrapper');
          wrapper.append('<label for="' + d[field]["name"] + '">' + d[field]["label"] + '</label>')
        }

        // Input type: select dropdown
        if ( d[field]["inputType"] == 'select' ){
          var select = wrapper.append('<select id="' + d[field]["name"] + '" name="' + d[field]["name"] + '">');
          $('#'+ d[field]["name"]).append( buildSelectOptions(d[field]["inputOptions"]) );
        }

        // Input type: text
        if ( d[field]["inputType"] == 'text' ){
          var text = wrapper.append('<input type="text" id="' + d[field]["name"] + '" name="' + d[field]["name"] + '">');
        }
        // Input type: image
        if ( d[field]["inputType"] == 'imageUpload' ){
          var imageInputHTML = '<div id="' + d[field]["name"] + '-dropzone" class="dropzone">Drop Image Here</div><input type="file" class="loadinput" id="' + d[field]["name"] + '"></input>'
          wrapper.append(imageInputHTML);

        }
        // Input type: color
        if ( d[field]['inputType'] == 'color' && d[field]["inputOptions"].length) {
          var colorPicker = wrapper.append('<ul class="m-editor__color-picker">');
          var colorOpts = _.reduce(
            d[field]["inputOptions"],
            function(memo, opt) {
              var color = opt.hasOwnProperty("value") ? opt.value : opt;
              return (memo +=
                '<li><label><input class="m-editor__swatch" style="background-color:' +
                color +
                '" type="radio" name="' + d[field][name] + '" value="' +
                color +
                '"></label></li>');
            },
            ""
          );
          $("#" + d[field]["name"]).show().find("ul").append(colorOpts);
        }
      }
    }
  },

  /*
  // Build background color options:
  if (d.backgroundColorOpts && d.backgroundColorOpts.length) {
    var backgroundOpts = _.reduce(
      d.backgroundColorOpts,
      function(memo, opt) {
        var color = opt.hasOwnProperty("value") ? opt.value : opt;
        return (memo +=
          '<li><label><input class="m-editor__swatch" style="background-color:' +
          color +
          '" type="radio" name="background-color" value="' +
          color +
          '"></label></li>');
      },
      ""
    );

    $("#background-color").show().find("ul").append(backgroundOpts);
  }
}, */

  render: function(){
    var d = this.model.toJSON();
    for (var field in d) {
      if ( d.hasOwnProperty(field) && d[field].hasOwnProperty('inputType') ){
        // Preselect value if input type is checkbox...
        if ( d[field]['inputType'] == 'checkbox'){
          this.$('#' + d[field]["name"]).prop('checked', d[field]["inputValue"]);
        }
        // Preselect radio inputs
        else if ( d[field]['inputType'] == 'radio'){
          this.$('#' + d[field]["name"]).find('[value="' + d[field]["inputValue"] + '"]').prop("checked", true);
        }
        // Prefill all other input types
        else if ( d[field]['inputType'] == 'text' ){
          this.$('#' + d[field]["name"]).val( d[field]['inputValue'] );
        }
      }
    }
  },

  /* render: function() {
    // text inputs
    this.$('#headline').val(d.headlineText);
    this.$('#date-time').val(d.dateTimeText);
    this.$('#website-url').val(d.websiteUrlText);

    this.$('#aspect-ratio').val(d.aspectRatio);
    this.$('#watermark').val(d.watermarkSrc);
    this.$("#watermark-alpha").val(d.watermarkAlpha);
    this.$('#image-scale').val(d.imageScale);
    this.$('#font-size').val(d.fontSize);
    this.$('#font-family').val(d.fontFamily);
    this.$("#font-color").find('[value="' + d.fontColor + '"]').prop("checked", true);
    this.$("#overlay-alpha").val(d.overlayAlpha);
    this.$('#text-align').val(d.textAlign);
    this.$('#text-shadow').prop('checked', d.textShadow);
    this.$('#overlay').find('[value="'+d.overlayColor+'"]').prop('checked', true);
    this.$("#backgroundcolor").find('[value="' + d.backgroundColor + '"]').prop("checked", true);
  }, */

  /* events: {
    'input #headline': 'onHeadline',
    'input #date-time': 'onDateTime',
    'input #website-url': 'onWebsiteUrl',
    'input #credit': 'onCredit',
    'input #image-scale': 'onScale',
    'change #aspect-ratio': 'onAspectRatio',
    'change #font-size': 'onFontSize',
    'change #font-family': 'onFontFamily',
    'change [name="font-color"]': "onFontColor",
    "change #watermark": "onWatermark",
    "change #watermark-alpha": "onWatermarkAlpha",
    "change #text-align": "onTextAlign",
    "change #text-shadow": "onTextShadow",
    "change #overlay-alpha": "onOverlayAlpha",
    'change [name="overlay"]': "onOverlayColor",
    'change [name="background-color"]': "onBackgroundColor",

    "dragover #dropzone": "onZoneOver",
    "dragleave #dropzone": "onZoneOut",
    "drop #dropzone": "onZoneDrop",

    'change #loadinput': 'onFileLoad'
  }
    */
  events: {

  },

  createEvents: function(){
    var d = this.model.toJSON();
    for (var field in d){
      if ( d[field].hasOwnProperty('name') ){

        fieldName = d[field]['name'];
        fieldType = d[field]['inputType'];

        if ( fieldType == "select" ){
          this.events['change #' + fieldName] = 'on_' + fieldName;
          this['on_' + fieldName] = function(){
            this.model.set(fieldName, this.$('#' + fieldName).val());
          }
        }
        else if ( fieldType == "imageUpload" ){
          this.events['dragover #' + fieldName + '-dropzone'] = 'on_' + fieldName + '_over';
          this.events['dragleave #' + fieldName + '-dropzone'] = 'on_' + fieldName + '_out';
          this.events['drop #' + fieldName + '-dropzone'] = 'on_' + fieldName + '_drop';
          this.events['change #' + fieldName] = 'on_' + fieldName;
          this['on_' + fieldName] = function(){
            this.model.set(fieldName, this.$('#' + fieldName).val());
          }
        }
        else {
          this.events['input #' + fieldName] = 'on_' + fieldName;
          this['on_' + fieldName] = function(){
            this.model.set(fieldName, this.$('#' + fieldName).val());
            console.log(fieldName + ': ' + this.$('#' + fieldName).val());
          }
        }
      }
    }
    console.log(this.events);
    console.log(this);
  },


  /*
  onCredit: function() {
    this.model.set('creditText', this.$('#credit').val());
  },



  onHeadline: function() {
    this.model.set('headlineText', this.$('#headline').val());
  },
  onDateTime: function() {
    this.model.set('dateTimeText', this.$('#date-time').val());
  },
  onWebsiteUrl: function() {
    this.model.set('websiteUrlText', this.$('#website-url').val());
  },

  onAspectRatio: function() {
    this.model.set("aspectRatio", this.$("#aspect-ratio").val())
  },
  onTextAlign: function() {
    this.model.set('textAlign', this.$('#text-align').val());
  },

  onTextShadow: function() {
    this.model.set('textShadow', this.$('#text-shadow').prop('checked'));
  },

  onFontSize: function() {
    this.model.set('fontSize', this.$('#font-size').val());
  },

  onFontFamily: function() {
    this.model.set('fontFamily', this.$('#font-family').val());
  },

  onFontColor: function(evt) {
    this.model.set("fontColor", this.$(evt.target).val());
  },

  onWatermark: function() {
    this.model.set('watermarkSrc', this.$('#watermark').val());
    if (localStorage) localStorage.setItem('meme_watermark', this.$('#watermark').val());
  },

  onWatermarkAlpha: function() {
    this.model.set("watermarkAlpha", this.$("#watermark-alpha").val());
  },

  onScale: function() {
    this.model.set('imageScale', this.$('#image-scale').val());
  },

  onOverlayAlpha: function() {
    this.model.set("overlayAlpha", this.$("#overlay-alpha").val());
  },

  onOverlayColor: function(evt) {
    this.model.set('overlayColor', this.$(evt.target).val());
  },

  onBackgroundColor: function(evt) {
    this.model.set("backgroundColor", this.$(evt.target).val());
  },
  */

  onFileLoad: function(evt){
    input = evt.target
    if (input.files && input.files[0]) {
      this.model.loadBackground(input.files[0]);
      this.$('#dropzone').removeClass('pulse');
    }
  },

  getDataTransfer: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    return evt.originalEvent.dataTransfer || null;
  },

  onZoneOver: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      dataTransfer.dropEffect = 'copy';
      this.$('#dropzone').addClass('pulse');
    }
  },

  onZoneOut: function(evt) {
    this.$('#dropzone').removeClass('pulse');
  },

  onZoneDrop: function(evt) {
    var dataTransfer = this.getDataTransfer(evt);
    if (dataTransfer) {
      this.model.loadBackground(dataTransfer.files[0]);
      this.$('#dropzone').removeClass('pulse');
    }
  }
});
