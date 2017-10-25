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
	$.formb.groupRules = $.formb.groupRules || {};


	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		// initValidator($form);

		// 渲染生成form
		// renderJson($form, jsonConf);

		render($form, jsonConf);

		// 加校验
		setFormRules($form, jsonConf);
		// afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		// 加联动
		// activeEventBinds($form, jsonConf.events);

		// 赋初值
		setFormValue($form, jsonConf.values);
	}


	function render($form, jsonConf) {
		var opt = $.extend({}, jsonConf, {'$node': $form, '$form': $form});
		var Component = $.formb.components[opt.type];
		if (Component === undefined) {
			console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
		}
		var component = new Component(opt);
		component.render();
		// component.appendTo($form);
	}


	// 加规则
	function setFormRules($form, jsonConf) {
		// 加普通校验
		var rules = jsonConf.rules;
		$.each(rules, function(name){
			var rule = rules[name];
			var $targets = $form.find('[name=' + name + ']');
			$.each(rule, function(ruleKey){
				var ruleValue = rule[ruleKey];
				var idx = ['true', 'false'].indexOf(ruleValue);
				if (idx != -1) {
					ruleValue = [true, false][idx];
				}
				if (ruleKey == 'required') {
					$targets.prop(ruleKey, ruleValue);
				} else {
					$targets.attr(ruleKey, ruleValue);
				}
			});
		});

		// 加分组校验
		var groupRules = jsonConf.groupRules;
		// TODO: 做成类似组件的模块化的结构
		$.each(groupRules, function(ruleName) {
			var groupRuleValidatingFunction = $.formb.groupRules[ruleName];
			if (groupRuleValidatingFunction === undefined) {
				console.error('分组校验/[{ruleName}]未找到对应的定义'.format({ruleName: ruleName}));
			} else {
				groupRuleValidatingFunction($form, groupRules[ruleName]);
			}
		});
	}






	// 给表单赋值的方法
	function setFormValue($form, values) {
		var formId = $form.attr('id');
		myApp.formFromData('#' + formId, values || {});
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