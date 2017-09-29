;(function (factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['Dom7'], factory);
	} else {
		factory(window.Dom7);
	}
}(function ($, undefined) {
	$.formc = $.formc || {};

	var templates = $.formc.templates = {};	// 模板集合
	var core = templates.core = {};
	var sub = templates.sub = {};
	var opts = templates.opts = {};
	var rule = templates.rule = {};
	var media = templates.media = {};		// 用来存储media中控件的模板

	core.text = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title label">{label}</div>' +
				'<div class="item-input">' +
					'<input type="text" name="{name}" placeholder="{placeholder}">' +
				'</div>' +
			'</div>' +
		'</div>';
	opts.text = {
		"name": "demo_text",
		"type": "text",						 // 基本类型
		"label": "文本框",
		"placeholder": "请输入文本",				// 非必填
		"description": "请输入英文、数字、下划线"
	};
	rule.text = {
		"required": false,
		"maxlength": 10,
		"minlength": 5
	};



	core.select = 
		'<a href="#" class="item-link smart-select" data-back-on-select="true" data-open-in="picker">' +
			'<select name="{name}">' +
			'</select>' +
			'<div class="item-content">' +
				'<div class="item-inner">' +
					'<div class="item-title label">{label}</div>' +
				'</div>' +
			'</div>' +
		'</a>';
	sub.select = '<option value="{value}">{label}</option>';
	opts.select = {
		"name": "demo_select",
		"type": "select",						 // 基本类型
		"label": "下拉单选",
		"placeholder": "请点击选择",				// 非必填
		"description": "请点击选择",
		"dataUrl": "",							// 填写使用Url加载待选项，否则使用options
		"options": [
			{"label": "选项1", "value": 1},
			{"label": "选项2", "value": 2},
			{"label": "选项3", "value": 3}
		]
	};
	rule.select = {
		"required": false
	};



	core.textarea = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title label">{label}</div>' +
				'<div class="item-input">' +
					'<textarea name="{name}" placeholder="{placeholder}"></textarea>' +
				'</div>' +
			'</div>' +
		'</div>';
	opts.textarea = {
		"name": "demo_textarea",
		"type": "textarea",						// 基本类型
		"label": "多行文本",
		"rows": 3,
		"resize": "none",
		"placeholder": "请输入文本",				// 非必填
		"description": "请输入英文、数字、下划线"
	};
	rule.textarea = {
		"required": false,
		"maxlength": 200,
		"minlength": 0
	};



	core.static = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title label">{label}</div>' +
				'<div class="item-input placeholder">{placeholder}</div>' +
			'</div>' +
		'</div>';
	opts.static = {
		"type": "static",						// 基本类型
		"label": "静态",
		"placeholder": "静态文字内容",
		"description": "--静态文字描述--"
	};
	rule.static = {
	};



	core.image = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title label">{label}</div>' +
				'<div class="item-input item-input-image">' +
					'<input type="hidden" name="{name}">' +
					'<div class="thumbnails-container">' +
					'</div>' +
					'<div class="thumbnails-description">{description}</div>'
				'</div>' +
			'</div>' +
		'</div>';
	sub.image = {};
	sub.image.item =
		'<div class="thumbnail">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<a class="openPhotoBrowser" href="javascript:void(0);">' +
				'<div class="image-container">' +
					'<img src="{url}" onerror="onerror=null; src=\'/assets/fw7/img/error.jpg\'"/>' +
				'</div>' +
			'</a>' +
		'</div>';
	sub.image.add =
		'<button type="button" class="button thumbnail add">' +
			'<i class="f7-icons">add</i>' +
		'</button>';
	sub.image.waiting =
		'<div class="thumbnail waiting">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<div class="preloader"></div>' +
		'</div>';
	opts.image = {
		"type": "image",
		"name": "demo_image",
		"label": "测试图片",
		"description": "请点击上传",
		"maxNumber": 5,
		"minNumber": 1
	};
	rule.image = {
	};



	core.audio = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title label">{label}</div>' +
				'<div class="item-input item-input-image">' +
					'<input type="hidden" name="{name}">' +
					'<div class="audioItems-container">' +
					'</div>' +
					'<div class="audioItems-description">{description}</div>'
				'</div>' +
			'</div>' +
		'</div>';
	sub.audio = {};
	sub.audio.item =
		/*'<div class="audioItem">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<a class="openPhotoBrowser" href="javascript:void(0);">' +
				'<div class="image-container">' +
					'<img src="{url}" onerror="onerror=null; src=\'/assets/fw7/img/error.jpg\'"/>' +
				'</div>' +
			'</a>' +
		'</div>';*/
		'<div class="audio-player audioItem">' +
			'<audio src="{url}" onerror="onerror=null; $(this)' +
					'.next().css(\'border-color\', \'red\')' +
					'.find(\'.decorate\').css(\'background\', \'transparent\').html(\'ERROR\');"></audio>' +
			'<div class="progress-bar">' +
				'<div class="played-part"></div>' +

				'<div class="decorate"></div>' +
			'</div>' +
			'<i class="ppBtn f7-icons">play_round</i>' +
			'<div class="time">00:00</div>' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
		'</div>';
	sub.audio.add =
		'<button type="button" class="button audioItem add">' +
			'<i class="f7-icons">mic</i>' +
		'</button>';
	sub.audio.waiting =
		/*'<div class="audioItem waiting">' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
			'<div class="preloader"></div>' +
		'</div>';*/
		'<div class="audio-player audioItem waiting">' +
			'<div class="progress-bar">' +
				'uploading ...' +
			'</div>' +
			'<div class="delete">' +
				'<i class="f7-icons">close</i>' +
			'</div>' +
		'</div>';
	opts.audio = {
		"type": "audio",
		"name": "demo_audio",
		"label": "测试录音",
		"description": "请点击上传",
		"maxNumber": 1,
		"minNumber": 1
	};
	rule.audio = {
	};



	core.multimedia = 
		'<div class="item-content">' +
			'<div class="item-inner">' +
				'<div class="item-title">' +
					'{label}' +
				'</div>' +
				'<div class="addon multimedia">' +
					'<i class="f7-icons size-smaller">add_round</i>' +
				'</div>' +
			'</div>' +
		'</div>';
}));
