;(function (win, $) {
    'use strict';

    var aboutMain = function() {
        var $aboutMainImage = $('.js-aboutus-main-list-img');

        $aboutMainImage.slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 800,
            dots: true
        });
    };


    $(win).on('load', function() {
        aboutMain();
    });

})(window, window.jQuery);
