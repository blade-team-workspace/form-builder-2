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
	var baseComponent = $.formb.baseComponent;

	var component_image = function(kargs) {
		// 定义默认图标
		this.componentDefaultOpts = {
			'f7-icon': 'camera'
		};
		baseComponent.apply(this, arguments);	// 执行基类的初始化

		var that = this;

		this.template =
			'<span class="media-node">' +
				'<input type="hidden" name="{name}" />' +
				'<div class="thumbnails-container">' +
				'</div>' +
			'</span>';
		this.thumbnailTemplate =
			'<div class="thumbnail">' +
				'<div class="delete">' +
					'<i class="f7-icons">delete_round_fill</i>' +
				'</div>' +
				'<a class="openPhotoBrowser" href="javascript:void(0);">' +
					'<div class="image-container">' +
						'<img src="{url}" onerror="onerror=null;" />' +
					'</div>' +
				'</a>' +
			'</div>';
			// style=\'background: url(../../img/error.jpg) 0% 0% / 100% 100% no-repeat #000;\'
		this.waitingTemplate =
			'<div class="thumbnail waiting">' +
				'<div class="delete">' +
					'<i class="f7-icons">delete_round_fill</i>' +
				'</div>' +
				'<div class="preloader"></div>' +
			'</div>';

		this.__beforeRender = function() {
		}

		this.__render = function() {
			this.$node = $(this.template.format(this.opts));

			// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
			this.$node.find('input').on('change', function(e) {
				var value = e.target.value;
				// console.log('value ->', value);
				that.setValue(value);
			});

			// 点击当前节点进入编辑模式 TODEL
			// this.$node.on('click', this.editCallback);

			// 预上传回调
			this.$node.data('preUpload', function(data) {
				var groupId = data.groupId;
				var count = data.count;
				for (var i = 0; i < count; i++) {
					var $waiting = $(that.waitingTemplate);
					// 绑定删除上传中的方法
					$waiting.find('.delete').on('click', function(e){
						$delBtn = $(e.target).closest('.delete');
						$delBtn.closest('.thumbnail').remove();
					});
					$waiting.addClass('groupId_' + groupId);
					$waiting.addClass('index_' + i);
					that.$node.find('.thumbnails-container').append($waiting);
					// $waiting.insertBefore($addBtn);
				}
			});

			// 上传完毕回调
			this.$node.data('uploaded', function(imageData) {
				var $item = $(that.thumbnailTemplate.format(imageData));
				// 绑定删除当前图片的方法
				$item.find('.delete').on('click', function(e) {
					$delBtn = $(e.target).closest('.delete');
					$delBtn.closest('.thumbnail').remove();

					// 更新urls表单数据
					_updateImgUrls(imageData);

					// TODO: 弹出上限提示
					// 判断总thumbnail数量是否小于了max
					/*if (this.$node.find('.thumbnails-container').find('.thumbnail').length < this.opts.maxNumber) {
						this.$node.find('.thumbnails-container').find('.thumbnail.add').css('display', 'inline-block');
					}*/
				});
				// 替换对应的等待对象
				$waiting = that.$node.find(
						'.thumbnail.waiting.groupId_' + imageData.groupId + '.index_' + imageData.index);
				$item.insertBefore($waiting);
				$waiting.remove();

				// 更新urls表单数据
				_updateImgUrls(imageData);

				// TODO: 弹出上限提示
				// 判断总thumbnail数量是否超过了max
				/*if (this.$node.find('.thumbnails-container').find('.thumbnail').length >= this.opts.maxNumber) {
					this.$node.find('.thumbnails-container').find('.thumbnail.add').hide();
				}*/
			});
		}

		// 更新指定的表单项的值
		function _updateImgUrls(data) {
			var $input = $('form#{formId} input[name={name}]'.format(data));
			var $node = $input.closest('.item-content');
			var urlList = [];
			var $imgs = $node.find('img');
			$.each($imgs, function(idx) {
				urlList.push($imgs[idx].getAttribute('src'));
			});
			if (urlList.length > 0) {
				$input.val('images:[' + urlList.join(',') + ']');
			} else {
				$input.val('');
			}

			// TODO: 检查下这里的逻辑，写的时候有点儿混乱
			that.value = $input.val();
			that.checkViewStatus();
		}

		this.__setValue = function(value) {
			console.log('image / this.__setValue(' + value + ')');

			// console.log(this.$node.find('input'));

			this.$node.find('input').val(value);
			this.$node.find('.showValue').html(value);

			// -----------------------------------------------------------

			var urlList;
			if (value.match(/images:\[(.*)\]/) && value.match(/images:\[(.*)\]/).length > 0) {
				urlList = value.match(/images:\[(.*)\]/)[1].split(',');
			} else {
				urlList = [];
			}
			$.each(urlList, function(idx) {
				var $item = $(that.thumbnailTemplate.format({url: urlList[idx]}));
				// 绑定删除当前图片的方法
				$item.find('.delete').on('click', function(e) {
					$delBtn = $(e.target).closest('.delete');
					$delBtn.closest('.thumbnail').remove();

					var imageData = {
						formId: that.$node.closest('form').attr('id'),
						name: that.opts.name
					};

					// 更新urls表单数据
					_updateImgUrls(imageData);

					// 判断总thumbnail数量是否小于了max
					// if (that.$node.find('.thumbnails-container').find('.thumbnail:not(.add)').length < that.opts.maxNumber) {
					// 	that.$node.find('.thumbnails-container').find('.thumbnail.add').css('display', 'inline-block');
					// }
				});
				// 放置
				// $item.insertBefore($addBtn);
				that.$node.find('.thumbnails-container').append($item);
			});
				
			// 判断总thumbnail数量是否超过了max
			// if (this.$node.find('.thumbnails-container').find('.thumbnail:not(.add)').length >= this.opts.maxNumber) {
			// 	this.$node.find('.thumbnails-container').find('.thumbnail.add').hide();
			// }
		}

		this.editCallback = function(e) {
			myApp.closeModal();

			if (that.fileGroupId === undefined) {
				that.fileGroupId = 0;
			}

			// 根据当前已存在的缩略图，调整max和min
			var nowCount = that.$node.find('.thumbnails-container').find('.thumbnail').length;
			var max = that.opts.maxNumber - nowCount;
			var min = (((that.opts.minNumber - nowCount) >= 0) ? (that.opts.minNumber - nowCount) : 0);
			
			var data = {
				type: 'image',
				formId: that.$node.closest('form').attr('id'),
				name: that.opts.name,
				max: max,
				min: min,
				groupId: that.fileGroupId
			};
			that.fileGroupId = that.fileGroupId + 1;
			var urlParam = $.param(data);
			window.location = '/upload?' + urlParam;
		}
	}

	$.formb.components.image = component_image;

}));