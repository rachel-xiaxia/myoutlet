
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),

	$document = $(document),
	$window = $(window),
	$html = $("html"),
	$body = $("body"),

	isDesktop = $html.hasClass("desktop"),
	isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isTouch = "ontouchstart" in window,
	c3ChartsArray = [],
	livedemo = false,
	windowReady = false,
	isNoviBuilder = false,

	document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".menu-item");
    const categories = document.querySelectorAll(".category");

    buttons.forEach(button => {
        button.addEventListener("click", function() {
            const category = this.getAttribute("data-category");

            // 隐藏所有类别的产品
            categories.forEach(cat => cat.style.display = "none");

            // 显示被选中的类别
            document.getElementById(category).style.display = "block";

            // 更新按钮的 active 状态
            buttons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        });
    });
});


	plugins = {
		responsiveTabs: $(".responsive-tabs"),
		rdNavbar: $(".rd-navbar"),
		swiper: $(".swiper-slider"),
		isotope: $(".isotope"),
		countDown: $(".countdown"),
		pageLoader: $(".page-loader"),
		svgWow: $('.svg-wow'),
		captcha: $('.recaptcha'),
		copyrightYear: $(".copyright-year"),
		rdInputLabel: $(".form-label"),
		regula: $("[data-constraints]"),
		rdMailForm: $(".rd-mailform"),
		lightGallery: $("[data-lightgallery='group']"),
		lightGalleryItem: $("[data-lightgallery='item']"),
		lightDynamicGalleryItem: $("[data-lightgallery='dynamic']")
	};

/**
 * isScrolledIntoView
 * @description  check the element whas been scrolled into the view
 */
function isScrolledIntoView(elem) {
	return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
}


$window.on( 'load', function() {});


