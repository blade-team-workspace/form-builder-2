;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD模式
		define(['jQuery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};
	$.formb.components = $.formb.components || {};
	
	var baseContainer = $.formb.baseContainer;

	var container_formGroup = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = 
				'<div class="outerClass {outerWidth} drag_item">' +
					'<div class="item row formDescription form-group">' +
						'<label class="labelClass {labelWidth} form-control-static">' +
							'<span class="textRequired formLabel pull-right">{label}</span>' +
						'</label>' +
						'<div class="contentClass {contentWidth}">' +
							'<div class="childComponent"></div>' +
							'<div class="help-block-error"></div>' +
						'</div>' +
					'</div>' +
				'</div>';

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
			var component = new Component(opt);
			component.render();
			this.append(component);
		}

		this.__append = function(childComponent) {
			// var opts = childComponent.opts; 	// 子组件的配置

			// TODO: 单体isSteam、isRead渲染

			this.$node = $(this.template.format(that.opts));	// 渲染自己的节点

			this.$node.find('.childComponent').replaceWith(childComponent.$node);	// 加入子组件
		}
	}

	$.formb.components['form-group'] = container_formGroup;

}));