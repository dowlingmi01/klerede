var $ = require('jquery');

module.exports = function (selector) {
    if (window) {
        $(".printable-block").addClass('unprintable');
        $(selector).addClass('solo');
        window.print();
        $(selector).removeClass('solo');
        $(".printable-block").removeClass('unprintable');
    }
}