$document.ready( function () {
	isNoviBuilder = window.xMode;

	/**
	 * toggleSwiperInnerVideos
	 * @description  toggle swiper videos on active slides
	 */
	function toggleSwiperInnerVideos(swiper) {
		var videos;

		$.grep(swiper.slides, function (element, index) {
			var $slide = $(element),
				video;

			if (index === swiper.activeIndex) {
				videos = $slide.find("video");
				if (videos.length) {
					videos.get(0).play();
				}
			} else {
				$slide.find("video").each(function () {
					this.pause();
				});
			}
		});
	}

	/**
	 * toggleSwiperCaptionAnimation
	 * @description  toggle swiper animations on active slides
	 */
	function toggleSwiperCaptionAnimation(swiper) {
		if (isIE && isIE < 10) {
			return;
		}

		var prevSlide = $(swiper.container),
			nextSlide = $(swiper.slides[swiper.activeIndex]);

		prevSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this);
				$this
					.removeClass("animated")
					.removeClass($this.attr("data-caption-animate"))
					.addClass("not-animated");
			});

		nextSlide
			.find("[data-caption-animate]")
			.each(function () {
				var $this = $(this),
					delay = $this.attr("data-caption-delay");

				setTimeout(function () {
					$this
						.removeClass("not-animated")
						.addClass($this.attr("data-caption-animate"))
						.addClass("animated");
				}, delay ? parseInt(delay) : 0);
			});
	}

	/**
	 * makeParallax
	 * @description  create swiper parallax scrolling effect
	 */
	function makeParallax(el, speed, wrapper, prevScroll) {
		var scrollY = window.scrollY || window.pageYOffset;

		if (prevScroll != scrollY) {
			prevScroll = scrollY;
			el.addClass('no-transition');
			el[0].style['transform'] = 'translate3d(0,' + -scrollY * (1 - speed) + 'px,0)';
			el.height();
			el.removeClass('no-transition');

			if (el.attr('data-fade') === 'true') {
				var bound = el[0].getBoundingClientRect(),
					offsetTop = bound.top * 2 + scrollY,
					sceneHeight = wrapper.outerHeight(),
					sceneDevider = wrapper.offset().top + sceneHeight / 2.0,
					layerDevider = offsetTop + el.outerHeight() / 2.0,
					pos = sceneHeight / 6.0,
					opacity;
				if (sceneDevider + pos > layerDevider && sceneDevider - pos < layerDevider) {
					el[0].style["opacity"] = 1;
				} else {
					if (sceneDevider - pos < layerDevider) {
						opacity = 1 + ((sceneDevider + pos - layerDevider) / sceneHeight / 3.0 * 5);
					} else {
						opacity = 1 - ((sceneDevider - pos - layerDevider) / sceneHeight / 3.0 * 5);
					}
					el[0].style["opacity"] = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity.toFixed(2);
				}
			}
		}

		requestAnimationFrame(function () {
			makeParallax(el, speed, wrapper, prevScroll);
		});
	}

	/**
	 * attachFormValidator
	 * @description  attach form validation to elements
	 */
	function attachFormValidator(elements) {
		for (var i = 0; i < elements.length; i++) {
			var o = $(elements[i]), v;
			o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
			v = o.parent().find(".form-validation");
			if (v.is(":last-child")) {
				o.addClass("form-control-last-child");
			}
		}

		elements
			.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") {
					if (!$this.parent().hasClass("has-error")) {
						return;
					}
				}

				if ($this.parents('.rd-mailform').hasClass('success')) {
					return;
				}

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			})
			.regula('bind');

		var regularConstraintsMessages = [
			{
				type: regula.Constraint.Required,
				newMessage: "The text field is required."
			},
			{
				type: regula.Constraint.Email,
				newMessage: "The email is not a valid email."
			},
			{
				type: regula.Constraint.Numeric,
				newMessage: "Only numbers are required"
			},
			{
				type: regula.Constraint.Selected,
				newMessage: "Please choose an option."
			}
		];

		for (var i = 0; i < regularConstraintsMessages.length; i++) {
			var regularConstraint = regularConstraintsMessages[i];

			regula.override({
				constraintType: regularConstraint.type,
				defaultMessage: regularConstraint.newMessage
			});
		}
	}

	/**
	 * isValidated
	 * @description  check if all elemnts pass validation
	 */
	function isValidated(elements, captcha) {
		var results, errors = 0;

		if (elements.length) {
			for (j = 0; j < elements.length; j++) {

				var $input = $(elements[j]);
				if ((results = $input.regula('validate')).length) {
					for (k = 0; k < results.length; k++) {
						errors++;
						$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
					}
				} else {
					$input.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}

			if (captcha) {
				if (captcha.length) {
					return validateReCaptcha(captcha) && errors == 0
				}
			}

			return errors == 0;
		}
		return true;
	}

	/**
	 * Swiper 3.1.7
	 * @description  Enable Swiper Slider
	 */
	if (plugins.swiper.length) {
		plugins.swiper.each(function () {
			var slider = $(this),
				pag      = slider.find(".swiper-pagination"),
				next     = slider.find(".swiper-button-next"),
				prev     = slider.find(".swiper-button-prev"),
				bar      = slider.find(".swiper-scrollbar"),
				parallax = slider.parents('.rd-parallax').length;

			slider.find(".swiper-slide")
				.each( function () {
					var $this = $(this), url;
					if ( url = $this.attr("data-slide-bg") ) {
						$this.css({
							"background-image": "url(" + url + ")",
							"background-size": "cover"
						})
					}

				})
				.end()
				.find("[data-caption-animate]")
				.addClass("not-animated")
				.end()
				.swiper({
					autoplay:                 !isNoviBuilder && $.isNumeric( slider.attr( 'data-autoplay' ) ) ? slider.attr( 'data-autoplay' ) : false,
					direction:                slider.attr('data-direction') || "horizontal",
					effect:                   slider.attr('data-slide-effect') || "slide",
					speed:                    slider.attr('data-slide-speed') || 600,
					keyboardControl:          !isNoviBuilder ? slider.attr('data-keyboard') === "true" : false,
					mousewheelControl:        !isNoviBuilder ? slider.attr('data-mousewheel') === "true" : false,
					mousewheelReleaseOnEdges: slider.attr('data-mousewheel-release') === "true",
					nextButton:               next.length ? next.get(0) : null,
					prevButton:               prev.length ? prev.get(0) : null,
					pagination:               pag.length ? pag.get(0) : null,
					simulateTouch:            false,
					paginationClickable:      pag.length ? pag.attr("data-clickable") !== "false" : false,
					paginationBulletRender:   pag.length ? pag.attr("data-index-bullet") === "true" ? function ( index, className ) {
						return '<span class="'+ className +'">'+ (index + 1) +'</span>';
					} : null : null,
					scrollbar:                bar.length ? bar.get(0) : null,
					scrollbarDraggable:       bar.length ? bar.attr("data-draggable") !== "false" : true,
					scrollbarHide:            bar.length ? bar.attr("data-draggable") === "false" : false,
					loop:                     !isNoviBuilder ? slider.attr('data-loop') !== "false" : false,
					loopAdditionalSlides:     0,
					loopedSlides:             0,
					onTransitionStart: function ( swiper ) {
						if( !isNoviBuilder ) toggleSwiperInnerVideos( swiper );
					},
					onTransitionEnd: function ( swiper ) {
						if( !isNoviBuilder ) toggleSwiperCaptionAnimation( swiper );
						$(window).trigger("resize");
					},

					onInit: function ( swiper ) {
						if ( plugins.pageLoader.length ) {
							var srcFirst = $("#page-loader").attr("data-slide-bg"),
								image = document.createElement('img');

							image.src = srcFirst;
							image.onload = function () {
								plugins.pageLoader.addClass( "loaded" );
							};
						}

						if( !isNoviBuilder ) toggleSwiperInnerVideos( swiper );
						if( !isNoviBuilder ) toggleSwiperCaptionAnimation( swiper );

						// Create parallax effect on swiper caption
						slider.find(".swiper-parallax")
							.each( function () {
								var $this = $(this), speed;

								if ( parallax && !isIE && !isMobile ) {
									if ( speed = $this.attr("data-speed") ) {
										makeParallax( $this, speed, slider, false );
									}
								}
							});
						$(window).on('resize', function () {
							swiper.update(true);
						})
					},
					onSlideChangeStart: function (swiper) {
						if ( isNoviBuilder ) return;

						var activeSlideIndex = swiper.activeIndex,
							slidesCount = swiper.slides.not(".swiper-slide-duplicate").length,
							thumbsToShow = 3;

						//If there is not enough slides
						if ( slidesCount < thumbsToShow ) return false;

						//Fix index count
						if ( activeSlideIndex === slidesCount + 1 ) activeSlideIndex = 1;
						else if ( activeSlideIndex === 0 ) activeSlideIndex = slidesCount;

						//Lopp that adds background to thumbs
						for (var i = -thumbsToShow; i < thumbsToShow + 1; i++) {
							if ( i === 0 ) continue;

							//Previous btn thumbs
							if ( i < 0 ) {
								//If there is no slides before current
								if ( ( activeSlideIndex + i - 1) < 0 ) {
									$(swiper.container).find( '.swiper-button-prev .preview__img-'+ Math.abs(i) )
										.css("background-image", "url(" + swiper.slides[slidesCount + i + 1].getAttribute("data-preview-bg") + ")");
								} else {
									$(swiper.container).find( '.swiper-button-prev .preview__img-'+ Math.abs(i) )
										.css("background-image", "url(" + swiper.slides[activeSlideIndex + i].getAttribute("data-preview-bg") + ")");
								}

								//Next btn thumbs
							} else {
								//If there is no slides after current
								if ( activeSlideIndex + i - 1 > slidesCount ) {
									$(swiper.container).find('.swiper-button-next .preview__img-' + i)
										.css("background-image", "url(" + swiper.slides[i].getAttribute("data-preview-bg") + ")");
								} else {
									$(swiper.container).find('.swiper-button-next .preview__img-' + i)
										.css("background-image", "url(" + swiper.slides[activeSlideIndex + i].getAttribute("data-preview-bg") + ")");
								}
							}
						}
					},
				});

			$(window)
				.load(function () {
					slider.find("video").each(function () {
						if (!$(this).parents(".swiper-slide-active").length) {
							this.pause();
						}
					});
				})
				.trigger("resize");
		});
	}

	// Copyright Year (Evaluates correct copyright year)
	if (plugins.copyrightYear.length) {
		plugins.copyrightYear.text(initialDate.getFullYear());
	}

	/**
	 * jQuery Countdown
	 * @description  Enable countdown plugin
	 */
	if ( plugins.countDown.length ) {
		for ( var i = 0; i < plugins.countDown.length; i++) {
			var $countDownItem = $( plugins.countDown[i] ),
				settings = {
					format: $countDownItem.attr('data-format'),
					layout: $countDownItem.attr('data-layout')
				};

			if ( livedemo ) {
				var d = new Date();
				d.setDate(d.getDate() + 42);
				settings[ $countDownItem.attr('data-type') ] = d;
			} else {
				settings[ $countDownItem.attr('data-type') ] = new Date( $countDownItem.attr( 'data-time' ) );
			}

			if ( $countDownItem.parents('.countdown-modern').length ) {
				settings['onTick'] = function () {
					var section = $(this).find(".countdown-section");
					for ( var j = 0; j < section.length; j++ ) {
						$(section[section.length - j - 1]).append( '<span class="countdown-letter">'+ settings.format[settings.format.length - j - 1] +'</span>' )
					}
				}
			}

			$countDownItem.countdown( settings );
		}
	}

	/**
	 * Responsive Tabs
	 * @description Enables Responsive Tabs plugin
	 */
	if (plugins.responsiveTabs.length ) {
		for ( var i = 0; i < plugins.responsiveTabs.length; i++ ) {
			var $this = $(plugins.responsiveTabs[i]);
			$this.easyResponsiveTabs({
				type: $this.attr( "data-type" ),
				tabidentify: $this.find( ".resp-tabs-list" ).attr( "data-group" ) || "tab"
			});
		}
	}

	/**
	 * RD Input Label
	 * @description Enables RD Input Label Plugin
	 */
	if (plugins.rdInputLabel.length) {
		plugins.rdInputLabel.RDInputLabel();
	}

	/**
	 * Regula
	 * @description Enables Regula plugin
	 */
	if (plugins.regula.length) {
		attachFormValidator(plugins.regula);
	}

	/**
	 * WOW
	 * @description Enables Wow animation plugin
	 */
	if ( !isNoviBuilder && $html.hasClass('desktop') && $html.hasClass("wow-animation") && $(".wow").length ) {
		new WOW().init();
	}

	function isInView ( node ) {
		if ( node ) {
			var rect = node.getBoundingClientRect();
			if ( ( rect.top > 0 ) && ( rect.bottom < document.documentElement.clientHeight ) ) return true;
		}
		return false;
	};

	if( !isNoviBuilder && !isIE && $html.hasClass('desktop') && plugins.svgWow.length ) {
		if ( plugins.svgWow.length ) {
			for ( var i = 0; i < plugins.svgWow.length; i++ ) {
				var
					node = plugins.svgWow[i],
					handler = function() {
						if ( isInView( this ) && !this.classList.contains( 'animated' )  ) {
							this.classList.add( 'animated' );
						}
					};

				handler.call( node );
				window.addEventListener( 'scroll', handler.bind( node ) );
			}
		}

	}

	/**
	 * Isotope
	 * @description Enables Isotope plugin
	 */
	if (plugins.isotope.length) {
		var isogroup = [];
		for ( var i = 0; i < plugins.isotope.length; i++ ) {
			var isotopeItem = plugins.isotope[i],
				filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
				iso = new Isotope(isotopeItem,
					{
						itemSelector: '.isotope-item',
						layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
						filter: '*',
					}
				);

			isogroup.push(iso);

			filterItems.on("click", function (e) {
				e.preventDefault();
				var filter = $(this),
					iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]'),
					filtersContainer = filter.closest(".isotope-filters");

				filtersContainer
					.find('.active')
					.removeClass("active");
				filter.addClass("active");

				iso.isotope({
					itemSelector: '.isotope-item',
					layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
					filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]'
				});

				$window.trigger('resize');

				// If d3Charts contains in isotop, resize it on click.
				if (filtersContainer.hasClass('isotope-has-d3-graphs') && c3ChartsArray != undefined) {
					setTimeout(function () {
						for (var j = 0; j < c3ChartsArray.length; j++) {
							c3ChartsArray[j].resize();
						}
					}, 500);
				}

			}).eq(0).trigger("click");
		}

		setTimeout(function () {
			for ( var i = 0; i < isogroup.length; i++ ) {
				isogroup[i].element.classList.add( "isotope--loaded" );
				isogroup[i].layout();
			}
		}, 1200);
	}

	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if ( plugins.rdNavbar.length ) {
		var navbar = plugins.rdNavbar,
			aliases = { '0':'-', '480':'-xs-', '768':'-sm-', '992':'-md-', '1200':'-lg-' },
			responsiveNavbar = {};

		for ( var alias in aliases ) {
			responsiveNavbar[ alias ] = {};
			if ( navbar.attr( 'data'+ aliases[ alias ] +'layout' ) ) responsiveNavbar[ alias ].layout = navbar.attr( 'data'+ aliases[ alias ] +'layout' );
			else responsiveNavbar[ alias ].layout = 'rd-navbar-fixed';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'device-layout' ) ) responsiveNavbar[ alias ].deviceLayout = navbar.attr( 'data'+ aliases[ alias ] +'device-layout' );
			else responsiveNavbar[ alias ].deviceLayout = 'rd-navbar-fixed';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'hover-on' ) ) responsiveNavbar[ alias ].focusOnHover = navbar.attr( 'data'+ aliases[ alias ] +'hover-on' ) === 'true';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'auto-height' ) ) responsiveNavbar[ alias ].autoHeight = navbar.attr( 'data'+ aliases[ alias ] +'auto-height' ) === 'true';
			if ( navbar.attr( 'data'+ aliases[ alias ] +'stick-up-offset' ) ) responsiveNavbar[ alias ].stickUpOffset = navbar.attr( 'data'+ aliases[ alias ] +'stick-up-offset');
			if ( navbar.attr( 'data'+ aliases[ alias ] +'stick-up' ) && !isNoviBuilder ) responsiveNavbar[ alias ].stickUp = navbar.attr( 'data'+ aliases[ alias ] +'stick-up' ) === 'true';
			else responsiveNavbar[ alias ].stickUp = false;

			if ( $.isEmptyObject( responsiveNavbar[ alias ] ) ) delete responsiveNavbar[ alias ];
		}

		navbar.RDNavbar({
			stickUpClone: ( !isNoviBuilder && navbar.attr("data-stick-up-clone") ) ? navbar.attr("data-stick-up-clone") === 'true' : false,
			stickUpOffset: ( navbar.attr("data-stick-up-offset") ) ? navbar.attr("data-stick-up-offset") : 1,
			anchorNavOffset: -78,
			anchorNav: !isNoviBuilder,
			anchorNavEasing: 'linear',
			focusOnHover: !isNoviBuilder,
			responsive: responsiveNavbar,
			onDropdownOver: function () {
				return !isNoviBuilder;
			}
		});

		if ( navbar.attr( "data-body-class" ) ) {
			document.body.className += ' ' + navbar.attr("data-body-class");
		}
	}

	/**
	 * Page loader
	 * @description Enables Page loader
	 */
	if ( plugins.pageLoader.length ) {
		var pageLoaded = function() {
			plugins.pageLoader.addClass( 'loaded' );
			$window.trigger( 'resize' );
		};

		if ( !isNoviBuilder ) setTimeout( pageLoaded, 200 );
		else pageLoaded();
	}

	/**
	 * IE Polyfills
	 * @description  Adds some loosing functionality to IE browsers
	 */
	if (isIE) {
		if (isIE < 10) {
			$html.addClass("lt-ie-10");
		}

		if (isIE < 11) {
			if (plugins.pointerEvents) {
				$.getScript(plugins.pointerEvents)
					.done(function () {
						$html.addClass("ie-10");
						PointerEventsPolyfill.initialize({});
					});
			}
		}

		if (isIE === 11) {
			$("html").addClass("ie-11");
		}

		if (isIE === 12) {
			$("html").addClass("ie-edge");
		}
	}

	/**
	 * UI To Top
	 * @description Enables ToTop Button
	 */
	if ( !isNoviBuilder && isDesktop ) {
		$().UItoTop({
			easingType: 'easeOutQuart',
			containerClass: 'ui-to-top icon icon-xs icon-circle icon-darker-filled mdi mdi-chevron-up'
		});
	}

	/**
	 * RD Mailform
	 */
	if (plugins.rdMailForm.length) {
		var i, j, k,
			msg = {
				'MF000': 'Successfully sent!',
				'MF001': 'Recipients are not set!',
				'MF002': 'Form will not work locally!',
				'MF003': 'Please, define email field in your form!',
				'MF004': 'Please, define type of your form!',
				'MF254': 'Something went wrong with PHPMailer!',
				'MF255': 'Aw, snap! Something went wrong.'
			};

		for (i = 0; i < plugins.rdMailForm.length; i++) {
			var $form = $(plugins.rdMailForm[i]),
				formHasCaptcha = false;

			$form.attr('novalidate', 'novalidate').ajaxForm({
				data: {
					"form-type": $form.attr("data-form-type") || "contact",
					"counter": i
				},
				beforeSubmit: function (arr, $form, options) {

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						inputs = form.find("[data-constraints]"),
						output = $("#" + form.attr("data-form-output")),
						captcha = form.find('.recaptcha'),
						captchaFlag = true;

					output.removeClass("active error success");

					if (isValidated(inputs, captcha)) {

						// veify reCaptcha
						if (captcha.length) {
							var captchaToken = captcha.find('.g-recaptcha-response').val(),
								captchaMsg = {
									'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
									'CPT002': 'Something wrong with google reCaptcha'
								};

							formHasCaptcha = true;

							$.ajax({
								method: "POST",
								url: "bat/reCaptcha.php",
								data: {'g-recaptcha-response': captchaToken},
								async: false
							}).done(function (responceCode) {
								if (responceCode !== 'CPT000') {
									if (output.hasClass("snackbars")) {
										output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

										setTimeout(function () {
											output.removeClass("active");
										}, 3500);

										captchaFlag = false;
									} else {
										output.html(captchaMsg[responceCode]);
									}

									output.addClass("active");
								}
							});
						}

						if (!captchaFlag) {
							return false;
						}

						form.addClass('form-in-process');

						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
							output.addClass("active");
						}
					} else {
						return false;
					}
				},
				error: function (result) {

					var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
						form = $(plugins.rdMailForm[this.extraData.counter]);

					output.text(msg[result]);
					form.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}
				},
				success: function (result) {

					var form = $(plugins.rdMailForm[this.extraData.counter]),
						output = $("#" + form.attr("data-form-output")),
						select = form.find('select');

					form
						.addClass('success')
						.removeClass('form-in-process');

					if (formHasCaptcha) {
						grecaptcha.reset();
					}

					result = result.length === 5 ? result : 'MF255';
					output.text(msg[result]);

					if (result === "MF000") {
						if (output.hasClass("snackbars")) {
							output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active success");
						}
					} else {
						if (output.hasClass("snackbars")) {
							output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
						} else {
							output.addClass("active error");
						}
					}

					form.clearForm();

					if (select.length) {
						select.select2("val", "");
					}

					form.find('input, textarea').trigger('blur');

					setTimeout(function () {
						output.removeClass("active error success");
						form.removeClass('success');
					}, 3500);
				}
			});
		}
	}

	/**
	 * lightGallery
	 * @description Enables lightGallery plugin
	 */
	function initLightGallery(itemsToInit, addClass) {
		$(itemsToInit).lightGallery({
			thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
			selector: "[data-lightgallery='item']",
			autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
			pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
			addClass: addClass,
			mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
			loop: $(itemsToInit).attr("data-lg-loop") !== "false"
		});
	}

	function initDynamicLightGallery(itemsToInit, addClass) {
		$(itemsToInit).on("click", function() {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false",
				dynamic: true,
				dynamicEl:
				JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
			});
		});
	}

	function initLightGalleryItem(itemToInit, addClass) {
		$(itemToInit).lightGallery({
			selector: "this",
			addClass: addClass,
			counter: false,
			youtubePlayerParams: {
				modestbranding: 1,
				showinfo: 0,
				rel: 0,
				controls: 0
			},
			vimeoPlayerParams: {
				byline: 0,
				portrait: 0
			}
		});
	}

	if ( !isNoviBuilder && plugins.lightGallery.length ) {
		for ( var i = 0; i < plugins.lightGallery.length; i++ ) initLightGallery( plugins.lightGallery[i] );
	}

	if ( !isNoviBuilder && plugins.lightGalleryItem.length ) {
		for ( var i = 0; i < plugins.lightGalleryItem.length; i++ ) initLightGalleryItem( plugins.lightGalleryItem[i] );
	}

	if ( !isNoviBuilder && plugins.lightDynamicGalleryItem.length ) {
		for ( var i = 0; i < plugins.lightDynamicGalleryItem.length; i++ ) initDynamicLightGallery( plugins.lightDynamicGalleryItem[i] );
	}

	/**
	 * Enable parallax by mouse
	 */
	var parallaxJs = document.getElementsByClassName('parallax-scene-js');
	if (parallaxJs && !isNoviBuilder) {
		for (var i = 0; i < parallaxJs.length; i++) {
			var scene = parallaxJs[i];
			new Parallax(scene);
		}
	}

});
