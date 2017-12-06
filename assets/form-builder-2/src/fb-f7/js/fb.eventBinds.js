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

	// 对象值改变，改变其他对象的显示和隐藏状态
	$.formb.eventBinds.valueChangeShowHide = {
		listener: 'change',
		callback: function(event) {
			// 当前事件的触发对象
			var $this = $(event.target);
			// 作用域（form）
			var $form = $this.closest('form');
			// 当前事件触发对象的name属性
			var triggerName = event.target.name;
			// 当前事件绑定的详情
			var eb = $.formb.eventBinds.triggerName_eb_map[triggerName];
			// 所有响应对象名
			var allResp = [];	// 一层级
			$.each(eb.valueResps, function(value){
				// 使用自定义组相加方法，是组合并，是内容直接加入组
				allResp.add(eb.valueResps[value]);
			});

			var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
			var triggerValues = [];					// 触发器现在的值(为了可读性，实际未使用)
			var respNames = [];						// 取得当前值对应的所有响应对象(应该显示的对象名)

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

			// 轮询所有响应的输入项name
			$.each(allResp, function(idx){
				var itemName = allResp[idx];

				if (itemName != undefined && itemName.length > 0) {
					var $valueNode = $form.find('[name=' + itemName + ']').closest('.show-value-container');
					/*if ($valueNode.length == 0) {
						$valueNode = $form.find('[name=' + itemName + ']')
					}*/

					// 当前轮询的name在本次应该显示的nameList中
					if (respNames.indexOf(itemName) != -1) {
						// 显示存值的节点
						$valueNode.removeClass('hide');

						// 二话不说显示label和group节点
						var $labelNode = $.formb.findLabel($valueNode);	// 取得当前存值节点的label节点
						$labelNode.removeClass('hide');
							console.log('labelNode hide -> ""');
						$labelNode.closest('.formGroupItem').removeClass('hide');

						// 如果是multimedia的，联动图标的显示
						if ($labelNode.find('.addon-items-popover').length > 0) {
							$labelNode.find('a[item-name={itemName}]'.format({itemName: itemName})).removeClass('hide');
						}
					}
					// 不应该显示
					else {
						// 隐藏存值的节点
						$valueNode.addClass('hide');

						// 将要隐藏的组件值赋为空，并触发change事件
						$form.find('[name=' + itemName + ']').val('').trigger('change');

						var $labelNode = $.formb.findLabel($valueNode);	// 取得当前存值节点的label节点
						var $valueNodes = $.formb.findAllValueNodes($labelNode);	// 根据label节点取得当前label的所有存值节点
						
						// 如果是multimedia的，联动图标的隐藏
						if ($labelNode.find('.addon-items-popover').length > 0) {
							$labelNode.find('a[item-name={itemName}]'.format({itemName: itemName})).addClass('hide');
						}

						// 判断是否需要隐藏label
						if ($.formb.isAllValueNodesHide($valueNodes)) {
							// 隐藏label
							$labelNode.addClass('hide');
							console.log('labelNode -> hide');

							// 判断是否需要隐藏整组
							if ($labelNode.closest('ul').find('li').is('.hide')) {
								$labelNode.closest('.formGroupItem').addClass('hide');
							}
						}

					}
				}
				
			});

			// 遍历前值对应的所有响应对象，显示
			$.each(respNames, function(idx){
				if (!!respNames[idx] && respNames[idx].length > 0) {
					var $valueNode = $form.find('[name=' + respNames[idx] + ']').closest('.swipeout');
					$valueNode.removeClass('hide');
				}
			});
		}
	};

	// TODO: 对象值改变，改变其他对象的启用和禁用状态
	/*$.formb.eventBinds.valueChangeDisable = function(eventBind) {
		console.log('--> valueChangeDisable', eventBind);
	}*/
}));