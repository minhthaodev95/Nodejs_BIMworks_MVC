;(function (win, $) {
    'use strict';
    function randomNum()
        {
            "use strict";
            return Math.floor(Math.random() * 9)+1;
        }
            var loop1,loop2,loop3,time=30, i=0, number, selector3 = document.querySelector('.thirdDigit'), selector2 = document.querySelector('.secondDigit'),
                selector1 = document.querySelector('.firstDigit');
            loop3 = setInterval(function()
            {
              "use strict";
                if(i > 40)
                {
                    clearInterval(loop3);
                    selector3.textContent = 4;
                }else
                {
                    selector3.textContent = randomNum();
                    i++;
                }
            }, time);
            loop2 = setInterval(function()
            {
              "use strict";
                if(i > 80)
                {
                    clearInterval(loop2);
                    selector2.textContent = 0;
                }else
                {
                    selector2.textContent = randomNum();
                    i++;
                }
            }, time);
            loop1 = setInterval(function()
            {
              "use strict";
                if(i > 100)
                {
                    clearInterval(loop1);
                    selector1.textContent = 4;
                }else
                {
                    selector1.textContent = randomNum();
                    i++;
                }
            }, time);

    var loading = function() {
        var $loading = $('.js_loading');

        var timeOut = setTimeout(function() {
            $loading.fadeOut(0, function() {
                $loading.remove();
            });

            clearTimeout(timeOut);
        }, 500);
    };
    

    var header = function() {
        var $header = $('#header');

        var headerPosition,
            headerHeight;

        if ($header.length) {
            headerPosition = $header.offset().top;
            headerHeight = $header.outerHeight();
        }

        $(win).on('scroll', function() {
            var initPosition = $(win).scrollTop();

            if (initPosition > (headerPosition + headerHeight)) {
                $header.addClass('header--sticky');
            } else {
                $header.removeClass('header--sticky');
            }
        }).scroll();
    };

    var scrollDirection = function() {
        var $header = $('#header');

        var lastScroll = 0,
            scrollDirection = null;

        onScroll(function() {
            var initPosition = $(win).scrollTop();

            if (initPosition > lastScroll) {
                // Scroll down
                if (scrollDirection !== 'scrollDown') {
                    scrollDirection = 'scrollDown';
                }
            } else {
                // Scroll up
                if (scrollDirection !== 'scrollUp') {
                    scrollDirection = 'scrollUp';
                }
            }

            lastScroll = initPosition;

            // Header check
            if ($header.hasClass('header--sticky')) {
                if (scrollDirection == 'scrollDown') {
                    if ($header.hasClass('animation-translate--down')) {
                        $header.removeClass('animation-translate--down').addClass('animation-translate--up');
                    }
                } else {
                    $header.removeClass('animation-translate--up').addClass('animation-translate--down');
                }
            } else {
                $header.removeClass('animation-translate--up animation-translate--down');
            }
            
        })();

        function onScroll(c, t) {
            onscroll = function() {
                clearTimeout(t);
                t = setTimeout(c, 150);
            };
            return c;
        }
    };

    var navtab = function() {
		var $navtab = $('.js-navtab');

		$navtab.find('.navtab__link').on('click', function() {
			// Control Navtab list
			$(this).parents('.navtab__list').find('.on').removeClass('on');
			$(this).addClass('on');

			// Control Navtab content
			var onIndex = $(this).parents('.navtab__item').index();

			$(this).parents('.navtab').find('.navtab__content-item').hide();
			$(this).parents('.navtab').find('.navtab__content-item').eq(onIndex).show();
		});
	};

    var skrollrParallax = function() {
        var s = skrollr.init({
            smoothScrolling: false,
            forceHeight: false,
            easing: {
                inverted: function(p) {
                    return 1-p;
                }
            }
        });
    };


    $(win).on('load', function() {
        skrollrParallax();
        header();
        scrollDirection();
        navtab();
        loading();
    });
    randomNum();


})(window, window.jQuery);
