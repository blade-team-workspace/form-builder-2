;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};
	$.formb.eventBinds = $.formb.eventBinds || {};


	// 自定义事件实际触发的标准事件名
	var definedEvents = {
		'valueChangeShowHide': 'change',
		'valueChangeDisable': 'change'
	};

	// 
	var definedFunction = {};
	definedFunction['valueChangeShowHide'] = function(event) {
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

		// 初始化，隐藏所有响应对象
		$.each(allResp, function(idx){
			if (!!allResp[idx] && allResp[idx].length > 0) {
				$form.find('[name=' + allResp[idx] + ']').closest('.listNode').hide();
				$form.find('[name=' + allResp[idx] + ']').closest('.listNode').prev('.item-divider').hide();
			}
		});

		// 遍历前值对应的所有响应对象，显示
		$.each(respNames, function(idx){
			if (!!respNames[idx] && respNames[idx].length > 0) {
				$form.find('[name=' + respNames[idx] + ']').closest('.listNode').show();
				$form.find('[name=' + respNames[idx] + ']').closest('.listNode').prev('.item-divider').show();
			}
		});
	}

	// 对象值改变，改变其他对象的显示和隐藏状态
	$.formb.eventBinds.valueChangeShowHide = function(event) {



	}

	// TODO: 对象值改变，改变其他对象的启用和禁用状态
	/*$.formb.eventBinds.valueChangeDisable = function(eventBind) {
		console.log('--> valueChangeDisable', eventBind);
	}*/
}));