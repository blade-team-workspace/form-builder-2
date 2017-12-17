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
            '<div class = "component"><span class="textarea-group">' +
				'<textarea name="{name}" class="form-control" rows="{rows}" value = "{value}"></textarea>'
            + '</span></div>';


		var that = this ;
		this.__render = function() {
			that.$node = $(that.template.format(that.opts));
			//this.$node.css({
			//	resize: this.opts.resize || "none"//没有对浏览器窗口进行调整
			//})
			this.$node.find('textarea').on('change', function(e) {//设置监听事件
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});
		}

		this.__transRead = function () {

			that.$node.find('span').remove();
			that.$node.append(that.readTemplate.format({value:that.value !== undefined?that.value:''}))
		}


		this.__setValue = function (value){

			that.$node.find("textarea[value='" + value + "']");

		}
	};

	$.formb.components.textarea = component_textarea;

}));