;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};
	$.formb.components = $.formb.components || {};
	
	var baseContainer = $.formb.baseContainer;

	var container_multimedia = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = undefined;

		this.labelTemplate =
				'<li>' +
					'<a href="#" class="item-with-addon">' +
						'<div class="item-content">' +
							'<div class="item-inner">' +
								'<div class="item-title">{label}</div>' +
								'<div class="addon addon-edit">' +
									'<i class="f7-icons size-smaller">add_round</i>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</a>' +
					
					// '<div class="popover addon-popover">' +
					// 	'<div class="popover-inner">' +
					// 		'<div class="icons-container">' +
					// 			'<a class="addon-text" href="javascript:void(0);"><i class="f7-icons size-smallest">compose</i></a>' +
					// 			'<a class="addon-images" href="javascript:void(0);"><i class="f7-icons size-smallest">camera</i></a>' +
					// 			'<a class="addon-audio" href="javascript:void(0);"><i class="f7-icons size-smallest">mic</i></a>' +
					// 			'<a class="addon-time" href="javascript:void(0);"><i class="f7-icons size-smallest">time</i></a>' +
					// 		'</div>' +
					// 	'</div>' +
					// '</div>' +

					'<span class="addon-items-popover">' +
						// height -> 0, console.log <<< $('#a').offset()
						'<div class="addon-items-container">' +
							'<a class="addon-text" href="javascript:void(0);"><i class="f7-icons size-smallest">compose</i></a>' +
							'<a class="addon-images" href="javascript:void(0);"><i class="f7-icons size-smallest">camera</i></a>' +
						'</div>' +
						'<div class="addon-items-popover-angle"></div>' +
					'</span>' +
				'</li>';
		this.contentTemplate =
				'<li class="swipeout">' +
					'<div class="swipeout-content item-content">' +
						'<div class="item-inner">' +
							'<div class="item-after"></div>' +
						'</div>' +
					'</div>' +
					'<div class="swipeout-actions-right">' +
						'<a href="#" class="swipeout-clean bg-red">删除</a>' +
					'</div>' +
				'</li>';

		this.__beforeRender = function() {
		}

		this.__render = function() {
			// 如果没有，从模板新建form
			if (this.$node === undefined) {
				this.$node = $(this.labelTemplate.format(this.opts));
			}
			// 渲染内部items
			var opt = undefined;
			$.each(this.opts.items, function(idx){
				opt = that.opts.items[idx];

				var Component = $.formb.components[opt.type];
				if (Component === undefined) {
					console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
				}
				opt.label = that.opts.label;
				var component = new Component(opt);
				component.render();
				that.append(component);
			});
		}

		this.__append = function(childComponent) {
			
			// 渲染formGroupItem >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var opts = childComponent.opts;

			// 渲染label >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var $label = $(this.labelTemplate.format(that.opts));
			this.$node = [$label];
			// 定制化点击addon的特殊操作
			$label.find('.addon-edit').on('click', function(e) {
				/*var clickedLink = this;
				var popoverNode = $(e.target).closest('li').find('.addon-items-popover');
				myApp.popover(popoverNode, clickedLink);*/
				// // $('.addon-popover').data('$source', $(e.target).closest('.list-block'));

				// ------------------------------------------------------------------
				var left = $(e.target).offset().left;
				var top = $(e.target).offset().top;

				// $('body').append($('#s'));
				var $parent = $(e.target).closest('li');
				var $modal = $parent.find('.addon-items-popover');
				var $overlay = $('<div class="modal-overlay modal-overlay-visible"></div>');

				function resetAddon() {
					$modal.removeClass('show');
					$parent.append($modal);
					$overlay.remove();
				}

				$modal.css({
					top: top - 37 + 'px'
				});
				$modal.addClass('show');
				$('body').append($modal);

				$modal.on('click', resetAddon);
				$overlay.on('click', resetAddon);

				$('body').append($overlay);

			});



			// $label.find('.addon-edit').on('click', childComponent.editCallback);

			// 渲染content >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var $content = $(this.contentTemplate.format(opts));
			// 给当前content暴露childComponent对象，方便以后操作
			$content.data('component', childComponent);
			$content.find('.item-after').append(childComponent.$node);
			// 清空当前对象的按钮
			$content.find('.swipeout-clean').on('click', function(e) {
				var el = $(e.target).closest('.swipeout');
				// 模仿swipe删除操作
				if (el.length === 0)
					return;
				if (el.length > 1)
					el = $(el[0]);
				el.css({height: el.outerHeight() + 'px'});
				var clientLeft = el[0].clientLeft;
				el.css({height: 0 + 'px'}).addClass('deleting transitioning').transitionEnd(function () {
					// 删除完毕操作
					el.removeClass('deleting transitioning swipeout-opened');
					el.find('.swipeout-content').css('transform', 'initial');
					el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened').children().css('transform', 'initial');
					
				});
				// 清空数据
				el.data('component').setValue('');
			});

			// , $content];
		}
	}

	$.formb.components['multimedia'] = container_multimedia;

}));