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
				'<select name="{name}" class="form-control"></select>';

		this.__render = function() {
			var that = this;
			that.$node = $(that.template.format(that.opts));

			if (that.opts.placeholder) {
				that.$node.append('<option value="">' + that.opts.placeholder + '</option>')
			}
			if (that.opts.dataUrl) {
				$.ajax({
					url: that.opts.dataUrl,
					success: function(data) {
						// TODO: log
						log('获取选项数据成功:', data);
						$.each(data.options, function() {
							that.$node.append('<option value="' + this.value + '">' + this.label + '</option>');
						});
					},
					error: function(data) {
						error('[ERROR] 获取待选项失败', opt);
					}
				});
			} else if (that.opts.options !== undefined && that.opts.options.length > 0){
				$.each(that.opts.options, function() {
					that.$node.append('<option value="' + this.value + '">' + this.label + '</option>');
				});
			} else {
				that.$node.append('<option value="">--No-Item--</option>');
			}
		}
	}

	$.formb.components.select = component_select;

}));