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

	var component_select = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'placeholder': '--请选择--'
		};
		baseComponent.apply(this, arguments);

		this.template =
				'<div class ="component"><div class="select-content"><select name="{name}" class="form-control"></select></div></div>';
		this.readTemplate = '<div class="form-control-static" title="{value}">{value}</div>';
		var that = this;
		var optionsMap = {};
		this.__render = function() {

			that.$node = $(that.template.format(that.opts));
				
			if (that.opts.placeholder) {
				that.$node.find('select').append('<option value="">' + that.opts.placeholder + '</option>')
			}
			if (that.opts.options !== undefined && that.opts.options.length > 0){
				$.each(that.opts.options, function() {
					that.$node.find('select').append('<option value="' + this.value + '">' + this.label + '</option>');
					optionsMap[this.value] = this.label;
				});
			} else {
				that.$node.find('.select-content').append('<option value="">--No-Item--</option>');
			}


			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('select').on('change', function(e) {
				var value = e.target.value;
				that.setValue(value);
			});
		}

		this.__transRead = function () {

			var value = that.$node.find('select').val();
            that.$node.find('.select-content').remove();
            that.$node.append(that.readTemplate.format({value:value !== undefined?optionsMap[value]:''}))
        }

		this.__setValue = function(value) {
            that.$node.find("option[value='"+value+"']").attr("selected",true);
        }


	};

	$.formb.components.select = component_select;

}));