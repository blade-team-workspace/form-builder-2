;(function (factory) {
	'use strict';
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(['jquery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($) {
	$.formb = $.formb || {};

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_textarea = function(kargs) {
		baseComponent.apply(this, arguments);

		this.template =
				'<textarea name="{name}" class="form-control" rows="{rows}"></textarea>';

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));
			this.$node.css({
				resize: this.opts.resize || "none"
			})
		}
	}

	$.formb.components.textarea = component_textarea;

}));