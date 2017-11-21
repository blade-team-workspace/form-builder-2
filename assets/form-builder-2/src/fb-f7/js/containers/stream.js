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
	
	var baseContainer = $.formb.baseContainer;

	var container_stream = function(kargs) {
		baseContainer.apply(this, arguments);

		var that = this;

		this.template = undefined;

		this.labelTemplate =
				'<li class="item-label">' +
					'<div class="item-content">' +
						'<div class="item-inner">' +
							'<div class="item-after">'+
							    '<div class="textarea-group one" style="color:#000;display:inline-block;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{label}'+
							    '</div>'+
							  '</div>'+
						'</div>' +
					'</div>' +
				'</li>';

			
		this.deleteBtn =
				'<span class="delete" style="">' +
	            	'<i class="f7-icons" style="font-size:15px;width:17px;">close</i>' +
	            '</span>' ;
		
		this.__beforeRender = function() {
		}

		this.__render = function() {
			// 渲染内部items
			var opt = undefined;
			var appendData = {
				label: this.opts.label,
				components: []				// 用于存放所有渲染完毕的components
			};
			var rules = this.$form.data('fb-form').opts.rules;
			console.log(this.$form.data('fb-form'));

			// 寻找appendData.label中的{taNewx}
			var reSearch = appendData.label.match((/{[^{}]*}/g));
			// 循环查找结果，将其替换；
			$.each(reSearch, function(idx) {
				appendData.label = appendData.label.replace(reSearch[idx], '<span item-name="{name}">{name}</span>'.format({name: reSearch[idx].match("{([^{}]*)}")[1]}));
				console.log(appendData.label);
			})

			var opts = this.labelTemplate.format({label: appendData.label});
			$.each(this.opts.items, function(idx){
				opt = that.opts.items[idx];
				//console.log(opt);

				var Component = $.formb.components[opt.type];
				//console.log(Component)

				if (Component === undefined) {
					console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
				}
				// 将当前label传入下一层（textarea需要用到作为弹出的标题（扶额））
				// opt.label = that.opts.label;
				// 将当前$form传入下一层参数
				opt.$form = that.$form;
				// 将当前rule传入下一层
				opt.rule = rules[opt.name];
				// console.log(opt.rule);		// undefined

				var component = new Component(opt);
				component.render();
				appendData.components.push(component);
			});
			this.append(appendData);
			// console.log(appendData)  // Object {label: "今天天气<span item-name={name}>{name}</span>,我们去了<span…me}</span>,心情<span item-name={name}>{name}</span>", components: Array[3]}
		}

		this.__append = function(appendData) {
			// 渲染streamItem >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

			// 渲染label >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			var $label = $(this.labelTemplate.format({label: appendData.label}));
			console.log($label)	//  {0: li.item-label, length: 1}
			
			this.$node = [$label];
			//console.log([$label]); // [l] length=1(items行数) Array[0]
			
			// 渲染content >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
			$.each(appendData.components, function(idx) {
				var childComponent = appendData.components[idx];
				var opts = childComponent.opts;

				// console.log(opts.name);	// taNew1,taNew2,taNew3
				
				// childComponent.$node插入到属性 item-name=opts.name 的元素前
				childComponent.$node.insertBefore($label.find('[item-name='+opts.name+']'));


				// 根据值有无控制边框显示
	            childComponent.$node.on('change', function() {
	            	if (childComponent.value !== '' || childComponent.value !== undefined) {
	            		childComponent.$node.removeClass('no-value');
	            	} else {
	            		childComponent.$node.addClass('no-value');

	            	}
	            });

				//渲染 deleteBtn 模板上的内容
				var $content = $(that.deleteBtn.format(opts));
				$content.insertBefore($label.find('[item-name='+opts.name+']'));
				// 移除
				$label.find('[item-name='+opts.name+']').remove(); 
				
				// 获取 .showValue中的值
	            var $setValue = $label.find('.one > span.textarea-group >.showValue').html();
	            // console.log($setValue);
	            // var $setValue = $getValParent.find('.showValue').text('');		// TODO: 以后setValue在render中做完时，删掉，临时代码
	            // console.log($setValue);

	            // 判断setValue中的内容是否为空
	            if ($setValue ==  '') {
	            	$label.find('.one > span.textarea-group').addClass('no-value');
	            	$label.find('.delete').remove();
	            } else {
	            	$label.find('.one > span.textarea-group').removeClass('no-value');
	            	$content.insertBefore($label.find('[item-name='+opts.name+']'));
	            }

	            // 删除目标
				$label.find('.delete').on('click', function(e) {
					// 删除 taNew value
	                $(e.target).closest('.delete').prev().addClass('no-value');
	                // 删除按钮
	                $(e.target).closest('.delete').remove();
	            });
			});
		}

		this.__afterAppend = function(appendData) {

			// 生成{组件名: 显示标签名}的map，并且加必填标志
			// 加必填用的相关参数
			var showRequireMark = false;
			var rules = this.$form.data('fb-form').opts.rules;

			//var name = childComponent.opts.name;

			var nameLabelMap = this.$form.data('nameLabelMap');
			if (nameLabelMap === undefined) {
				nameLabelMap = {};
			}
			nameLabelMap[name] = this.opts.label;
			
			this.$form.data('nameLabelMap', nameLabelMap);

			// 加必填标志
			if (rules[name] && rules[name].required === true) {
				var $title = $(this.$node[0]).find('.item-title');
				$title.append(this.$form.data('fb-form').requireMarkTemplate);
			}

			// 调用childComponent的setValidate方法
			if (rules[name]) {
				childComponent.setCheckSteps(rules[name]);
			}
		}
	}

	$.formb.components['stream'] = container_stream;

}));