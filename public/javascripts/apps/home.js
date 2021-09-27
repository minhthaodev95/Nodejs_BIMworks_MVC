;(function (win, $) {
    'use strict';

    var spotlight = function() {
        var $spotlight = $('.spotlight'),
            $spotlightImage = $('.js-spotlight-list'),
            $spotlightDots = $spotlight.find('.spotlight__dots'),
            $spotlightBtnPrev = $spotlight.find('.spotlight__arrow--prev'),
            $spotlightBtnNext = $spotlight.find('.spotlight__arrow--next');

        $spotlightImage.slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,
            speed: 800,
            dots: true,
            appendDots: $spotlightDots,
            prevArrow: $spotlightBtnPrev,
            nextArrow: $spotlightBtnNext
        });
    };


    $(win).on('load', function() {
        spotlight();
    });

})(window, window.jQuery);
