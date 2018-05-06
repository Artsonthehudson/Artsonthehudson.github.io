(function ($) {
	'use strict';

	// Template Helper Function
	$.fn.hasAttr = function(attribute) {
		var obj = this;

		if (obj.attr(attribute) !== undefined) {
			return true;
		} else {
			return false;
		}
	};

	function checkVisibility (object) {
		var el = object[0].getBoundingClientRect(),
			wHeight = $(window).height(),
			scrl =  wHeight - (el.bottom - el.height),
			condition = wHeight + el.height;

		if (scrl > 0  && scrl < condition) {
			return true;
		} else {
			return false;
		}
	};

	// Scroll Events
	var keys = {37: 1, 38: 1, 39: 1, 40: 1};
	function preventDefault(e) {
		e = e || window.event;
		if (e.preventDefault)
			e.preventDefault();
		e.returnValue = false;  
	};
	function preventDefaultForScrollKeys(e) {
	    if (keys[e.keyCode]) {
	        preventDefault(e);
	        return false;
	    }
	};
	function disableScroll() {
		if (window.addEventListener) window.addEventListener('DOMMouseScroll', preventDefault, false);
		window.onwheel = preventDefault; // modern standard
		window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
		window.ontouchmove  = preventDefault; // mobile
		document.onkeydown  = preventDefaultForScrollKeys;
	};
	function enableScroll() {
		if (window.removeEventListener) window.removeEventListener('DOMMouseScroll', preventDefault, false);
		window.onmousewheel = document.onmousewheel = null; 
		window.onwheel = null; 
		window.ontouchmove = null;  
		document.onkeydown = null;
	};

	var teslaThemes = {
		init: function () {
			this.checkInputsForValue();
			this.nrOnlyInputs();
			this.nrFilters();
			this.parallaxInit();
			this.slideSection();
			this.slickInit();
			this.customSelectBoxes();
			this.tabsInit();
			this.toggles();
			this.accordionInit();
			this.isotopeInit();
			this.loadTwitter();
			this.noUiInit();
			this.googleMaps();
			this.showCases();
			this.foldingContent();
			this.animatedCounters();
			this.contactFormInit();
		},

		// Template Custom Functions
		checkInputsForValue: function () {
			$(document).on('focusout', '.check-value', function () {
				var text_val = $(this).val();
				if (text_val === "" || text_val.replace(/^\s+|\s+$/g, '') === "") {
					$(this).removeClass('has-value');
				} else {
					$(this).addClass('has-value');
				}
			});
		},

		nrOnlyInputs: function () {
			$('.nr-only').keypress(function (e) {
				if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
					return false;
				}
			});
		},

		nrFilters: function () {
			$('.nr-filter').each(function () {
				var input = $(this).find('input'),
					substract = $(this).find('.substract'),
					add = $(this).find('.add');

				add.on('click', function () {
					input.val(Math.max(1, parseInt(input.val()) + 1));
				});

				substract.on('click', function () {
					input.val(Math.max(1, parseInt(input.val()) - 1));
				});
			});
		},

		parallaxInit: function () {
			var container = jQuery('[data-parallax-bg]');

			if (container.length) {
				container.each(function(index) {
					var boxImg = container.eq(index),
						boxImgData = boxImg.data('parallax-bg'),
						parallaxBox = boxImg.find('.box-img > span');

					parallaxBox.css({
						'background-image': 'url("' + boxImgData + '")'
					});

					function scrollEffect() {
						var elCont = container[index],
							el = elCont.getBoundingClientRect(),
							wHeight = jQuery(window).height(),
							scrl =  wHeight-(el.bottom - el.height),
							scrollBox = boxImg.find('.box-img'),
							condition = wHeight+el.height,
							progressCoef = scrl/condition;

						if( scrl > 0  && scrl < condition) {
							scrollBox.css({
								transform: 'translateY('+(progressCoef * 100)+'px)'
							});
						}
					}

					scrollEffect();

					jQuery(window).scroll(function() {
						scrollEffect();
					});
				});
			}

			// Main Scroll Event
			$(window).on('scroll', function () {
				// Show Visible Elements
				$('.check-screen-visibility').each(function () {
					var obj = $(this);

					if (obj.visible()) {
						setTimeout(function () {
							obj.addClass('visible');
						}, 250);
					}
				});
			});
		},

		slideSection: function () {
			var slidesContainer = $('.big-slides-list'),
				slide = $('.big-slides-list .big-slide'),
				currentSlide = 0,
				slideCount = slide.length,
				bulletsContainer = $('.section-slides .bullets-nav'),
				scrollDownCount = 0,
				scrollUpCount = 0;

			slide.eq(0).addClass('current-slide');

			// Move Window To The Top
			setTimeout(function () {
				$(window).scrollTop(0);
			}, 320);

			// Create & Handle Navigation

			for (var i = 0; i < slideCount; i ++) {
				bulletsContainer.append('<li class="nav-bullet"></li>');
			}

			var bullet = $('.section-slides .bullets-nav .nav-bullet');

			bullet.eq(0).addClass('current-nav-bullet')

			bullet.on('click', function () {
				var obj = $(this);
				bullet.removeClass('current-nav-bullet');
				obj.addClass('current-nav-bullet');

				// Reset Counters 
				scrollDownCount = 0;
				scrollUpCount = 0;

				// Change Current Slide Index
				currentSlide = obj.index();

				// Remove Class from all Slides
				slide.removeClass('current-slide');

				// Add Class To Current Slide
				slide.eq(obj.index()).addClass('current-slide');

				slide.eq(obj.index()).velocity('scroll', {
					duration: 650,
					offset: -30
				});
			});

			var changeSlide = function (direction) {
				if (direction === 'next') {
					currentSlide ++;
				} else {
					currentSlide --;
				}

				if (currentSlide < 0) {
					currentSlide = 0;
					return false;
				}

				if (currentSlide === slideCount) {
					$('footer').velocity('scroll', {
						duration: 600,
						offset: -$('footer').height(),
						complete: function () {
							currentSlide = slideCount;
						}
					});
				}

				// Remove Class From all Slides
				slide.removeClass('current-slide');
				bullet.removeClass('current-nav-bullet')

				// Add Class To Current Slide
				slide.eq(currentSlide).addClass('current-slide');
				bullet.eq(currentSlide).addClass('current-nav-bullet');

				slide.eq(currentSlide).velocity('scroll', {
					duration: 500,
					offset: -30
				});
			};

			if (slidesContainer.length) {
				// Mouse Wheel Event
				window.addEventListener('mousewheel', function (e) {
					var wDelta = e.wheelDelta < 0 ? 'down' : 'up';

					// Disable Scrolling
					e.preventDefault();

					if (wDelta === 'down') {
						// Handle Down Scrolling
						scrollDownCount ++;
						if (scrollDownCount === 5) {
							scrollDownCount = 0;
							changeSlide('next');
						}
					} else {
						// Handle Up Scrolling
						scrollUpCount ++;
						if (scrollUpCount === 5) {
							scrollUpCount = 0;
							changeSlide('prev');
						}
					}
				});

				// Touchmove Event
				window.addEventListener('touchmove', function (e) {
					var wDelta = e.wheelDelta < 0 ? 'down' : 'up';

					// Disable Scrolling
					e.preventDefault();

					if (wDelta === 'down') {
						// Handle Down Scrolling
						scrollDownCount ++;
						if (scrollDownCount === 15) {
							scrollDownCount = 0;
							changeSlide('next');
						}
					} else {
						// Handle Up Scrolling
						scrollUpCount ++;
						if (scrollUpCount === 15) {
							scrollUpCount = 0;
							changeSlide('prev');
						}
					}
				});

				// Keyboard Events
				window.addEventListener('keydown', function (e) {
					if (e.keyCode === 40 || e.keyCode === 39) {
						scrollDownCount = 0;
						scrollUpCount = 0;
						changeSlide('next');
					} else if (e.keyCode === 38 || e.keyCode === 37) {
						scrollDownCount = 0;
						scrollUpCount = 0;
						changeSlide('prev');
					}
				});
			}
		},

		slickInit: function () {
			// Get All Carousels from the page
			var carousel = $('.tt-carousel');

			// Get All Sliders from the page
			var slider = $('.tt-slider');

			// Init Carousels
			carousel.each(function () {
				var obj = $(this),
					items = obj.find('.carousel-items');

				items.slick({
					focusOnSelect: true,
					speed: obj.hasAttr('data-speed') ? obj.data('speed') : 600,
					autoplaySpeed: obj.hasAttr('data-autoplay-speed') ? obj.data('autoplay-speed') : 3000,
					slidesToShow: obj.hasAttr('data-items-desktop') ? obj.data('items-desktop') : 4,
					arrows: obj.hasAttr('data-arrows') ? obj.data('arrows') : true,
					dots: obj.hasAttr('data-dots') ? obj.data('dots') : true,
					infinite: obj.hasAttr('data-infinite') ? obj.data('infinite') : false,
					slidesToScroll: obj.hasAttr('data-items-to-slide') ? obj.data('items-to-slide') : 1,
					initialSlide: obj.hasAttr('data-start') ? obj.data('start') : 0,
					asNavFor: obj.hasAttr('data-as-nav-for') ? obj.data('as-nav-for') : '',
					centerMode: obj.hasAttr('data-center-mode') ? obj.data('center-mode') : '',
					vertical: obj.hasAttr('data-vertical') ? obj.data('vertical') : false,
					responsive: [
                        {
                            breakpoint: 1200,
                            settings: {
                                slidesToShow: obj.hasAttr('data-items-small-desktop') ? obj.data('items-small-desktop') : 3,
                                slidesToScroll: obj.hasAttr('data-items-small-desktop') ? obj.data('items-small-desktop') : 3
                            }
                        },
                        {
                            breakpoint: 800,
                            settings: {
                                slidesToShow: obj.hasAttr('data-items-tablet') ? obj.data('items-tablet') : 2,
                                slidesToScroll: obj.hasAttr('data-items-tablet') ? obj.data('items-tablet') : 2
                            }
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: obj.hasAttr('data-items-phone') ? obj.data('items-phone') : 2,
                                slidesToScroll: obj.hasAttr('data-items-phone') ? obj.data('items-phone') : 2
                            }
                        }
                    ]
				});
			});

			// Init Sliders
			slider.each(function () {
				var obj = $(this),
					items = obj.find('.slides-list');

				items.slick({
					slidesToShow: 1,
					slidesToScroll: 1,
					focusOnSelect: true,
					fade: obj.hasAttr('data-fade') ? obj.data('fade') : false,
					dots: obj.hasAttr('data-dots') ? obj.data('dots') : true,
					speed: obj.hasAttr('data-speed') ? obj.data('speed') : 500,
					autoplaySpeed: obj.hasAttr('data-autoplay-speed') ? obj.data('autoplay-speed') : 3000,
					arrows: obj.hasAttr('data-arrows') ? obj.data('arrows') : true,
					infinite: obj.hasAttr('data-infinite') ? obj.data('infinite') : false,
					initialSlide: obj.hasAttr('data-start') ? obj.data('start') : 0,
					asNavFor: obj.hasAttr('data-as-nav-for') ? obj.data('as-nav-for') : ''					
				});
			});
		},

		customSelectBoxes: function () {
			$('.fake-select-box').each(function () {
				var selectBox = $(this);

				selectBox.find('input').on('click', function () {
					$('.fake-select-box').not(selectBox).removeClass('open');
					selectBox.toggleClass('open');
				});

				selectBox.find('.select-options .option').on('click', function () {
					selectBox.find('input').attr('value', $(this).text());
					selectBox.removeClass('open');
				});

				selectBox.on('click', function (e) {
					e.stopPropagation();
				});

				$(document).on('click', function () {
					selectBox.removeClass('open');
				});
			});
		},

		tabsInit: function () {
			var tabs = $('.tabed-content');

			tabs.each(function () {
				var tab = $(this),
					option = tab.find('.tabs-header .tab-link'),
					content = tab.find('.tab-item');

				option.on('click', function () {
					var obj = $(this);

					if (!obj.hasClass('current')) {
						option.removeClass('current');
						obj.addClass('current');

						if (tabs.hasClass('gallery-tabs')) {
							tab.addClass('switching');

							setTimeout(function () {
								content.removeClass('current');
								$('#' + obj.data('tab-link')).addClass('current');

								tabs.removeClass('switching');
							}, 1795);
						} else {
							content.removeClass('current');
							$('#' + obj.data('tab-link')).addClass('current');
						}
					}
				});
			});
		},

		toggles: function () {
			$('.rating-box').on('click', function () {
				$('.rating-box').removeClass('active');
				$(this).addClass('active');
			});

			// Quick View Popup
			$('.quick-view-btn').on('click', function (e) {
				e.preventDefault();
				$('html').addClass('popup-visible');
				return false;
			});

			$('.quick-view-box').on('click', function (e) {
				e.stopPropagation();
			});

			$('html, .close-popup-btn').on('click', function () {
				$('html').removeClass('popup-visible');
			});

			// Video Popup
			$('.video-toggle').on('click', function () {
				$('html').addClass('video-popup-visible');
				return false;
			});

			$('.video-popup .media-wrapper').on('click', function (e) {
				e.stopPropagation();
			});

			$('html, .close-video-popup-toggle').on('click', function () {
				$('html').removeClass('video-popup-visible');
				var media = $('.media-wrapper');
				media.html(media.html());
			});

			// Share Block Toggle
			$('.share-block .block-toggle').on('click', function () {
				$('.share-block').toggleClass('options-visible');
			});

			// Shop Cart
			$('.shopping-cart-wrapper .cart-toggle').on('click', function () {
				$('.shopping-cart-wrapper').toggleClass('active');
				return false;
			});

			$('.cart-items-wrapper').on('click', function (e) {
				e.stopPropagation();
			});

			$('html').on('click', function () {
				$('.shopping-cart-wrapper').removeClass('active');
			});

			// Search form toggle
			$('.search-toggle').on('click', function () {
				$('.search-form-wrapper').addClass('active');
			});

			$('.close-search-form-wrapper').on('click', function () {
				$('.search-form-wrapper').removeClass('active');
			});

			// Main Slider Toggle
			$('.main-slider .custom-slider-nav .slides-toggle').on('click', function () {
				$('.main-slider .custom-slider-nav').toggleClass('active');

				return false;
			});

			$('.main-slider .custom-slider-nav').on('click', function (e) {
				e.stopPropagation();
			});

			$(document).on('click', function () {
				$('.main-slider .custom-slider-nav').removeClass('active');
			});

			// Checkout Forms
			$('.checkout-heading-block').each(function () {
				var trigger = $(this).find('.heading span'),
					obj = $(this);

				trigger.one('click', function () {
					obj.find('.checkout-form').velocity('slideDown', {duration: 250});
				});
			});

			// Scroll Down Btn
			$('.scroll-btn').on('click', function (e) {
				e.preventDefault();
				$('body').velocity('scroll', {
					offset: $('.intro-box').length ? $('.intro-box').height() : $('.main-slider').length ? $('.main-slider').height() : $('.index-slider').height() + $('.main-header').height() + 40,
					duration: 600
				});
			});

			// Blog Posts Fix
			$('.blog-post-preview').eq(0).imagesLoaded(function () {
				if ($(window).width() > 992) {
					$('.blog-post-preview').eq(1).height($('.blog-post-preview').eq(0).height());
				} else {
					$('.blog-post-preview').eq(1).height('auto');
				}
			});

			$(window).on('resize', function () {
				if ($(window).width() > 992) {
					$('.blog-post-preview').eq(1).height($('.blog-post-preview').eq(0).height());
				} else {
					$('.blog-post-preview').eq(1).height('auto');
				}
			});

			// Menu Toggle - Style 2
			$('.stack-menu-toggle').on('click', function () {
				if (!$('html').hasClass('stack-nav-visible')) {

					if ($(window).scrollTop() !== 0) {
						$('html').velocity('scroll', {
							duration: 100,
							complete: function () {
								setTimeout(function () {
									$('html').addClass('stack-nav-visible overflow-stack-nav');
									disableScroll();
									$(window).trigger('resize');
								}, 150);
							}
						});
					} else {
						$('html').addClass('stack-nav-visible overflow-stack-nav');
						disableScroll();
						$(window).trigger('resize');
					}
				} else {
					enableScroll();
					$('html').removeClass('stack-nav-visible');

					setTimeout(function () {
						$('html').removeClass('overflow-stack-nav');
					}, 450);
				}
			});

			$('.close-stack-nav').on('click', function () {
				enableScroll();
				$('html').removeClass('stack-nav-visible');

				setTimeout(function () {
					$('html').removeClass('overflow-stack-nav');
				}, 450);
			});

			$('.page-wrapper').on('click', function (e) {
				if ($('html').hasClass('stack-nav-visible')) {
					if (!$(e.target).parent().is('.stack-menu-toggle')) {
						enableScroll();
						$('html').removeClass('stack-nav-visible');

						setTimeout(function () {
							$('html').removeClass('overflow-stack-nav');
						}, 450);
					}
				}
			});

			$(window).on('scroll', function () {
				if ($('.stack-nav-wrapper').length || $('.main-slider').length || $('.full-page-intro').length) {
					if ($(window).scrollTop() === 0) {
						$('html').addClass('perspective');
					} else {
						$('html').removeClass('perspective');
					}
				}
			});

			// Demo Blocks 
			if ($('.demo-block').length) {
				if ($(window).width() < 992) {
					$('.demo-block').eq($('.demo-block').length - 1).css({
						'margin-bottom': '95px'
					});
				} else {
					$('.demo-block').eq($('.demo-block').length - 1).css({
						'margin-bottom': '95px'
					});
					$('.demo-block').eq($('.demo-block').length - 2).css({
						'margin-bottom': '95px'
					});
				}
			}

			// Mobile Nav
			$('.mobile-navigation-toggle').on('click', function () {
				$('body').toggleClass('mobile-navigation-visible');

				return false;
			});

			$('.main-header nav > ul').on('click', function (e) {
				if ($(window).width() < 992) {
					e.stopPropagation();
				}
			});

			$(document).on('click', function () {
				$('body').removeClass('mobile-navigation-visible');				
			});

			$('.main-header nav li.menu-item-has-children > a').on('click', function (e) {
				var obj = $(this);

				if ($(window).width() < 992) {
					e.preventDefault();

					obj.parent().toggleClass('open');
					obj.next().slideToggle(225);
				}
			});
		},

		accordionInit: function () {
			var accordion = $('.accordion-group');

			accordion.each(function () {
				var accordion = $(this).find('.accordion-box');

				accordion.each(function () {
					var obj = $(this),
						header = $(this).find('.box-header h4'),
						body = $(this).find('.box-body');

					header.on('click', function () {
						if (obj.hasClass('open')) {
							body.velocity('slideUp', {
								duration: 150,
								complete: function () {
									obj.removeClass('open');
								}
							});
						} else {
							obj.addClass('open');
							body.velocity('slideDown', {duration: 195});
						}
					});
				});
			});
		},

		isotopeInit: function () {
			var isotopeContainer = $('.isotope-container'),
				defaultSelection = isotopeContainer.data('default-selection');

			// Isotope Init
			isotopeContainer.imagesLoaded(function () {
				isotopeContainer.isotope({
					filter: defaultSelection,
					itemSelector: '.isotope-item'
				});
			});

			// Isotope Filters
			$('.isotope-filters a').on('click', function () {
				$('.isotope-filters .current').removeClass('current');
				$(this).addClass('current');

				var selector = $(this).attr('data-filter');
					isotopeContainer.isotope({
						filter: selector,
						animationOptions: {
						    duration: 945,
						    easing: 'linear',
						    queue: false
						}
					});
				return false;
			});
		},

		loadTwitter: function () {
			var linkify = function (text) {
		        text = text.replace(/(https?:\/\/\S+)/gi, function (s) {
		            return '<a href="' + s + '">' + s + '</a>';
		        });
		        text = text.replace(/(^|)@(\w+)/gi, function (s) {
		            return '<a href="http://twitter.com/' + s + '">' + s + '</a>';
		        });
		        text = text.replace(/(^|)#(\w+)/gi, function (s) {
		            return '<a href="http://search.twitter.com/search?q=' + s.replace(/#/, '%23') + '">' + s + '</a>';
		        });
		        return text;
		    };

		    $('.twitter_widget').each(function () {
		        var t = $(this);
		        var t_date_obj = new Date();
		        var t_loading = 'Loading tweets..'; //message to display before loading tweets
		        var t_container = $('<ul>').addClass('twitter-list clean-list').append('<li>' + t_loading + '</li>');
		        t.append(t_container);
		        var t_user = t.attr('data-user');
		        var t_posts = parseInt(t.attr('data-posts'), 10);

		        jQuery.getJSON("php/twitter.php?user=" + t_user, function (t_tweets) {
		            t_container.empty();
		            for (var i = 0; i < t_posts && i < t_tweets.length; i++) {
		                var t_date = Math.floor((t_date_obj.getTime() - Date.parse(t_tweets[i].created_at)) / 1000);
		                var t_date_str;
		                var t_date_seconds = t_date % 60;
		                t_date = Math.floor(t_date / 60);
		                var t_date_minutes = t_date % 60;
		                if (t_date_minutes) {
		                    t_date = Math.floor(t_date / 60);
		                    var t_date_hours = t_date % 60;
		                    if (t_date_hours) {
		                        t_date = Math.floor(t_date / 60);
		                        var t_date_days = t_date % 24;
		                        if (t_date_days) {
		                            t_date = Math.floor(t_date / 24);
		                            var t_date_weeks = t_date % 7;
		                            if (t_date_weeks)
		                                t_date_str = t_date_weeks + ' week' + (1 == t_date_weeks ? '' : 's') + ' ago';
		                            else
		                                t_date_str = t_date_days + ' day' + (1 == t_date_days ? '' : 's') + ' ago';
		                        } else
		                            t_date_str = t_date_hours + ' hour' + (1 == t_date_hours ? '' : 's') + ' ago';
		                    } else
		                        t_date_str = t_date_minutes + ' minute' + (1 == t_date_minutes ? '' : 's') + ' ago';
		                } else
		                    t_date_str = t_date_seconds + ' second' + (1 == t_date_seconds ? '' : 's') + ' ago';
		                var days = Math.round((new Date() - new Date(t_tweets[i].created_at)) / 86400 / 1000);
		                var daysToShow;
		                if (days === 0) {
		                	daysToShow = "Today";
		                } else if (days === 1) {
		                	daysToShow = "1 Day Ago";
		                } else {
		                	daysToShow = days + " Days Ago";
		                }

		                var t_message =
		                    '<li class="tweet">' +
		                    	linkify(t_tweets[i].text) +
		                    	'<span class="date">' + daysToShow + '</span>' +
		                    '</li>';
		                t_container.append(t_message);
		            }
		        });
		    });
		},

		noUiInit: function () {
			var priceSlider = $('.widget_price_filter .price-slider .slider')[0],
				step = $(priceSlider).data('step'),
				start = $(priceSlider).data('start'),
				stop = $(priceSlider).data('stop'),
				min = $(priceSlider).data('min'),
				max = $(priceSlider).data('max');

			if ($('.widget_price_filter .price-slider').length) {
				noUiSlider.create(priceSlider, {
					start: [start, stop],
					connect: true,
					step: step,
					range: {
						'min': min,
						'max': max
					}
				});

				// Display Slider Values
				var snapValues = [
					document.getElementsByClassName('slider-snap-value-lower')[0],
					document.getElementsByClassName('slider-snap-value-upper')[0]
				];

				priceSlider.noUiSlider.on('update', function( values, handle ) {
					snapValues[handle].innerHTML = parseFloat(values[handle]);
				});
			}
		},

		googleMaps: function () {
			// Describe Google Maps Init Function 
			function initialize_contact_map (customOptions) {
                var mapOptions = {
                        center: new google.maps.LatLng(customOptions.map_center.lat, customOptions.map_center.lon),
                        zoom: parseInt(customOptions.zoom),
                        scrollwheel: false,
                        disableDefaultUI: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        styles: [{ stylers: [{saturation: -100}]}]
                    };
                var contact_map = new google.maps.Map($('#map-canvas')[0], mapOptions),
                    marker = new google.maps.Marker({
                        map: contact_map,
                        position: new google.maps.LatLng(customOptions.marker_coord.lat, customOptions.marker_coord.lon),
                        animation: google.maps.Animation.DROP,
                        icon: customOptions.marker,
                    });
            }
            
            if ($('#map-canvas').length) {
            	var customOptions = $('#map-canvas').data('options');
                google.maps.event.addDomListener(window, 'load', initialize_contact_map(customOptions));
            }
		},

		showCases: function () {
			$(window).on('scroll', function () {
				// MacBook Showcase
				var macBookShowCaseContainer = $('.macbook-showcase');

				if (macBookShowCaseContainer.length) {
					var showCaseContent = macBookShowCaseContainer.find('.inner-content img');

					if (checkVisibility(macBookShowCaseContainer)) {
						var translateValue = $(window).scrollTop() - macBookShowCaseContainer.offset().top + $(window).height();

						showCaseContent.css({
							'transform': 'translateY(' + -translateValue + 'px)'
						});
					}
				}

				// Main Blog Posts Showcase
				var blogPostWrapper = $('.blog-post-preview-wrapper');

				if (blogPostWrapper.length && $(window).width() > 992) {
					if (checkVisibility(blogPostWrapper)) {
						var offset = (Math.min(0, $(window).scrollTop() - $('.section-blog').offset().top + $(window).height() - 850)).toFixed();

					    blogPostWrapper.eq(0).css({
					    	'transform': 'translate('+ offset +'px, '+ Math.abs(offset * 0.65) +'px)'
					    });

					    blogPostWrapper.eq(1).css({
					    	'transform': 'translateY('+ -(offset * 0.35) +'px)'
					    });

					    blogPostWrapper.eq(2).css({
					    	'transform': 'translate('+ Math.abs(offset) +'px, '+ Math.abs(offset * 0.65) +'px)'
					    });
					}
				}

				// Lazy Loading
				var lazyLoadItem = $('.lazy-load');

				if (lazyLoadItem.length) {
					lazyLoadItem.each(function () {
						var obj = $(this);

						if (checkVisibility(obj))
							obj.addClass('show');
					});
				}
			});
		},

		foldingContent: function () {
			var foldingContainer = $('.folding-content'),
				foldingItem = $('.folding-item');

			foldingItem.find('> a').on('click', function (e) {
				e.preventDefault();

				if ($(window).width() < 992) {
					foldingContainer.velocity('scroll', {
						duration: 400,
						offset: -30,
						complete: function () {
							foldingContainer.addClass('content-open');
						}
					});
				} else {
					foldingContainer.addClass('content-open');
				}
			});

			$('.close-content-toggle').on('click', function () {
				foldingContainer.removeClass('content-open');
			});
		},

		animatedCounters: function () {
			function animateCounterBoxes () {
				$('.counter-box').each(function () {
				 	var obj = $(this);

				 	if (checkVisibility(obj) && obj.attr('data-state') === "0") {
				 		obj.attr('data-state', '1');

				 		var animationTime = 2500;

			 			$({
					  		Counter: 0
					  	}).animate({
				  			Counter: parseInt(obj.data('counter-value'), 10)
					  	}, {
					    	duration: animationTime,
					    	easing: 'swing',
					    	step: function (now) {
					      		obj.find('.value-container').text(Math.ceil(now));
					    	}
					  	});
				 	}
				});
			};

			animateCounterBoxes();

			$(window).on('scroll', function () {
				animateCounterBoxes();
			});
		},

		contactFormInit: function () {
			$('.contact-form').each(function () {
				var t = $(this);
				var t_result = $(this).find('.form-send');
				var t_result_init_val = t_result.text();
				var validate_email = function validateEmail(email) {
				    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				    return re.test(email);
				};
				var t_timeout;
				t.submit(function (event) {
				    event.preventDefault();
				    var t_values = {};
				    var t_values_items = t.find('input[name],textarea[name]');
				    t_values_items.each(function () {
				        t_values[this.name] = $(this).val();
				    });

				    if (t_values['name'] === '' || t_values['e-mail'] === '' || t_values['message'] === '') {
				        t_result.text('Please fill in all the required fields.');
				    } else
				    if (!validate_email(t_values['e-mail']))
				        t_result.text('Please provide a valid e-mail.');
				    else
				        $.post("php/contacts.php", t.serialize(), function (result) {
				            t_result.text(result);
				        });
				    clearTimeout(t_timeout);
				    t_timeout = setTimeout(function () {
				        t_result.text(t_result_init_val);
				    }, 3000);
				});

			});
		}
	};

	$(document).ready(function(){
		teslaThemes.init();

		setTimeout(function () {
			$('html').addClass('dom-ready');
		}, 320);
	});
}(jQuery));