;(function($, undefined){
	$.fn.smartPanels = function(options){
        if(!options){
            options = {};
        }

        if(options.fx){
            options.duration = options.duration || 500;
            options.callback = options.callback || emptyCallback;
        }
        

		this.each(function(){
			var $container = $(this);
            if(options == 'destroy' || options == 'refresh' || (options && options.fx == 'refresh')){
                $container.data('smartPanelSettings', null);
            }
            
            if(options != 'destroy') {
                if(!$container.data('smartPanelSettings')){
                    var $smartPanelSubContainer = $container.find('.smartPanelSubContainer');
                    if($smartPanelSubContainer.length == 0){
                        $smartPanelSubContainer = $('<div class="smartPanelSubContainer"></div>');
                        $container.append($smartPanelSubContainer);
                    } else {
                        $smartPanelSubContainer.empty();
                    }
                    $smartPanelSubContainer.hide();

			        var $panels = $container.children(':not(.smartPanelSubContainer)');
			        var panelGroups = Math.round($panels.length / 2);

				        var containerWidth = $container.width();
				        var panelWidth = containerWidth / $panels.length;
				        var panelHeight = $container.height();

				        if($container.css('position') == 'static'){
					        $container.css('position', 'relative');
				        }
				
				        $panels.each(function(index, el){
					        var myGroup = index < panelGroups ? index : ($panels.length - index - 1);
					        var $el = $(el).css({
								        position : 'absolute',
								        width : panelWidth,
								        height: panelHeight,
								        top: '0',
								        left: index * panelWidth,
                                        opacity: 1
							        }).addClass('smartPanel').attr('panelStage', myGroup).attr('panelIndex', index);
                            if(options.subPanelSelector){
                                var subPanelContainer = $el.find(options.subPanelSelector).hide().clone().attr('parentPanelIndex',index) ;
                                $smartPanelSubContainer.append(subPanelContainer);
                                $el.click(function(){
                                    var fx = options.fx || typeof options == typeof '' ? options : 'slideIn';
                                    fx = fx.replace('Up', 'Down').replace('In', 'Out');
                                    var currentIndex = $(this).attr('panelIndex');
                                    $container.smartPanels({ fx: fx, callback: function() {
                                        $smartPanelSubContainer.show().find('[parentPanelIndex=' + currentIndex + ']') .fadeIn();
                                    }});
                                });
                            }
				        });
				
			        $container.css('overflow', 'hidden').data("smartPanelSettings", { panelGroups: panelGroups, panelWidth: panelWidth, panelHeight: panelHeight, containerWidth: containerWidth });
                }
            }           

            var container = $(this);
            var settings = $container.data("smartPanelSettings");

            switch (options.fx) {
                case 'slideUp':
                    slideUp(container, options, settings);
                    break;
                case 'slideDown':
                    slideDown(container, options, settings);
                    break;
                case 'slideOut':
                    slideOut(container, options, settings);
                    break;
                case 'slideIn':
                    slideIn(container, options, settings);
                    break;
                case 'fadeOut':
                    fadeOut(container, options, settings);
                    break;
                case 'fadeIn':
                    fadeIn(container, options, settings);
                default:
                    if(options.callback){
                        options.callback();
                    }
                    break;
            }
		});
	}

	function emptyCallback(){ }

    function moveTo(element, newParent){
        var cl = element.clone();
        $(cl).appendTo(newParent);
        element.remove();
    }

	
	function slideUp(container, options, settings){
		animateForward(container, options, settings, 
            function(index, myGroup) { 
                return { top: settings.panelHeight + 3, display: 'block', opacity: 1, left:index * settings.panelWidth };
            }, 
            function(index, myGroup) { 
                return {top: 0};
            });
	}
	
	function slideDown(container, options, settings){
		animateBackwards(container, options, settings, 
            function(index, myGroup) { 
                return { top: 0, display: 'block', opacity: 1, left:index * settings.panelWidth } 
            }, 
            function(index, myGroup) { 
                return {top: settings.panelHeight + 3, display: 'block', opacity: 1 } 
            });
	}

    function fadeIn(container, options, settings){
        animateForward(container, options, settings, 
            function(index, myGroup) { 
                return { top: 0, display: 'block', opacity: 0, left:index * settings.panelWidth } 
            }, 
            function() { 
                return { opacity: 1 } 
            });
    }

    function fadeOut(container, options, settings){
        animateBackwards(container, options, settings, 
            function(index, myGroup){ 
                return { top: 0, display: 'block', opacity: 1, left:index * settings.panelWidth } 
            }, 
            function(index, myGroup) { 
                return { opacity: 0 } 
            });
    }
	
	function slideOut(container, options, settings){		
        animateBackwards(container, options, settings, 
            function(index, myGroup) { 
                return { top: 0, display: 'block', opacity: 1, left:index * settings.panelWidth, 'z-index': settings.panelGroups - myGroup + 1};
            }, 
            function(index, myGroup){ 
                return index < settings.panelGroups ?
									    { left: - (settings.panelWidth + 3) } :
									    { left: settings.containerWidth + settings.panelWidth + 3 };
            });
	}
	
	function slideIn(container, options, settings){
        animateForward(container, options, settings,
            function(index, myGroup){
                return { 
                    top: 0, 
                    display: 'block', 
                    opacity: 1, 
                    left: index < settings.panelGroups ? - settings.panelWidth : settings.containerWidth + settings.panelWidth, 
                    'z-index': settings.panelGroups - myGroup + 1
                };
            },
            function(index, myGroup){
                return { left:index * settings.panelWidth };
            });
	}

    function animateBackwards(container, options, settings, startCssFunction, endCssFunction){
        var panels = container.children();

		panels.each(function(index, el){
			$el = $(el);
			var myGroup = parseInt($el.attr('panelStage'));
			var endCss = endCssFunction(index, myGroup);
            var startCss = startCssFunction(index, myGroup);
			$el.css(startCss).animate(endCss, ((settings.panelGroups - myGroup) / settings.panelGroups) * options.duration, index == (settings.panelGroups - 1) ? options.callback : emptyCallback);
		});
    }

	function animateForward(container, options, settings, startCssFunction, endCssFunction){		
			var $panels = container.children();

			for(var i = 0; i < settings.panelGroups; i++){
				container.children('[panelStage=' + i + ']').each(function(groupIndex,el){
                    $el = $(el);
                    var index = $el.attr('panelIndex');
			        var endCss = endCssFunction(index, i);
                    var startCss = startCssFunction(index, i);
					$el.css(startCss).animate(endCss, (i + 1) / (settings.panelGroups + 1) * options.duration, (i == (settings.panelGroups - 1) && index == 0) ? options.callback : emptyCallback);
				});
			}
	}
	
})(jQuery);