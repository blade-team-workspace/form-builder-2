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

	var component_text = function(kargs) {
		baseComponent.apply(this, arguments);

		this.template =
			'<span class="text-group">'+
				'<input type="text" name="{name}" width="{width}" height="{height}" ' +
				'class="form-control coreInput" value="{value}"/>'+
			'</span>';

		var that = this ;
		this.__render = function() {
			that.$node = $(that.template.format(that.opts));//配参数
			//this.$node.attr('placeholder', this.opts.placeholder);
			//this.$node.attr('onfocus', 'this.placeholder=""');
			//this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');
			//this.$node.attr('readonly', this.opts.isRead || false);

			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});
		}

		this.__setValue = function (value) {

				that.$node.find("input[value='" + value + "']").attr("checked",true);


		}

		
	}

	$.formb.components.text = component_text;

}));