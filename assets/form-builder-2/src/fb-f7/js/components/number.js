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
			'f7-icon': 'filter'
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
			var i = this.opts.minValue;
			while(i <= that.opts.maxValue) {
				valueList.push(i);
				i += that.opts.stepValue;
			}

			that.myPicker = myApp.picker(
				{
				input: that.$node.find('input'),	//'#picker-device',
				init: true,
					toolbarTemplate:
					'<div class="toolbar">' +
					'<div class="toolbar-inner">' +
					'<div class="left">' +
					'<p class="link toolbar-randomize-link"	id="number_hint_test">预计消费小时数</p>' +
					'</div>' +
					'<div class="right">' +
					'<a href="#" class="link close-picker">Done</a>' +
					'</div>' +
					'</div>' +
					'</div>',
				cols: [
					{
						textAlign: 'center',
						values: valueList,

					}

				]
					/*
				 formatValue: function (picker, values) {
				 console.log('valuesvaluesvaluesvaluesvalues', values);
				 return  "预计花费{values}小时".format({values: values});
				 },*/

//,
//				onChange: function (picr, country) {
//					picr= that.myPicker;
//					if (country>0){
//
//						if(that.myPicker.cols[0].replaceValues){
//							that.myPicker.cols[0].replaceValues(values[country]);
//						}
//					}
//
//				}
//				onOpen: function(){
//					if(){
//
//					}
//				}

				//	//var value = e.target.value;
				//	// console.log('value ->', value);
				//	that.setValue(value);					//if (value === "0" || value === 0) {
				//	//	value = "";
				//	//}
				//	//that.setValue();
				//   //
				//	//console.log(p, value);
				//}
			});

			//this.optionsMap = {};
			//for (var i = 0; i < that.opts.options.length; i++) {
			//	optionshtml+=option.format({
			//		value:that.opts.options[i].value,
			//		label:that.opts.options[i].label
			//	});
			//	that.optionsMap[that.opts.options[i].value] = that.opts.options[i].label;
			//};

			// this.$node.attr('readonly', this.opts.readonly || false);

			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的

			//console.log('>>>>>>>>>>>>>>>>>>>>>>>>>', this.opts);


			//this.$node = $(this.template.format({
			//	name: that.opts.name,
			//items: this.opts.minValue
			//}));

			this.$node.find('input').on('change', function(e) {


				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);

			});
			//this.$node.on('click',function(e) {
			//	if(e.target.value>0){
			//		that.myPicker.cols[0].setValue(values[0]);
			//	}
			//}


			//this.$node.on('click', function(values) {
				//	//var value = e.target.selectedOptions[0]==undefined?'':e.target.selectedOptions[0].label;
				//	// console.log('value ->', value);
				//	that.$node.setValue(values[0]);
				//});
			//this.$node.find('input').val(value);

			this.$node.find('select').on('change', function(e) {
				//var value = e.target.selectedOptions[0]==undefined?'':e.target.selectedOptions[0].label;
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			this.$node.on('click', this.editCallback);


			console.log('>>>>>>>>>>>>>>', this.myPicker);
		}

		function specialMethodForValue(value) {
			if (value === "0" || value === 0 || value === "") {

				this.value = "";
				this.$node.find('input').val("");
				this.$node.find('.showValue').html("");
			} else {
				this.$node.find('input').val(value);
				this.$node.find('.showValue').html("预计花费{value}个小时".format({value: value}));
			}
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
							if (that.$node.find('input').val() == '') {
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