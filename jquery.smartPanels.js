;(function($, undefined){
	$.fn.smartPanels = function(options){
		this.each(function(){
			var $container = $(this);
            if(options == 'destroy' || options == 'refresh' || (options && options.fx == 'refresh')){
                $container.data('init', false);
            }
            
            if(options != 'destroy') {
                if($container.data('init') != true){
                    console.debug('initializing');
			        var $panels = $container.children();
			        var panelGroups = Math.round($panels.length / 2);

				        var containerWidth = $container.width();
				        var panelWidth = containerWidth / $panels.length;
				        var panelHeight = $container.height();

				        if($container.css('position') == 'static'){
					        $container.css('position', 'relative');
				        }
				
				        $panels.each(function(index, el){
					        var myGroup = index < panelGroups ? index : ($panels.length - index - 1);
					        $(el).css({
								        position : 'absolute',
								        width : panelWidth,
								        height: panelHeight,
								        top: '0',
								        left: index * panelWidth,
                                        opacity: 1
							        }).addClass('smartPanel').attr('panelStage', myGroup);
				        });
				
			        $container.css('overflow', 'hidden').data("init", true);
                }
            }
		});

		if(options){
            if(options.fx){
                options.duration = options.duration || 500;
                options.callback = options.callback || emptyCallback;
            }

            switch (options.fx) {
                case 'slideUp':
                    slideUp(this, options);
                    break;
                case 'slideDown':
                    slideDown(this, options);
                    break;
                case 'slideOut':
                    slideOut(this, options);
                    break;
                case 'slideIn':
                    slideIn(this, options);
                    break;
                case 'fadeOut':
                    fadeOut(this, options);
                    break;
                case 'fadeIn':
                    fadeIn(this, options);
                default:
                    if(options.callback){
                        options.callback();
                    }
                    break;
            }
		}
	}

	function emptyCallback(){ }
	
	function slideUp(items, options){
		animatePanels(items, { top: $(this).height() + 3, display: 'block', opacity: 1 }, {top: 0}, options);
	}
	
	function slideDown(items, options){
		animatePanels(items, { top: -($(this).height() + 3), display: 'block', opacity: 1 }, {top: 0}, options);
	}

    function fadeIn(items, options){
        animatePanels(items, { opacity: 0 }, { opacity: 1 }, options);
    }

    function fadeOut(items, options){
        items.each(function(){
			var $container = $(this);
			var $panels = $container.children();
			var panelGroups = Math.round($panels.length / 2);
			var containerWidth = $container.width();
			var panelWidth = containerWidth / $panels.length;
			
			$panels.each(function(index, el){
				$el = $(el);
				var myGroup = parseInt($el.attr('panelStage'));
				
				$el.css({ opacity: 1 }).animate({ opacity: 0 }, ((panelGroups - myGroup) / panelGroups) * options.duration, index == (panelGroups - 1) ? options.callback : emptyCallback);
			});
			
		});
    }
	
	function slideOut(items, options){		
		items.each(function(){
			var $container = $(this);
			var $panels = $container.children();
			var panelGroups = Math.round($panels.length / 2);
			var containerWidth = $container.width();
			var panelWidth = containerWidth / $panels.length;
			
			$panels.each(function(index, el){
				$el = $(el);
				var myGroup = parseInt($el.attr('panelStage'));
				var endCss = index < panelGroups ?
									{ left: - (panelWidth + 3) } :
									{ left: containerWidth + panelWidth + 3 };
				$el.css({ left:index * panelWidth, 'z-index': panelGroups - myGroup + 1, opacity: 1 })
					.animate(endCss, ((panelGroups - myGroup) / panelGroups) * options.duration, index == (panelGroups - 1) ? options.callback : emptyCallback);
			});
			
		});
	}
	
	function slideIn(items, options){		
		items.each(function(){
			var $container = $(this);
			var $panels = $container.children();
			var panelGroups = Math.round($panels.length / 2);
			var containerWidth = $container.width();
			var panelWidth = containerWidth / $panels.length;
			
			$panels.each(function(index, el){
				$el = $(el);
				var myGroup = parseInt($el.attr('panelStage'));
				var startCss = index < panelGroups ?
									{ left: - panelWidth, opacity: 1 } :
									{ left: containerWidth + panelWidth, opacity: 1 };
				var endCss = { left:index * panelWidth, 'z-index': panelGroups - myGroup + 1 };
				$el.css(startCss)
					.animate(endCss, ((1 + myGroup) / (1 + panelGroups)) * options.duration, index == (panelGroups - 1) ? options.callback : emptyCallback);
			});
			
		});
	}

	function animatePanels(items, originalCss, endCss, options){		
		items.each(function(){
			var $container = $(this);
			var $panels = $container.children();
			var panelGroups = Math.round($panels.length / 2);

			for(var i = 0; i < panelGroups; i++){
				$container.children('[panelStage=' + i + ']').each(function(index,el){
					$(el).css(originalCss).animate(endCss, (i + 1) / (panelGroups + 1) * options.duration, (i == (panelGroups - 1) && index == 0) ? options.callback : emptyCallback);
				});
			}
		});
	}
	
})(jQuery);