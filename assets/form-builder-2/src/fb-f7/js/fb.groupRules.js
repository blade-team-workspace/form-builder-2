;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};
	$.formb.groupRules = $.formb.groupRules || {};

	// 一组中至少填一个
	$.formb.groupRules.requireAtLeastOne = function($form, obj) {
		if (!$.isArray(obj)) {
			console.error('分组校验/至少需要一个: 输入参数必须是个数组的数组，你的输入:', obj);
			return;
		}
		console.log('--> requireAtLeastOne <--');
		// 思路：给form的checkSteps中推送一个方法（checkSteps是数组），在点击提交的时候依次调用
		var check_requireAtLeastOne = function() {
			var result = undefined;
			// 遍历每组
			$.each(obj, function(idx) {
				var nameList = obj[idx];

				var allNullFlag = true;
				// 组内遍历每个name
				$.each(nameList, function(_idx) {
					var name = nameList[_idx];

					// 发现有非空的对象
					var $inputItem = $form.find('[name=' + name + ']');
					var valueInForm = $inputItem.val();
					if (!$inputItem.is(':disabled') && !(valueInForm === undefined || valueInForm === '' || valueInForm === [])) {
						allNullFlag = false;
						// break;
					}
				});

				// 当前组全为空
				if (allNullFlag == true) {
					// myApp.alert('发现全空组：[' + nameList.join(', ') + ']');
					// 使用组件渲染时生成的{组件名: 显示标签名}的map提示错误
					var labelList = [];
					$.each(nameList, function(idx) {
						var label = $form.data('nameLabelMap')[nameList[idx]];
						if (labelList.indexOf(label) == -1 && !$form.find('[name=' + nameList[idx] + ']').is(':disabled')) {
							labelList.push(label);
						}
					});
					myApp.alert('请在[' + labelList.join(', ') + ']中，至少选填一项！');
					result = false;	// 校验不通过
				} else {
					console.log('分组校验<至少填一个>通过!! 组内容:', nameList);
					result = true;	// 校验通过
				}
			});
			return result;
		}

		$.formb.appendCheckStepToForm($form, check_requireAtLeastOne);
	}
}));