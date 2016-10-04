var $ = require("jquery");
var html2canvas = require("html2canvas");
var saveAs = require("file-saver").saveAs;

var toBlob = require('canvas-to-blob');
toBlob.init();

var global = Function('return this')();
global.Promise = require("es6-promise").Promise;


module.exports = function (selector, options, imageName) {

    if (!imageName) 
        imageName = selector.substr(1).replace(/#|-widget/ig, '');

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
    
    forceCSSProperty("svg path", "fill");
    forceCSSProperty("svg", "width");
    forceCSSProperty("svg", "height");

    html2canvas( $(selector).get(0), options ).then(function(canvas) {
        
        restoreCSSProperty("svg path", "fill");
        restoreCSSProperty("svg", "width");
        restoreCSSProperty("svg", "height");
        
        $(window).scrollTop(scrollTop);
        
        $(selector).removeClass("saving");
        canvas.toBlob(function(blob) {
            saveAs(blob, imageName);
        });
    });
}

function forceCSSProperty(selector, property) {
    $.each ($(selector), function (i, val) {
        var prop = $(val).attr(property);
        var computedProp = getComputedStyle(val)[property];
        $(val).attr("data-original-"+property, prop);
        $(val).attr(property, computedProp);
    });
    
}
function restoreCSSProperty(selector, property) {
    $.each ($(selector), function (i, val) {
        var originalProp = $(val).attr('data-original-'+property);
        $(val).removeAttr('data-original-'+property);
        if( !originalProp) {
            $(val).removeAttr(property);
        } else {
            $(val).attr(property, originalProp);
        }
    });
}
