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
			console.error('分组校验/至少需要一个: 输入参数必须是个数组，你的输入:', obj);
			return;
		}
		console.log('--> requireAtLeastOne <--');
		// 思路：给form的checkSteps中推送一个方法（checkSteps是数组），在点击提交的时候依次调用
		var check_requireAtLeastOne = function() {
			
		}
	}

}));