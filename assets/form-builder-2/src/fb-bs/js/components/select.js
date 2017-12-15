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
				'<div class = "component"><select name="{name}" class="form-control"></select></div>';
		this.readTemplate = '<div class="contentClass form-control-static" title="{value}">{value}</div>';
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
				that.$node.append('<option value="">--No-Item--</option>');
			}


			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('select').on('change', function(e) {
				var value = e.target.value;
				that.setValue(value);
			});
		}

		this.__transRead = function () {

			that.$node.find('select').remove();
			that.$node.append(that.readTemplate.format({value:that.value !== undefined?optionsMap[that.value]:''}))
		}

		this.__setValue = function(value) {
			that.$node.find("option[value='"+value+"']").attr("selected",true);
			console.log("--",that.$node.find("option[value='"+value+"']").attr("selected",true));
		}

		//设置校验步骤
		this.__setCheckSteps = function() {
			$.each(this.rule, function(key) {
				var ruleValue = that.rule[key];
				var checkStepFunction = undefined;
				var label = that.opts.label;
				switch (key) {
					case 'required':
						checkStepFunction = function() {
							if (that.$node.find('select').val() == '') {
								myApp.alert('请填写"{label}"'.format({label: label}));
								return false;
							} else {
								return true;
							}
						}
						break;

					default:
						console.warn('[WARN] 发现未知参数 {key}: {ruleValue}'.format({key: key, ruleValue: ruleValue}));
						break;
				}
				if (checkStepFunction) {
					$.formb.appendCheckStepToForm(that.$form, checkStepFunction);
				}
			});
		}



	};

	$.formb.components.select = component_select;

}));