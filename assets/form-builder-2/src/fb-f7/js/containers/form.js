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
	var specialGroupId = "$p1it";	// 用于全局设置默认groupItem分开的时候使用的特殊groupId

	var baseContainer = $.formb.baseContainer;

	var container_form = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = undefined;

		this.formGroupTemplate =
				'<div class="list-block formGroupItem">' +
					'<ul>' +
					'</ul>' +
				'</div>';

		this.__beforeRender = function() {
		}

		this.__render = function() {
			// 如果没有，从模板新建form
			if (this.$node === undefined) {
				this.$node = $(this.template.format(this.opts));
			}
			// 渲染全部items
			$.each(this.opts.items, function(idx){
				var opt = that.opts.items[idx];

				// 确定groupId
				if (opt.groupId === undefined) {
					if (that.opts.groupDefaultSplit == true) {
						opt.groupId = specialGroupId;	// 使用特殊符号
					} else {
						opt.groupId = "default";
					}
				}
				
				var Component = $.formb.components[opt.type];
				if (Component === undefined) {
					console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
				}
				var component = new Component(opt);
				component.render();
				that.append(component);
			});
		}

		this.__append = function(childComponent) {
			var $parent = this.$node;

			var $lastChildNode = $parent.find('.list-block.formGroupItem:last-child');
			var $formGroupItem = undefined;

			console.log('-------', childComponent.opts.label, (
				// 上一个子节点不存在 或
				($lastChildNode.length == 0) || 
				// 上一个子节点不是list-block 或
				(!$lastChildNode.is('.list-block.formGroupItem')) ||
				// 上一个子节点的groupId与当前childComponent的groupId不同
				($lastChildNode.attr('groupid') != childComponent.groupId) ||
				// 上一个子节点的groupId是split(=$p1it)
				($lastChildNode.attr('groupid') === specialGroupId)
			), '>', ($lastChildNode.length == 0), (!$lastChildNode.is('.list-block.formGroupItem')), ($lastChildNode.attr('groupid') != childComponent.groupId), ($lastChildNode.attr('groupid') === specialGroupId));

			console.log("lastAttr=", $lastChildNode.attr('groupid'), "childGroupId=", childComponent.groupId);

			if (
				// 上一个子节点不存在 或
				($lastChildNode.length == 0) || 
				// 上一个子节点不是list-block 或
				(!$lastChildNode.is('.list-block.formGroupItem')) ||
				// 上一个子节点的groupId与当前childComponent的groupId不同
				($lastChildNode.attr('groupid') != childComponent.groupId) ||
				// 上一个子节点的groupId是split(=$p1it)
				($lastChildNode.attr('groupid') === specialGroupId)
			) {
				$formGroupItem = $(this.formGroupTemplate);
				console.log('set this.groupid>>>', this.groupId);
				$formGroupItem.attr('groupid', childComponent.groupId);
				$parent.append($formGroupItem);
			} else {
				console.log('found SAME $lastChildNode.attr(\'groupid\')>>>', $lastChildNode.attr('groupid'));
				$formGroupItem = $lastChildNode;
			}

			// form下一层的$node一定是一个数组，包括label和content
			$.each(childComponent.$node, function(idx) {
				$formGroupItem.find('ul').append(childComponent.$node[idx]);
			});
		}
		
	}

	$.formb.components.form = container_form;

}));