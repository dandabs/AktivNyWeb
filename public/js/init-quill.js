// Specify Quill fonts
var fontList = ['Arial', 'Courier', 'Verdana', 'Raleway', 'Comic Sans MS'];
var fontNames = fontList.map(font => getFontName(font));
var fonts = Quill.import('attributors/class/font');
fonts.whitelist = fontNames;
Quill.register(fonts, true);

// Add fonts to CSS style
var fontStyles = "";
fontList.forEach(function(font) {
    var fontName = getFontName(font);
    fontStyles += ".ql-snow .ql-picker.ql-font .ql-picker-label[data-value=" + fontName + "]::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=" + fontName + "]::before {" +
        "content: '" + font + "';" +
        "font-family: '" + font + "', sans-serif;" +
        "}" +
        ".ql-font-" + fontName + "{" +
        " font-family: '" + font + "', sans-serif;" +
        "}";
});

$(function() {
  // Append the CSS stylesheet to the page
  var node = document.createElement('style');
  node.innerHTML = fontStyles;
  document.body.appendChild(node);

});

// Generate code-friendly font names
function getFontName(font) {
    return font.toLowerCase().replace(/\s/g, "-");
}

var toolbarOptions = {

    container: [

  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  [{ 'font': fonts.whitelist }],
  [{ 'align': [] }],

  ['clean', 'link', 'image', 'video', 'emoji']                                         // remove formatting button

    ],

    handlers: {'emoji': function() {}}

};

  var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions,
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true,
        magicUrl: {
            normalizeUrlOptions: {
                stripWWW: true
            }
        },
        imageResize: {
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
        }
    },
    theme: 'snow',
    placeholder: 'Sanna Marinilla on seitsemäntoista sormea...',
  });