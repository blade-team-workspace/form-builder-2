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

	var container_formGroup = function(kargs) {
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
									'<i class="f7-icons size-smaller">right</i>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</a>' +
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
			if (this.opts && this.opts.items) {
				if ($.isArray(this.opts.items) && this.opts.items.length == 1) {
					opt = this.opts.items[0];
				} else if ($.isArray(this.opts.items) && this.opts.items.length != 1) {
					console.warn('form-group的items应该为1或者是一个对象，请检查:', this.opts.items);
				} else {
					opt = this.opts.items;
				}
			}
			var Component = $.formb.components[opt.type];
			if (Component === undefined) {
				console.error('组件或容器[{type}]未找到对应的class定义'.format({type: jsonConf.type}));
			}
			opt.label = this.opts.label;
			var component = new Component(opt);
			component.render();
			this.append(component);
		}

		this.__append = function(childComponent) {
			
			// 渲染formGroupItem >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var opts = childComponent.opts;

			// 渲染label >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var $label = $(this.labelTemplate.format(that.opts));
			$label.find('.addon-edit').on('click', childComponent.editCallback);

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

			this.$node = [$label, $content];
		}
	}

	$.formb.components['form-group'] = container_formGroup;

}));