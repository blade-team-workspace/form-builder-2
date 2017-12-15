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

	var cpts = $.formb.components;


	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		// initValidator($form);

		// 渲染生成form
		render($form, jsonConf);

		// 加校验
		// afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		// 加联动
		// activeEventBinds($form, jsonConf.events);

		// 赋初值
		setFormValue($form, jsonConf.values);
	}


	function render($form, jsonConf) {
		// 将当前渲染的form对象传入配置，作为form容器的$node对象
		var opt = $.extend({}, jsonConf, {'$node': $form});
		var Component = $.formb.components[opt.type];
		if (Component === undefined) {
			console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
		}
		var component = new Component(opt);
		component.render();
		// component.appendTo($form);
	}



	// 沿用fb1的代码
	function setFormValue($form, values) {
		$.each(values || [], function(name) {
			var value = values[name];

			var targets = $('[name=' + name + ']', $form);

			$.each(targets, function() {
				var $this = $(this);
				if (['radio', 'checkbox'].indexOf($this.attr('type')) != -1) {
					if ((!$.isArray(value) && $this.attr('value') == value) || 
						($.isArray(value) && value.indexOf($this.attr('value')) != -1)) {
						$this.prop('checked', true);
						$this.trigger('change');
					}
				} else {
					$this.val(value);
					$this.trigger('change');
				}
			});
		});
	}



// 扩展String类型的原生方法，提供类似java或python的format方法
	String.prototype.format = function(args) {
		var result = this;
		if (arguments.length > 0) {
			if (arguments.length == 1 && typeof (args) == "object") {
				for (var key in args) {
					if(args[key]!=undefined){
						var reg = new RegExp("({" + key + "})", "g");
						result = result.replace(reg, args[key]);
					}
				}
			}
			else {
				for (var i = 0; i < arguments.length; i++) {
					if (arguments[i] != undefined) {
						var reg = new RegExp("({[" + i + "]})", "g");
						result = result.replace(reg, arguments[i]);
					}
				}
			}
		}
		return result;
	}

}));