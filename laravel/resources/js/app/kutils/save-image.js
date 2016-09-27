var $ = require("jquery");
var html2canvas = require("html2canvas");
var saveAs = require("file-saver").saveAs;

var global = Function('return this')();
global.Promise = require("es6-promise").Promise;


module.exports = function (selector, options) {

    var imageName = selector.substr(1).replace(/#|-widget/ig, '');

    if (window.safari) {
        if (!confirm("Please use CMD+S to save your image")) {
            return;
        };
    } else if( window.opera ){
        alert("Save not supported in Opera Browser yet.");
        return;
    } else {
        imageName = prompt("Enter a file name for your image", imageName);
    }
    
    if (!imageName) return;
    
    if ( ! (/.png$/i).test(imageName) )
        imageName = imageName + ".png";
    
    $(selector).addClass("saving");
    
    if (!options) options = {};
    // options.logging = true;
    var scrollTop = $(window).scrollTop();
    $(window).scrollTop(0);

    html2canvas( $(selector).get(0), options ).then(function(canvas) {
        
        $(window).scrollTop(scrollTop);
        
        $(selector).removeClass("saving");
        canvas.toBlob(function(blob) {
            saveAs(blob, imageName);
        });
    });
}
