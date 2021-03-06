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
	var baseComponent = $.formb.baseComponent;

	var component_select = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'f7-icon': 'list',
			'placeholder': '--请选择--'
		};
		baseComponent.apply(this, arguments);	// 执行基类的初始化

		var that = this;

		this.template =
			'<span class="textarea-group">' +
				'<span href="#" class="smart-select" data-open-in="picker">'+
					'<select name="{name}">{options}</select>'+
				'</span>'+
				'<span class="showValue"></span>' +
			'</span>';

		this.__beforeRender = function() {
		}

		this.__render = function() {
			var option='<option value="{value}">{label}</option>';
			var optionshtml='<option value="">' + that.opts.placeholder + '</option>';
			this.optionsMap = {};
			for (var i = 0; i < that.opts.options.length; i++) {
				optionshtml+=option.format({
					value:that.opts.options[i].value,
					label:that.opts.options[i].label
				});
				that.optionsMap[that.opts.options[i].value] = that.opts.options[i].label;
			};
			this.$node = $(this.template.format({
				name: that.opts.name,
				options: optionshtml
			}));
			// this.$node.attr('readonly', this.opts.readonly || false);

			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('select').on('change', function(e) {
				//var value = e.target.selectedOptions[0]==undefined?'':e.target.selectedOptions[0].label;
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			this.$node.on('click', this.editCallback);
		}

		this.__setValue = function(value) {
			this.$node.find('select').val(value);
			this.$node.find('.showValue').html(this.optionsMap[value]);
		}

		this.editCallback = function(e) {
			setTimeout(function(){
				var smartSelect=that.$node.find('select');
            	myApp.smartSelectOpen(that.$node.find('.smart-select'));
			}, 0);
		}
	}

	$.formb.components.select = component_select;

}));