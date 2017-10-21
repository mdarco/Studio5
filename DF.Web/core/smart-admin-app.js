
/* SMART ADMIN SETTINGS */

// The rate at which the menu expands revealing child elements on click
$.menu_speed = 235;
	
/*
	* APP DOM REFERENCES
	* Description: Obj DOM reference, please try to avoid changing these
*/	
$.root_ = $('body');
$.left_panel = $('#left-panel');

// desktop or mobile
$.device = null;

/*
	* APP CONFIGURATION
	* Description: Enable / disable certain theme features here
*/		
$.navAsAjax = false; // Your left nav in your app will no longer fire ajax calls
	
// Please make sure you have included "jarvis.widget.js" for this below feature to work
//$.enableJarvisWidgets = true;
	
// Warning: Enabling mobile widgets could potentially crash your webApp if you have too many 
// 			widgets running at once (must have $.enableJarvisWidgets = true)
//$.enableMobileWidgets = false;

/*
	* CUSTOM MENU PLUGIN
*/

$.fn.extend({
	//pass the options variable to the function
	jarvismenu : function(options) {
		var defaults = {
			accordion: 'true',
			speed: 200,
			closedSign: '[+]',
			openedSign: '[-]'
		};

		// Extend our default options with those provided.
		var opts = $.extend(defaults, options);

		//Assign current element to variable, in this case is UL element
		var $this = $(this);

		//add a mark [+] to a multilevel menu
		$this.find("li").each(function() {
		    //if ($(this).find("ul").size() != 0) {
		    if ($(this).find("ul").length !== 0) {
				//add the multilevel sign next to the link
				$(this).find("a:first").append("<b class='collapse-sign'>" + opts.closedSign + "</b>");

				//avoid jumping to the top of the page when the href is an #
				if ($(this).find("a:first").attr('href') == "#") {
					$(this).find("a:first").click(function() {
						return false;
					});
				}
			}
		});

		//open active level
		$this.find("li.active").each(function() {
			$(this).parents("ul").slideDown(opts.speed);
			$(this).parents("ul").parent("li").find("b:first").html(opts.openedSign);
			$(this).parents("ul").parent("li").addClass("open")
		});

		$this.find("li a").click(function() {
		    //if ($(this).parent().find("ul").size() != 0) {
		    if ($(this).parent().find("ul").length !== 0) {
				if (opts.accordion) {
					//do nothing when the list is open
					if (!$(this).parent().find("ul").is(':visible')) {
						parents = $(this).parent().parents("ul");
						visible = $this.find("ul:visible");
						visible.each(function(visibleIndex) {
						    var close = true;

							parents.each(function(parentIndex) {
								if (parents[parentIndex] == visible[visibleIndex]) {
									close = false;
									return false;
								}
							});

							if (close) {
								if ($(this).parent().find("ul") != visible[visibleIndex]) {
									$(visible[visibleIndex]).slideUp(opts.speed, function() {
										$(this).parent("li").find("b:first").html(opts.closedSign);
										$(this).parent("li").removeClass("open");
									});

								}
							}
						});
					}
				}

				if ($(this).parent().find("ul:first").is(":visible") && !$(this).parent().find("ul:first").hasClass("active")) {
					$(this).parent().find("ul:first").slideUp(opts.speed, function() {
						$(this).parent("li").removeClass("open");
						$(this).parent("li").find("b:first").delay(opts.speed).html(opts.closedSign);
					});
				} else {
					$(this).parent().find("ul:first").slideDown(opts.speed, function() {
						$(this).parent("li").addClass("open");
						$(this).parent("li").find("b:first").delay(opts.speed).html(opts.openedSign);
					});
				}
			}
		});
	}
});

/* END: CUSTOM MENU PLUGIN */

/*
	 * DOCUMENT LOADED EVENT
	 * Description: Fires when DOM is ready
*/

$(document).ready(function() {
	// initialize left nav
	if (!null) {
		$('nav ul').jarvismenu({
			accordion: true,
			speed: $.menu_speed,
			closedSign: '<em class="fa fa-plus-square-o"></em>',
			openedSign: '<em class="fa fa-minus-square-o"></em>'
		});
	} else {
		alert("Error - menu anchor does not exist");
	}

	// collapse left nav
	$('.minifyme').click(function(e) {
		$('body').toggleClass("minified");
		$(this).effect("highlight", {}, 500);
		e.preventDefault();
	});
});

/* SMART ADMIN SETTINGS - End */
