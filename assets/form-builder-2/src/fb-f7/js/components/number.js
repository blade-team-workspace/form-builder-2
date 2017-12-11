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

	var component_number = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'f7-icon': 'filter',
			'description': '请选择',
			'valueFormat': '{value}',
			'sort': 'desc'
		};
		baseComponent.apply(this, arguments);	// 执行基类的初始化
		var that = this;

		this.template =
			'<span class="number-group">' +
				'<span>'+
					'<input type="hidden" name="{name}" >'+
				'</span>'+
				'<span class="showValue"></span>' +
			'</span>';

		this.__beforeRender = function() {

		}

		this.__render = function() {
			//var optionshtml='<item minValue="">' + that.opts.placeholder + '</item>';
			this.$node = $(this.template.format({
				name: that.opts.name
			}));

			var valueList = [];
			if(this.opts.sort==='asc') {

                var i = this.opts.minValue;
                while(i <= that.opts.maxValue) {
                    valueList.push(i);
                    i += that.opts.stepValue;
                }
			}else {
				var i = this.opts.maxValue;
				while(i>=this.opts.minValue) {
					valueList.push(i);
					i -= this.opts.stepValue;
				}
			}


			that.myPicker = myApp.picker(
				{
				input: that.$node.find('input'),	//'#picker-device',
				init: true,
					toolbarTemplate:
						('<div class="toolbar">' +
						'<div class="toolbar-inner">' +
						'<div class="left">' +
						'<p class="link toolbar-randomize-link number_hint">{label}</p>' +
						'</div>' +
						'<div class="right">' +
							'<a href="#" class="link close-picker">确定</a>' +
						'</div>' +
						'</div>' +
						'</div>').format({'label': that.opts.description}),
				cols: [
					{
						textAlign: 'center',
						values: valueList,

					}

				]
			});

			this.$node.find('input').on('change', function(e) {

				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);

			});


			this.$node.find('select').on('change', function(e) {
				//var value = e.target.selectedOptions[0]==undefined?'':e.target.selectedOptions[0].label;
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			this.$node.on('click', this.editCallback);


			console.log('>>>>>>>>>>>>>>', this.myPicker);
		}

		this.__transRead  = function() {
            this.$node.off('click', this.editCallback);
		}
		function specialMethodForValue(value) {
			if (value === "0" || value === 0 || value === "") {

				this.value = "";
				this.$node.find('input').val("");
				this.$node.find('.showValue').html("");
			} else {
				this.$node.find('input').val(value);
				this.$node.find('.showValue').html(this.opts.valueFormat.format({value: value}));
			}
		}

		this.__transRead = function () {
            this.$node.off('click', this.editCallback);
        }
		this.__setValue = specialMethodForValue;

		this.__afterSetValue = specialMethodForValue;

		this.editCallback = function(e) {

			setTimeout(function() {
				if (that.myPicker.value && that.myPicker.value[0] !== undefined) {
					that.setValue(that.myPicker.value[0]);
				}
				that.myPicker.open();

			}, 0);
		}

		// 设置校验步骤
		this.__setCheckSteps = function() {
			$.each(this.rule, function(key) {
				var ruleValue = that.rule[key];
				console.log(ruleValue);
				var checkStepFunction = undefined;
				var label = that.opts.label;
				switch (key) {
					case 'required':
						checkStepFunction = function() {
							if (!that.$node.find('input').is(':disabled') && that.$node.find('input').val() == '') {
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

	}

	$.formb.components.number = component_number;

}));