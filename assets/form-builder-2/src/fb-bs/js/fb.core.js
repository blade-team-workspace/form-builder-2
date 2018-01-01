;(function (factory) {
	'use strict';
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(['jquery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($) {
	$.formb = $.formb || {};

	var cpts = $.formb.components;


	$.fn.renderForm = function(jsonConf) {
		var $form = $(this);
		// 初始化校验器
		// initValidator($form);

		// 渲染生成form
		render($form, jsonConf);

		// 加校验
		// afterAllAjaxCompleteDo(deferredObjectList, setFormRules, [$form]);

		// 加联动
        activeEventBinds($form,jsonConf.events);
		// 赋初值
		setFormValue($form, jsonConf.values);
		//zz写法，后人引以为鉴，要开发时间必须预估时间* 2
		// if(jsonConf.isRead)
		// setTimeout(changeContainerStatus($form) , 300);
	}


	function render($form, jsonConf) {
		// 将当前渲染的form对象传入配置，作为form容器的$node对象
        var opt = $.extend({}, jsonConf, {'$node': $form, '$form': $form});
		var Component = $.formb.components[opt.type];
		if (Component === undefined) {
			console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
		}
		var component = new Component(opt);
		component.render();
		// component.appendTo($form);
	}

	function activeEventBinds($form, ebs) {
		// 触发器名字和事件详情的map
		var triggerName_eb_map = {};
		$.each(ebs || [], function (idx) {
			triggerName_eb_map[ebs[idx].trigger] = ebs[idx];
		});
		$form.data('eventBindsMap', triggerName_eb_map);

		var eventBinds = $.formb.eventBinds;
		// 遍历绑定联动事件 初始化绑定
		$.each(ebs || [], function (idx) {
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
	// /////////////////////////////////////////////////////////////////////////////
	// 表单赋值与取值
	// /////////////////////////////////////////////////////////////////////////////
	function setFormValue($form, values) {
		// console.log('>>>length', $(':input').length);
		$(':input').trigger('change');
		$.each(values || [], function(name) {
			var value = values[name];

			var targets = $('[name=' + name + ']', $form);

			$.each(targets, function() {
				var $this = $(this);
				if (['radio', 'checkbox'].indexOf($this.attr('type')) != -1) {
					if ((!$.isArray(value) && $this.attr('value') == value) ||
						($.isArray(value) && value.indexOf($this.attr('value')) != -1)) {
						$this.prop('checked', true);
						$this.trigger('change');
					}
				} else {
					$this.val(value);
					$this.trigger('change');
				}
			});
		});
        changeContainerStatus($form);

	}

	function changeContainerStatus($form) {
        // var $inputs = $form.find('[name=' + that.opts.name + ']');
        var $containers = $form.find('.outerClass');
        $.each($containers , function (_idx) {
            var $container = $($containers[_idx]);
            var components = $container.find('.component');
            var allHidden = true;
            $.each(components, function (_idx) {
                if (!$(components[_idx]).is('[hidden]')) {
                    allHidden = false;
                }
            });
            if (allHidden) {
                $container.attr('hidden', true);
            } else {
                $container.removeAttr('hidden');
            }
		})

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
    // 扩展array类型原生方法，添加如果array中含有obj，那么返回true
    Array.prototype.contains = function (obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }

}));