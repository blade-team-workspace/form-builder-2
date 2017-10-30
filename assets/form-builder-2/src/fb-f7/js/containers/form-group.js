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
				'<li class="swipeout" style="height: 0px;">' +
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
				console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
			}

			// 将当前label传入下一层（主要是textarea会用）
			opt.label = this.opts.label;
			// 将当前$form传入下一层参数
			opt.$form = this.$form;
			// 将当前rule传入下一层
			opt.rule = this.$form.data('fb-form').opts.rules[opt.name];

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

		this.__afterAppend = function(childComponent) {

			// 生成{组件名: 显示标签名}的map，并且加必填标志
			// 加必填用的相关参数
			var showRequireMark = false;
			var rules = this.$form.data('fb-form').opts.rules;

			var name = childComponent.opts.name;

			var nameLabelMap = this.$form.data('nameLabelMap');
			if (nameLabelMap === undefined) {
				nameLabelMap = {};
			}
			nameLabelMap[name] = this.opts.label;
			
			this.$form.data('nameLabelMap', nameLabelMap);

			// 加必填标志
			if (rules[name] && rules[name].required === true) {
				var $title = $(this.$node[0]).find('.item-title');
				$title.append(this.$form.data('fb-form').requireMarkTemplate);
			}

			// 调用childComponent的setValidate方法
			if (rules[name]) {
				childComponent.setCheckSteps(rules[name]);
			}
		}
	}

	$.formb.components['form-group'] = container_formGroup;

}));