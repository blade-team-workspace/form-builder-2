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

	var component_textarea = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'f7-icon': 'compose'
		};
		baseComponent.apply(this, arguments);	// 执行基类的初始化

		var that = this;

		this.template =
			'<span class="textarea-group">' +
				'<input type="hidden" name="{name}" />' +
				'<span class="showValue"></span>' +
			'</span>';

		this.__beforeRender = function() {
		}

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));/*
			this.$node.attr('placeholder', this.opts.placeholder);
			this.$node.attr('onfocus', 'this.placeholder=""');
			this.$node.attr('onblur', 'this.placeholder="' + this.opts.placeholder + '"');*/
			// this.$node.attr('readonly', this.opts.readonly || false);

			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			this.$node.on('click', this.editCallback);
		}
		this.__transRead = function() {

            this.$node.off('click', this.editCallback);

		}
		this.__setValue = function(value) {
			// console.log('textarea / this.__setValue(' + value + ')');

			// console.log(this.$node.find('input'));

			this.$node.find('input').val(value);
			this.$node.find('.showValue').html(value);
		}

		this.editCallback = function(e) {
			myApp.closeModal();
			var popupTemplate =
					'<div class="popup textarea-popup view">'+
						'<div class="navbar">' +
							'<div class="navbar-inner">' +
								'<div class="left">' +
									'<a href="#" class="close-popup">' +
										'<span>' +
											'<div class="navbar-btn nbg">取消</div>' +
										'</span>' +
									'</a>' +
								'</div>' +
								'<div class="center sliding lessonTitle">{title}</div>' +
								'<div class="right submitBtn disabled">' +
									'<a href="#" class="link close-popup textarea-popup-submit">' +
										'<span>' +
											'<div class="navbar-btn">完成</div>' +
										'</span>' +
									'</a>' +
								'</div>' +
							'</div>' +
						'</div>' +
						
						'<div class="navbar-through">' +
							'<div class="page-content">' +
								'<div class="list-block">' +
									'<ul>' +
										'<li class="align-top">' +
											'<div class="item-content">' +
												'<div class="item-inner">' +
													'<div class="item-input">' +
														'<textarea id="textEdit">{value}</textarea>' +
													'</div>' +
												'</div>' +
											'</div>' +
										'</li>' +
									'</ul>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>';

			myApp.popup(popupTemplate.format({
				title: that.opts.label,
				value: that.value || ""
			}));

			// 联动事件绑定
			$('#textEdit').on('input', function(e) {
				var minLengthLimit = -1;
				var maxLengthLimit = 99999;
				if (that.rule && that.rule.required == true) {
					minLengthLimit = 1;
				}
				if (that.rule && that.rule.minlength !== undefined) {
					minLengthLimit = that.rule.minlength || minLengthLimit;
				}
				if (that.rule && that.rule.maxlength !== undefined) {
					maxLengthLimit = that.rule.maxlength;
				}
				if ($(e.target).val().length >= minLengthLimit && $(e.target).val().length <= maxLengthLimit) {
					$(e.target).closest('.textarea-popup').find('.submitBtn').removeClass('disabled');
				} else {
					$(e.target).closest('.textarea-popup').find('.submitBtn').addClass('disabled');
				}
			});

			// 提交事件绑定
			$('.textarea-popup-submit').on('click', function() {
				var value = $('#textEdit').val();
				that.setValue(value);
			});
				
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
					case 'maxlength':
						checkStepFunction = function() {
							var value = that.$node.find('input').val();
							if (value && value.length > ruleValue) {
								myApp.alert('"{label}"的长度不能超过{ruleValue}'.format({label: label, ruleValue: ruleValue}));
								return false;
							} else {
								return true;
							}
						}
						break;
					case 'minlength':
						checkStepFunction = function() {
							var value = that.$node.find('input').val();
							if (value && value.length < ruleValue) {
								myApp.alert('"{label}"的长度不能小于{ruleValue}'.format({label: label, ruleValue: ruleValue}));
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

	$.formb.components.textarea = component_textarea;

}));