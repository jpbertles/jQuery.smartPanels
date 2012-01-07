;(function($, undefined){
	$.fn.smartPanels = function(options){
		this.each(function(){
			var $container = $(this);
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
								left: index * panelWidth
							}).addClass('smartPanel').attr('panelStage', myGroup);
				});
				
			$container.css('overflow', 'hidden');
		});

		if(options){
			if(options.fx == 'slideUp'){
				slideUp(this, options);
			} else if (options.fx == 'slideDown'){
				slideDown(this, options);
			} else if (options.fx == 'slideOut'){
				slideOut(this, options);
			} else if (options.fx == 'slideIn'){
				slideIn(this, options);
			} else if (options.callback) {
				options.callback();
			}
		}
	}

	function emptyCallback(){ }
	
	function slideUp(items, options){
		animatePanels(items, { top: $(this).height() + 3, display: 'block' }, {top: 0}, options);
	}
	
	function slideDown(items, options){
		animatePanels(items, { top: -($(this).height() + 3), display: 'block' }, {top: 0}, options);
	}
	
	function slideOut(items, options){
		var duration = options.duration || 500;
		var callback = options.callback || emptyCallback;
		
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
									{ left: - panelWidth } :
									{ left: containerWidth + panelWidth }
				$el.css({ left:index * panelWidth, 'z-index': panelGroups - myGroup + 1 })
					.animate(endCss, duration, index == (panelGroups - 1) ? callback : emptyCallback);
			});
			
		});
	}
	
	function slideIn(items, options){
		var duration = options.duration || 500;
		var callback = options.callback || emptyCallback;
		
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
									{ left: - panelWidth } :
									{ left: containerWidth + panelWidth };
				var endCss = { left:index * panelWidth, 'z-index': panelGroups - myGroup + 1 };
				$el.css(startCss)
					.animate(endCss, duration, index == (panelGroups - 1) ? callback : emptyCallback);
			});
			
		});
	}

	function animatePanels(items, originalCss, endCss, options){
		var duration = options.duration || 500;
		var callback = options.callback || emptyCallback;
		
		items.each(function(){
			var $container = $(this);
			var $panels = $container.children();
			var panelGroups = Math.round($panels.length / 2);

			for(var i = 0; i < panelGroups; i++){
				$container.children('[panelStage=' + i + ']').each(function(index,el){
					$(el).css(originalCss).animate(endCss, duration * (i + 1), (i == (panelGroups - 1) && index == 0) ? callback : emptyCallback);
				});
			}
		});
	}
	
})(jQuery);