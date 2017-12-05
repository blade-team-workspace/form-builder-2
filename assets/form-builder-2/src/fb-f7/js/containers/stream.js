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
								'<div class="stream-layout">' +
									'{label}'+
								'</div>'+
							  '</div>'+
						'</div>' +
					'</div>' +
				'</li>';

		this.contentTemplate = 
				'<span class="show-value-container" item-name="{name}"></span>';

		this.deleteBtn =
				'<span class="delete">' +
					'<i class="f7-icons" style="font-size: 15px; width: 16px; line-height: 16px;">close</i>' +
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

			// 循环查找结果，将其替换
			$.each(reSearch, function(idx) {
				var name = reSearch[idx].match("{([^{}]*)}")[1];	// 去掉左右大括号的
				appendData.label = appendData.label.replace(reSearch[idx], that.contentTemplate.format({name: name}));
			})

			var opts = this.labelTemplate.format({label: appendData.label});
			$.each(this.opts.items, function(idx){
				opt = that.opts.items[idx];

				var Component = $.formb.components[opt.type];

				if (Component === undefined) {
					console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
				}
				// 将当前$form传入下一层参数
				opt.$form = that.$form;
				// 将当前rule传入下一层
				opt.rule = rules[opt.name];

				var component = new Component(opt);
				component.render();
				appendData.components.push(component);
			});

			this.append(appendData);
		}

		this.__append = function(appendData) {
			var $label = $(this.labelTemplate.format({label: appendData.label}));
			
			var global_isRead = this.$form.data('fb-form').opts.isRead;
			this.$node = [$label];

			// 遍历所有已经渲染的组件，替换到label中
			$.each(appendData.components, function(idx) {
				var childComponent = appendData.components[idx];
				var opts = childComponent.opts;
				
				var $container = $label.find('[item-name=' + opts.name + ']');
				// 找到指定“壳”，将渲染完的对象放入容器中
				$container.append(childComponent.$node);

				// 渲染 deleteBtn 模板上的内容
				var $deleteBtn = $(that.deleteBtn);
				$container.append($deleteBtn);
				$deleteBtn.css('display', 'none');

				// 根据值有无控制边框显示
				childComponent.$node.on('change', function() {
					if (childComponent.value === '' || childComponent.value === undefined) {
						childComponent.$node.addClass('no-value');
						$deleteBtn.css('display', 'none');
					} else {
						childComponent.$node.removeClass('no-value')
						childComponent.$node.css({'color': '#8e8e93', 'padding-left': '2px'});
						console.log(childComponent.value);
						$deleteBtn.css('display', 'inline-block');
					}
				});
				
				// 获取 .showValue中的值
				var childComponentValue = childComponent.value;

				// 初始化，判断setValue中的内容是否为空
				if (childComponentValue ==  '' ||childComponentValue === [] || childComponentValue === undefined) {
					childComponent.$node.addClass('no-value');
					childComponent.$node.next().css('display', 'none');
				} else {
					childComponent.$node.next().css('display', 'inline-block');
				}

				// 只读删掉删除按钮、转换只读模式
				if (childComponent.opts.isRead) {
					$deleteBtn.addClass('hide');
					childComponent.transRead();
				}

				// 删除目标
				$deleteBtn.on('click', function(e) { 
					$(this).css('display', 'none');		// 隐藏Btn
					childComponent.$node.addClass('no-value');		// 添加 no-value
					childComponent.setValue("");
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