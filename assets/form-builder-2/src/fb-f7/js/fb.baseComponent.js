;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		// AMD模式
		define(['Dom7'], factory);
	} else {
		// 全局模式
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formb = $.formb || {};

	// 基本组件类
	var baseComponent = function(kargs) {
		var that = this;
		// params
		this.$node = undefined;
		this.container = undefined;	// 容器对象，是否用到还不清楚……联动时使用？？
		this.defaultOpts = {
			'f7-icon': 'star'
		};
		this.template = '<div>THIS IS BASE-COMPONENT TEMPLATE</div>';
		this.opts = undefined;
		this.rule = undefined;
		this.value = undefined;
		this.groupId = undefined;


		// 初始化(实例化默认调用)
		this.__beforeInit = function(kargs) {
			// do nothing, not necessary
			// console.log('before init');
		}
		this.__init = function(kargs) {
			//取到全局的只读参数
            var global_isRead = {isRead: kargs.$form.data('fb-form').opts.isRead || false};
			// 合并默认参数
			this.defaultOpts = $.extend({}, this.defaultOpts, this.componentDefaultOpts);
			// 合并配置参数
            this.opts = $.extend({}, this.defaultOpts, global_isRead, kargs);
			// 合并规则
			this.rule = $.extend({}, kargs.rule);
			// 赋初值
			// this.value = kargs.value || undefined;
			this.value = kargs.$form.data('fb-form').opts.values[kargs.name];
			// 取groupId
			this.groupId = kargs.groupId || 'default';
			// 如果指定了$node和$form就用指定的
			this.$node = kargs.$node || undefined;
			this.container = kargs.container || undefined;
			this.$form = kargs.$form || undefined;
			this.rule = kargs.rule || undefined;
		}
		this.__afterInit = function() {
			// do nothing, not necessary
			// console.log('after init');
			// console.log('opts', this.opts);
			// console.log('rule', this.rule);
			// console.log('value', this.value);
		}
		this.init = function(kargs) {
			this.__beforeInit(kargs);
			this.__init(kargs);
			this.__afterInit(kargs);
		}
		// 自动实例化
		this.init(kargs);



		// 渲染元素的方法
		this.__beforeRender = function() {
			// do nothing, not necessary
			// console.log('before render');

		}
		this.__render = function() {
			// TODO
			console.error('Must be rewritten.');
		}
		this.__afterRender = function() {
			// do nothing, not necessary
            // console.log('after render');
            // if(this.value){
            //     this.setValue(this.value);
            // }

        }
		this.render = function() {
			this.__beforeRender();
			this.__render();
			this.__afterRender();

			// 给$node绑定获取component对象的方法
			// this.$node.data('component', that);
		}


        // 切换只读模式方法
		this.__beforeTransRead = function () {

            // do nothing, not necessary
        }
        this.__transRead = function () {
            // TODO
            console.error('Must be rewritten.')
        }
        this.__afterTransRead = function() {
            // do nothing, not necessary

		}

		//将component的swipeclass删除
		this.__cleanSwipeClass = function() {
            this.$node.closest('li.swipeout').find('.swipeout-actions-right').remove();


		}

		//将container事件删除
		this.__cleanLabelEvent = function() {

			//stream 不赋值container
			if(this.container) {
                if(this.container.$node) {
                    var $valueNodes = $.formb.findAllValueNodes($(that.$node[0]));

                    // 判断是否需要隐藏label
                    if ($.formb.isAllValueNodesHide($valueNodes)) {
                        $(that.$node[0]).addClass('hide');
                    }
                }
			}else{

			}

		}

        this.transRead = function () {
            this.__beforeTransRead();
            this.__transRead();
            this.__afterTransRead();
            this.__cleanSwipeClass();
        }

		// 配置校验方法
		this.__beforeSetCheckSteps = function() {
			// do g , not necessary
		}
		this.__setCheckSteps = function() {
			// TODO
			console.error('Must be rewritten.')
		}
		this.__afterSetCheckSteps = function() {
			// do nothing, not necessary
		}
		this.setCheckSteps = function(rule) {
			this.__beforeSetCheckSteps(rule);
			this.__setCheckSteps(rule);
			this.__afterSetCheckSteps(rule);
		}

		// 改变显示状态
		this.checkViewStatus = function() {

			if (this.value === undefined ||
				this.value === null ||
				this.value === '' ||
				this.value.length == 0) {
				this.$node.closest('li.swipeout').css('height', '0px');
				return false;
			} else {
                // console.log("::::" + this.$node.closest('li').outerHTML);
				this.$node.closest('li.swipeout').css('height', 'initial');
				return true;
			}
		}
		

		// 赋值的实现
		this.__beforeSetValue = function() {
			// do nothing, not necessary
		}
		this.__setValue = function(value) {
			// TODO
			console.error('Must be rewritten.');
		}
		this.__afterSetValue = function() {
			// do nothing, not necessary
		}
		this.setValue = function(value) {
			this.__beforeSetValue(value);
			this.__setValue(value);
			this.value = value;
			this.__afterSetValue(value);
			this.$node.trigger('change');	// 给stream容器用，方便监听
			this.checkViewStatus();
			if(this.opts.readonly){
				this.__cleanLabelEvent();
			}
		}

		// 编辑当前对象的回调
		this.editCallback = function(e) {
			console.log('Need be rewritten.');
		}
	}

	$.formb.baseComponent = baseComponent;


	/*(function($) {

		var Animal = function(data) {
			this.__self__ = this;
			this.type = "animal";
			this.data = data;
			this.showSelf = function() {
				for (var x in this.__self__) {
					console.log('  ', x, ':', this.__self__[x]);
				}
			}
		}

		var Dog = function(data, name) {
			Animal.apply(this, arguments);
			this.subType = "dog";
			this.name = name;
			this.bark = function() {
				// console.log('汪汪汪 我是' + this.name);
				// console.log('汪汪汪 我是' + this.subType + '属于' + this.type);
				// console.log('data=', data);
				this.showSelf();
			}
		}

		var xiaobai = new Dog('一个神奇的值', '小白');

		xiaobai.bark();

	})(window.jQuery);*/

}));