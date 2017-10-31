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



	// formb全局方法：给指定form增加校验步骤
	$.formb.appendCheckStepToForm = function($form, checkStepFunc) {
		var checkSteps = $form.data('checkSteps');
		if (checkSteps === undefined) {
			checkSteps = [];
		}
		checkSteps.push(checkStepFunc);

		$form.data('checkSteps', checkSteps);
	}



	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);

		// 渲染生成form
		render($form, jsonConf);

		// 加分组校验
		setFormGroupRules($form, jsonConf.groupRules);

		// 加联动
		activeEventBinds($form, jsonConf.events);

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
	}



	// 加分组校验
	function setFormGroupRules($form, groupRules) {
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



	// 整体校验方法
	function validateForm($form) {
		var checkSteps = $form.data('checkSteps');
		if (!checkSteps) {
			return "没有发现校验步骤";
		}
		var formIsValid = true;
		$.each(checkSteps, function(idx) {
			var isOK = checkSteps[idx]();
			if (isOK) {
				formIsValid = false;
			}
		});

		return formIsValid;
	}



	// 给form的dom7对象绑定提交方法
	$.fn.submit = function() {
		var $form = $(this);
		if (!$form.is('form')) {
			console.log('Not form, skip it.');
		} else {
			console.log('Is form, go on.');

			var isValid = validateForm($form);

			if (isValid == true) {
				// 通过校验
				// TODO: 提交
				console.log('[提交方法] 校验通过~~~~~');
			} else if (isValid == false) {
				// 未通过校验
				// do nothing
				console.log('[提交方法] 校验不通过！！');
			} else {
				console.log('[提交方法] 校验结果返回:', isValid);
			}
		}
	}



	// 加联动事件
	// 添加联动事件
	function activeEventBinds($form, ebs) {
		// 触发器名字和事件详情的map
		var triggerName_eb_map = {};
		$.each(ebs, function(idx) {
			triggerName_eb_map[ebs[idx].trigger] = ebs[idx];
		});

		// 模板定义，TODO: 挪到真正的模板中	<<<---START--->>>
		var definedFunction = {};

		var definedEvents = {
			'valueChangeShowHide': 'change',
			'valueChangeDisable': 'change'
		};	// 用来绑定和解绑事件

		// 加入到事件模板？？
		// TODO: 加入魔板
		// 值改变选中对象的disable状态
		definedFunction['valueChangeDisable'] = function(event) {
			// 当前事件的触发对象
			var $this = $(event.target);
			// 作用域（form）
			var $form = $this.closest('form');
			// 当前事件触发对象的name属性
			var triggerName = event.target.name;
			// 当前事件绑定的详情
			var eb = triggerName_eb_map[triggerName];
			// 所有响应对象名
			var allResp = [];
			$.each(eb.valueResps, function(value){
				allResp.add(eb.valueResps[value]);
			});

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象

			if ($this.attr('type') == 'checkbox') {
				$.each($('[name=' + triggerName + ']:checked', $form), function(){
					triggerValues.push($this.val());
					respNames.add(valueRespMap[$this.val()]);
				});
			} else {
				triggerValues = [$this.val()];
				respNames.add(valueRespMap[$this.val()]);
			}
			console.log('Selected: [' + triggerValues.join(', ') + ']');

			// 初始化，禁用所有响应对象
			$.each(allResp, function(idx){
				if (!!allResp[idx] && allResp[idx].length > 0) {
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').addClass('disabled');
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').prev('.item-divider').addClass('disabled');
					$form.find('[name=' + allResp[idx] + ']').closest('.listNode').find('input, select, textarea').prop('disabled', true);
				}
			});

			// 遍历前值对应的所有响应对象，取消禁用
			$.each(respNames, function(idx){
				if (!!respNames[idx] && respNames[idx].length > 0) {
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').removeClass('disabled');
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').prev('.item-divider').removeClass('disabled');
					$form.find('[name=' + respNames[idx] + ']').closest('.listNode').find('input, select, textarea').prop('disabled', false);
				}
			});
		}
		// 模板定义，TODO: 挪到真正的模板中	<<<--- END --->>>

		// 遍历绑定联动事件 初始化绑定
		$.each(ebs || [], function(idx){
			var eb = ebs[idx];
			if ((eb.eventType in definedFunction) && (eb.eventType in definedEvents)) {
				var $trigger = $form.find('[name=' + eb.trigger + ']');
				var $triggerItem = $trigger.closest('.listNode');
				// 绑定联动事件
				$trigger.addClass('band').on(definedEvents[eb.eventType], definedFunction[eb.eventType]);
				// 初始化触发
				$trigger.trigger(definedEvents[eb.eventType]);
			} else {
				console.log('[WARN] Not support yet.', eb.eventType);
			}
		});
	}



	// 给表单赋值的方法
	function setFormValue($form, values) {
		var formId = $form.attr('id');
		myApp.formFromData('#' + formId, values || {});
	}




	// 扩展array类型原生方法，添加obj如果是array，就让其元素合并，否则直接加入
	Array.prototype.add = function(obj) {
		var arrList = this;
		if ($.isArray(obj)) {
			$.each(obj, function(_idx) {
				arrList.push(obj[_idx]);
			});
		} else {
			arrList.push(obj);
		}
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