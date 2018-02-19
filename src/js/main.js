$(document).ready(function(){

  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  // detectors
  function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
  }

  function isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true
    } else {
      return false
    }
  }

  function msieversion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true
    } else {
      return false
    }
  }

  if ( msieversion() ){
    $('body').addClass('is-ie');
  }

  if ( isMobile() ){
    $('body').addClass('is-mobile');
  }


  // BREAKPOINT SETTINGS
  var bp = {
    mobileS: 375,
    mobile: 568,
    tablet: 768,
    desktop: 1024,
    wide: 1336,
    hd: 1680
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint(){
    var wHost = window.location.host.toLowerCase()
    var displayCondition = wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0
    if (displayCondition){
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>"+wWidth+"</div>";

      $('.page').append(content);
      setTimeout(function(){
        $('.dev-bp-debug').fadeOut();
      },1000);
      setTimeout(function(){
        $('.dev-bp-debug').remove();
      },1500)
    }
  }

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady(){
    legacySupport();

    updateHeaderActiveClass();

    initPopups();
    initMasks();
    // svgSetOffset();
    initScrollMonitor();
    formValidators();
    focusToggler();

    // development helper
    _window.on('resize', debounce(setBreakpoint, 200))
  }

  pageReady();


  //////////
  // COMMON
  //////////

  function legacySupport(){
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: true,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }



  // Prevent # behavior
	_document
    .on('click', '[href="#"]', function(e) {
  		e.preventDefault();
  	})
    .on('click', 'a[href^="#section"]', function() { // section scroll
      var el = $(this).attr('href');
      $('body, html').animate({
          scrollTop: $(el).offset().top}, 1000);
      return false;
    })


  // HAMBURGER TOGGLER
  _document
    .on('click', '.nav-icon', function(){
      $(this).toggleClass('is-open');
      $('.header-nav').toggleClass('is-active')
    })
    .on('click', '.menu-links li a', function(){
      closeMobileMenu();
    })

  function closeMobileMenu(){
    $('.nav-icon').removeClass('is-open');
    $('.header-nav').removeClass('is-active')
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering
  // user .active for li instead
  function updateHeaderActiveClass(){
    $('.header__menu li').each(function(i,val){
      if ( $(val).find('a').attr('href') == window.location.pathname.split('/').pop() ){
        $(val).addClass('is-active');
      } else {
        $(val).removeClass('is-active')
      }
    });
  }

  //////////
  // MODALS
  //////////

  function initPopups(){
    // Magnific Popup
    // var startWindowScroll = 0;
    // $('[js-popup]').magnificPopup({
    //   type: 'inline',
    //   fixedContentPos: true,
    //   fixedBgPos: true,
    //   overflowY: 'auto',
    //   closeBtnInside: true,
    //   preloader: false,
    //   midClick: true,
    //   removalDelay: 300,
    //   mainClass: 'popup-buble',
    //   callbacks: {
    //     beforeOpen: function() {
    //       startWindowScroll = _window.scrollTop();
    //       // $('html').addClass('mfp-helper');
    //     },
    //     close: function() {
    //       // $('html').removeClass('mfp-helper');
    //       _window.scrollTop(startWindowScroll);
    //     }
    //   }
    // });
    //
    // $('[js-popup-gallery]').magnificPopup({
  	// 	delegate: 'a',
  	// 	type: 'image',
  	// 	tLoading: 'Загрузка #%curr%...',
  	// 	mainClass: 'popup-buble',
  	// 	gallery: {
  	// 		enabled: true,
  	// 		navigateByImgClick: true,
  	// 		preload: [0,1]
  	// 	},
  	// 	image: {
  	// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
  	// 	}
  	// });

    $('.open-popup-link').magnificPopup({
      type: 'inline',
      midClick: true,
      removalDelay: 300,
      mainClass: 'mfp-fade'
    });

    $('.image-link').magnificPopup({
      type: 'image',
      retina: {
        ratio: 1,
        replaceSrc: function(item, ratio) {
          return item.src.replace(/\.\w+$/, function(m) {
            return '@2x' + m;
          });
        }
      }
    });
  }

  function closeMfp(){
    $.magnificPopup.close();
  }

  _document.on('click', 'close-popup', function() {
    closeMfp();
  });


  ////////////
  // UI
  ////////////

  ////////////////
  // FORM VALIDATIONS
  ////////////////
  function formValidators(){
    // GENERIC FUNCTIONS
    ////////////////////
    //
    // var validateErrorPlacement = function(error, element) {
    //   error.addClass('ui-input__validation');
    //   error.appendTo(element.parent("div"));
    // }
    // var validateHighlight = function(element) {
    //   $(element).parent('div').addClass("has-error");
    // }
    // var validateUnhighlight = function(element) {
    //   $(element).parent('div').removeClass("has-error");
    // }
    // var validateSubmitHandler = function(form) {
    //   $(form).addClass('loading');
    //   $.ajax({
    //     type: "POST",
    //     url: $(form).attr('action'),
    //     data: $(form).serialize(),
    //     success: function(response) {
    //       $(form).removeClass('loading');
    //       var data = $.parseJSON(response);
    //       if (data.status == 'success') {
    //         // do something I can't test
    //       } else {
    //           $(form).find('[data-error]').html(data.message).show();
    //       }
    //     }
    //   });
    // }
    //
    // var validatePhone = {
    //   required: true,
    //   normalizer: function(value) {
    //       var PHONE_MASK = '+X (XXX) XXX-XXXX';
    //       if (!value || value === PHONE_MASK) {
    //           return value;
    //       } else {
    //           return value.replace(/[^\d]/g, '');
    //       }
    //   },
    //   minlength: 11,
    //   digits: true
    // }
    //
    // /////////////////////
    // // REGISTRATION FORM
    // ////////////////////
    // $(".js-registration-form").validate({
    //   errorPlacement: validateErrorPlacement,
    //   highlight: validateHighlight,
    //   unhighlight: validateUnhighlight,
    //   submitHandler: validateSubmitHandler,
    //   rules: {
    //     last_name: "required",
    //     first_name: "required",
    //     email: {
    //       required: true,
    //       email: true
    //     },
    //     password: {
    //       required: true,
    //       minlength: 6,
    //     }
    //     // phone: validatePhone
    //   },
    //   messages: {
    //     last_name: "Заполните это поле",
    //     first_name: "Заполните это поле",
    //     email: {
    //         required: "Заполните это поле",
    //         email: "Email содержит неправильный формат"
    //     },
    //     password: {
    //         required: "Заполните это поле",
    //         email: "Пароль мимимум 6 символов"
    //     },
    //     // phone: {
    //     //     required: "Заполните это поле",
    //     //     minlength: "Введите корректный телефон"
    //     // }
    //   }
    // });
    //
    //validation
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });

    $.each($(".form-validation"), function() {
      $(this).validate({
        rules: {
          field: {
            required: true
          }
        }
      });
      $(this).on('submit', function() {
        var action = $(this).attr('action');

        if (!$(this).find('input.error').length) {
          $.post(action, $(this).serialize(), function() {
            // $.magnificPopup.close();
            var $thanksModal = $('#thankPopup')[0].outerHTML.replace('mfp-hide', '')
            $.magnificPopup.open({
              items: {
                src: $thanksModal
              },
              type: 'inline'
            });
          })
        }
      })
    })
  }

  // focus toggler
  function focusToggler(){
    var inputs = document.querySelectorAll('.inputfile');
    Array.prototype.forEach.call(inputs, function(input) {
      var label = input.nextElementSibling,
        labelVal = label.innerHTML;

      input.addEventListener('change', function(e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
          fileName = e.target.value.split('\\').pop();

        if (fileName)
          label.querySelector('span').innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });

      // Firefox bug fix
      input.addEventListener('focus', function() {
        input.classList.add('has-focus');
      });
      input.addEventListener('blur', function() {
        input.classList.remove('has-focus');
      });
    });
  }


  // textarea autoExpand
  _document
    .one('focus.autoExpand', '.ui-group textarea', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', '.ui-group textarea', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
        this.rows = minRows + rows;
    });

  // Masked input
  function initMasks(){
    $("[js-dateMask]").mask("99.99.99",{placeholder:"ДД.ММ.ГГ"});
    $("input[type='tel'], input[name='phone']").mask("(000) 000-00-00", {
      placeholder: "(___) ___-__-__",
      clearIfNotMatch: true});
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor(){
    svgSetOffset();

    $('.js-scrollmonitor').each(function(i, el){

      var elWatcher = scrollMonitor.create( $(el) );

      elWatcher.fullyEnterViewport(throttle(function() {
        $(el).addClass('is-visible');
        animateSvg(el)
      }, 100, {
        'leading': true
      }));
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass('is-visible');
      // }, 100));
    });

  }

  function svgSetOffset(){
    var paths = $('.js-scrollmonitor').find('path.draw-line');
    paths.each(function(i,path){
      var $path = $(path);
      var pathL = Math.floor(path.getTotalLength()) + 1
      $path.css("stroke-dasharray", pathL)
      $path.css("stroke-dashoffset", pathL)
      $path.attr('stroke', '#262e39').attr('stroke-width', .4)
    })
  }

  function animateSvg(el, direction){
    var paths = $(el).find('path.draw-line.path1');
    paths.each(function(i,path){
      var $path = $(path);
      var pathL = Math.floor(path.getTotalLength()) + 1
      anime({
        targets: path,
        strokeDashoffset: [pathL, 0],
        easing: 'easeInOutSine',
        duration: 600,
        // delay: function(el, i) { return i * 250 },
        direction: 'alternate',
        loop: false
      });
    })
    var paths2 = $(el).find('path.draw-line.path2');
    paths2.each(function(i,path){
      var $path = $(path);
      var pathL = Math.floor(path.getTotalLength()) + 1
      anime({
        targets: path,
        strokeDashoffset: [pathL, 0],
        easing: 'easeInOutSine',
        duration: 500,
        delay: 500,
        // delay: function(el, i) { return i * 250 },
        // direction: 'alternate',
        loop: false
      });
    })
  }

  //////////
  // BARBA PJAX
  //////////

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.fadeOut()])
        .then(this.fadeIn.bind(this));
    },

    fadeOut: function() {
      return $(this.oldContainer).animate({ opacity: .5 }, 200).promise();
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility : 'visible',
        opacity : .5
      });

      $el.animate({ opacity: 1 }, 200, function() {
        document.body.scrollTop = 0;
        _this.done();
      });
    }
  });

  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, newPageRawHTML) {
    var newBodyClass = $(newPageRawHTML).find('[js-wrapperToggler]').attr('class')
    _document.find('[js-setWrapper]').attr('class', '').addClass(newBodyClass);

    pageReady();
    closeMobileMenu();
    _window.resize();
    _window.scroll();

  });


});
