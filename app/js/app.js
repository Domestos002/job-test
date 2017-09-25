;(function (win, doc, $) {
    'use strict';

    var body = doc.querySelectorAll("body")[0];
    var html = doc.querySelectorAll("html")[0];

    function slideOut() {
        var slideout = new Slideout({
            'panel': document.getElementById('site-wrapper'),
            'menu': document.getElementById('slide-menu'),
            'padding': 320,
            'tolerance': 70
        });
        let toggle = document.getElementById('js-mobile-burger');
        slideout.disableTouch();
        var offcanvas = document.getElementById('offcanvas');
        var wrapper = document.getElementById('site-wrapper');
        var mobileFilter = document.getElementById('mobile-filter');
        var overlay = document.getElementById('site-wrapper-overlay');
        var b = $('body');

        var jumpFix = function () {
            var bWidth = b.outerWidth();
            var scrollbar = window.innerWidth - bWidth;

            slideout.on('beforeopen', function () {
                overlay.classList.add("open");
                overlay.classList.add("open");
                if (window.innerWidth - bWidth != 0) {
                    b.css({"padding-right": scrollbar});
                }
            });

            slideout.on('close', function () {
                overlay.classList.remove("open");
                b.css({"padding-right": "0"});
            });
        };

        overlay.addEventListener('click', function () {
            slideout.close();
        });

        if (toggle) {
            toggle.addEventListener('click', function () {
                slideout.on('beforeopen', function () {
                    slideout.menu.classList.add("open");
                });
                console.log("toggle");
                slideout.toggle();
            });
        }

        jumpFix();

        win.addEventListener("resize", function () {
            jumpFix();
            // $(".page-header__logo-panel").css({"position" : "fixed"});
        });


        overlay.addEventListener('click', function () {
            slideout.close($(".page-header__logo-panel").outerHeight() + " :height suka");
        });

        var burgers = doc.querySelectorAll('.hamburger.hamburger-slide-toggle');
        var closes = doc.querySelectorAll('.slide-menu__close');
        for (var j = 0; j < closes.length; j++) {
            var close = closes[j];
            close.addEventListener('click', function () {
                slideout.close();
            });
        }
        for (var i = 0; i < burgers.length; i++) {
            var burger = burgers[i];
            burger.addEventListener('click', function () {
                offcanvas.classList.remove("hidden");
                mobileFilter.classList.add("hidden");
                slideout.on('beforeopen', function () {
                    slideout.menu.classList.add("open");

                });
                slideout.toggle();
            });
        }
    }

    win.addEventListener("load", function () {
        $(".js-main-banner-timer").countdown('2020/10/10', function(event) {
            $(this).html(event.strftime('%H : %M : %S'));
        });
        $(".js-record-timer").countdown('2017/10/4', function(event) {
            $(this).html(event.strftime('%D'));
        });
        slideOut();
    });


    doc.addEventListener("DOMContentLoaded", function () {

    });

    $( window ).on( "orientationchange", function( event ) {

    });



})(window, document, window.jQuery);



