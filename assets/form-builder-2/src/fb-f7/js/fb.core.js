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

    // 找上一个兄弟节点，直到找到label节点
	$.formb.findLabel = function($nowNode) {
        var $prevNode = undefined;
        var loopTimes = 0;
        while (loopTimes < 100 && $nowNode.length > 0) {
            $prevNode = $nowNode.prev();
            if ($prevNode.is('.item-label')) {
                break;
            }
            $nowNode = $prevNode;
            loopTimes += 1;
        }
        console.log('__findLabel, loopTimes=' + loopTimes);
        return $prevNode;	// 即label节点
    }
    // 找下一个兄弟节点，直到找到所有存值节点
    $.formb.findAllValueNodes = function($nowNode) {
        var $valueNodes = [];
        var $nextNode = undefined;
        var loopTimes = 0;
        while (loopTimes < 100 && $nowNode.length > 0) {
            $nextNode = $nowNode.next();
            if ($nextNode.length > 0 && $nextNode.is('.swipeout')) {
                $valueNodes.push($nextNode);
            } else {
            	break;
            }
            $nowNode = $nextNode;
            loopTimes += 1;
        }
        console.log('__findAllValueNodes, loopTimes=' + loopTimes);
        return $valueNodes;
    }

    // 判断是否所有存值点都隐藏了
    $.formb.isAllValueNodesHide = function($valueNodes) {
        var isAllHide = true;
        console.log('__isAllValueNodesHide $valueNodes.length=', $valueNodes.length);
        $.each($valueNodes, function(idx) {
            console.log('__isAllValueNodesHide', $valueNodes[idx], 'class="' + $valueNodes[idx].attr('class') + '" 没有hide类 ->', !$valueNodes[idx].hasClass('hide'));
            if (!$valueNodes[idx].hasClass('hide')) {
                isAllHide = false;
            }
        });
        console.log('__isAllValueNodesHide, isAllHide=' + isAllHide);
        return isAllHide;
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
			if (!isOK) {	// 如果不OK
				formIsValid = false;
			}
			console.log('checkSteps[{idx}] =isValid=> {isOK}'.format({idx: idx, isOK: isOK}));
		});

		return formIsValid;
	}



	// 给form的dom7对象绑定校验方法
	$.fn.validate = function() {
		var $form = $(this);
		if (!$form.is('form')) {
			console.log('Not form, skip it.');
		} else {
			console.log('Is form, go on.');
			var isValid = validateForm($form);
			return isValid;
		}
	}

	//给多选框赋值方法
    $.fn.smartSelectSetValue = function(values) {
        var $this = $(this);
        if (!$.isArray(values)) {
            console.error('[ERROR] "values" must be an Array. Now is', values);
        }
        var $options = $this.find('option');
        $.each($options, function(_idx) {
            var optionDom = $options[_idx];
            var $option = $($options[_idx]);
            optionDom.selected = (values.indexOf($option.attr('value')) != -1);
        });
        $this.change();
    }



	// 加联动事件
	// 添加联动事件
	function activeEventBinds($form, ebs) {
		// 触发器名字和事件详情的map
		var triggerName_eb_map = {};
		$.each(ebs, function(idx) {
			triggerName_eb_map[ebs[idx].trigger] = ebs[idx];
		});
		$form.data('eventBindsMap', triggerName_eb_map);

		var eventBinds = $.formb.eventBinds;


		// 遍历绑定联动事件 初始化绑定
		$.each(ebs || [], function(idx){
			var eb = ebs[idx];
			if (eb.eventType in eventBinds) {
				var $trigger = $form.find('[name=' + eb.trigger + ']');
				// 绑定联动事件
				$trigger.addClass('band').on(eventBinds[eb.eventType].listener, eventBinds[eb.eventType].callback);
				// 初始化触发
				$trigger.trigger(eventBinds[eb.eventType].listener);
			} else {
				console.error('事件绑定/[{ebName}]未找到对应的定义'.format({ebName: eb.eventType}));
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