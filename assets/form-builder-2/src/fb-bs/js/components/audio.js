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

	$.formb.components = $.formb.components || {};
	var baseComponent = $.formb.baseComponent;

	var component_audio = function(kargs) {
		baseComponent.apply(this, arguments);// 执行基类的初始化

		this.template =  
				'<span class="component">' +
					'<input type="hidden" name="{name}"/>' +
					'<span class="record-part">' +
						// 录音按钮、试听按钮、上传按钮、清空按钮
						'<div class="recorder-placeholder" style="height: 34px; line-height: 34px; background-color: #eee; padding-left: 10px;">--录音部分，待渲染--</div>' +
					'</span>' +
					'<span class="play-part hide">' +
						// 目前只支持html5的方法
						'<audio class="fb-audio" controls="controls">您的浏览器不支持该功能</audio>' +
						'<button type="button" class="btn btn-danger delete"><i class="fa fa-close"></i></button>' +
					'</span>' +
				'</span>';

		var that = this ;

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));

			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				that.setValue(value);
			});

			// TODO: 渲染录音部分(未完成)
			this.$node.find('.recorder-placeholder').renderRecorder();

			// 删除按钮事件绑定
			this.$node.find('.play-part .delete').on('click', function(e) {
				that.setValue('');
			});
			if(that.opts.isRead) {

                this.$node.find('.play-part .delete').remove();

			}
		}


		// 播放和录音部分切换显示
		this.__partDisplayChange = function() {
			if (this.value.match(/audios:\[(.*)\]/) !== null) {
				this.$node.find('.play-part').removeClass('hide');
				this.$node.find('.record-part').addClass('hide');
			} else {
				this.$node.find('.play-part').addClass('hide');
				this.$node.find('.record-part').removeClass('hide');
			}
		}


		this.__setValue = function(data) {
			console.log('audio / this.__setValue("' + data + '")');
			if(that.opts.isRead) {

                this.$node.find('input').val(data);
                var url = "";

                if (data && data.match(/audios:\[(.*)\]/) !== null) {
                    url = data.match(/audios:\[(.*)\]/)[1].split(',')[0];
                }

                // 给播放部分的audio赋值
                this.$node.find('.play-part audio').attr('src', url);
            }
		};



		this.__afterSetValue = function(data) {
			this.__partDisplayChange();
		}

	};

	$.formb.components.audio = component_audio;
}));