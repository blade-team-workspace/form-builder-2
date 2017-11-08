
var device = Framework7.prototype.device;


// 本地和bpm项目适配
var project = 'blade';

var url_getformvaluebyid;
var url_getbyid;
var url_saveformData;

if (project == 'bpmApp') {
	// bpmApp用
	url_getformvaluebyid = "/bpmapp/form/getformvaluebyid";
	url_getbyid = "/bpmapp/form/getbyid";
	url_saveformData = "/bpmapp/form/saveformData";
} else if (project == 'blade') {
	// blade用
	url_getformvaluebyid = "data/getformvaluebyid_4+1.json";
	url_getbyid = "data/getbyid_newFormat.json";
	url_saveformData = "data/saveformData.json";
}


// Initialize your app
var myApp = new Framework7({init: false});

// Export selectors engine
var $$ = Dom7;
var $ = $$;

//change skin
if (device.android) {
	console.log('This is android');
	$$('.ios-css').remove();
} else {
	console.log('This is NOT android');
	$$('.android-css').remove();
}

// Add view
var mainView = myApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true,
	domCache: true,	  //enable inline pages
	// swipePanel: 'left',
	animatePages: false
});


// 给安卓机械后退按键使用的方法
function customizedHistoryBack() {
	mainView.history.pop()
	var backUrl = mainView.history.pop();
	if (backUrl) {
		backUrl = backUrl.substring(1);
		mainView.router.load({pageName: backUrl, animatePages: true});
	} else {
		window.location = '/exit-web-view';
	}
}

// [图片、音频]预上传回调
function preUploadCallback(data) {
	$$('form#{formId} [name={name}]'.format(data)).closest('.media-node').data('preUpload')(data);
}

// [图片、音频]上传完毕回调
function uploadedCallback(data) {
	$$('form#{formId} [name={name}]'.format(data)).closest('.media-node').data('uploaded')(data);
}


var serviceType = $$('#serviceType').val();
var formInsideId = $$('#formInsideId').val();
var groupId = $$('#groupId').val();
var workflowNumber = $$('#workflowNumber').val();
var hasValue = ($$('#hasValue').val() == 'true');

var isRead = false;

// 加载表单和数据
myApp.showPreloader('加载中...');
var loadStudentFormError = false;
var jsonConf_index = "";
// 加载已填写过的首页数据
if (hasValue) {
	$$.ajax({
		url: url_getformvaluebyid,
		data: {
			'serviceType': serviceType,
			'formInsideId': formInsideId,
			'workflowNumber': workflowNumber,
			'formName': 'testForm'
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonConf_index = data; //strToJson(data);
		},
		error: function(result) {
			console.error('[ERROR] 加载班级表单数据失败！');
		},
		complete: function() {
			myApp.hidePreloader();
			if (loadStudentFormError) {
				myApp.alert('加载班级表单数据失败。请稍后重试', '提示');
			}
		}
	});
}
// 新建时首页的数据
else {
	$$.ajax({
		url: url_getbyid,
		data: {
			'serviceType': serviceType,
			'formInsideId': formInsideId
		},
		dataType: 'json',
		async: false,
		success: function(data) {
			jsonConf_index = data; //strToJson(data);
		},
		error: function(result) {
			console.error('[ERROR] 加载班级表单配置失败！');
		},
		complete: function() {
			myApp.hidePreloader();
			if (loadStudentFormError) {
				myApp.alert('加载班级表单配置失败。请稍后重试', '提示');
			}
		}
	});
}


//定义首页初始化前执行代码
myApp.onPageBeforeInit('mainPage', function (page) {
	if (loadStudentFormError) {
		$$('form#testForm>div.content-block-title').html('加载失败');
	} else {
		$$('form#testForm>div.content-block-title').remove();
	}
	// 使用form-builder渲染表单
	if (project == 'bpmApp') {
		// bpmApp用
		$$('form#testForm').renderForm(jsonConf_index);
	} else if (project == 'blade') {
		// blade用
		$$('form#testForm').renderForm(jsonConf_index);
	}
});
// 手动触发初始化（否则smart-select显示有问题)
myApp.init();


/**
 * 文本编辑的实现方法
 *     使用$obj.editText(initValue, $nodeToReplace)
 *     this:           $obj[0]
 *     initValue:      初始的文本框中的值，修改模式使用
 *     $nodeToReplace: 修改完毕后替换的对象，修改模式使用
 */
/*$.fn.editText = function(initValue, $nodeToReplace) {
	myApp.closeModal();

	var $source = this;
	// TODO: 获取opt
	var opt = $source.data('opt');
	opt = {
		title: '作业批改'
	};
	var popupTemplate =
			'<div class="popup textarea-popup">'+
				'<div class="navbar">' +
					'<div class="navbar-inner">' +
						'<div class="left">' +
							'<a href="#" class="close-popup">' +
								'<span>' +
									'<div class="navbar-btn nbg">取消</div>' +
								'</span>' +
							'</a>' +
						'</div>' +
						'<div class="center sliding lessonTitle">{title}</div>' +
						'<div class="right submitBtn disabled">' +
							'<a href="#" class="link close-popup textarea-popup-submit">' +
								'<span>' +
									'<div class="navbar-btn">完成</div>' +
								'</span>' +
							'</a>' +
						'</div>' +
					'</div>' +
				'</div>' +
				
				'<div class="page-content">' +
					'<div class="list-block">' +
						'<ul>' +
							'<li class="align-top">' +
								'<div class="item-content">' +
									'<div class="item-inner">' +
										'<div class="item-input">' +
											'<textarea id="textEdit"></textarea>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</li>' +
						'</ul>' +
					'</div>' +
				'</div>' +
			'</div>';

	myApp.popup(popupTemplate.format(opt));

	// 联动事件绑定
	$('#textEdit').on('input', function(e) {
		console.log('input');
		if ($(e.target).val().trim().length > 0) {
			$(e.target).closest('.textarea-popup').find('.submitBtn').removeClass('disabled');
		} else {
			$(e.target).closest('.textarea-popup').find('.submitBtn').addClass('disabled');
		}
	});

	if (initValue !== undefined) {
		$('#textEdit').val(initValue);
	}

	// 提交事件绑定
	$('.textarea-popup-submit').on('click', function() {
		var value = $('#textEdit').val();
		var textViewTemplate = 
				'<li class="swipeout">' +
					'<div class="swipeout-content item-content">' +
						'<div class="item-inner">' +
							'<div class="item-after textValue">' +
								'{value}' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="swipeout-actions-right">' +
						'<a href="#" class="edit-text bg-lightblue">Edit</a>' +
						'<a href="#" class="swipeout-delete">Delete</a>' +
					'</div>' +
				'</li>';
		var $viewNode = $(textViewTemplate.format({value: value}));

		$viewNode.find('.edit-text').on('click', function(e) {
			console.log('edit text');
			$source.editText($viewNode.find('.textValue').html().trim() || undefined, $(e.target).closest('li.swipeout'));
		});


		if ($nodeToReplace === undefined) {
			$viewNode.insertAfter($source.find('ul li:last-child'));
		} else {
			$viewNode.insertAfter($nodeToReplace);
			$nodeToReplace.remove();
		}
		console.log('Submit');
	});
}*/



// 编辑图片的事件
/*$('body').on('click', '.addon-images', function(e) {
	myApp.closeModal();

	var $source = $(e.target).closest('.addon-popover').data('$source');
	$source.editImages();
});

$.fn.editText = function(initValue, $nodeToReplace) {
	myApp.closeModal();

	var $source = this;
	// TODO: 获取opt
	var opt = $source.data('opt');
	opt = {
		title: '作业批改'
	};
	
}*/

/*$(document).on('page:afteranimation', function(e) {
	console.log('page:afteranimation');
	var page = e.detail.page;
	console.log('page:', page);
	if (page.name == 'testForm' && page.fromPage.name == 'dynamic-page') {
		$('[data-page=dynamic-page]').remove();
	}
})*/


// 自制播放器-播放/暂停事件绑定
$('.audio-player i.ppBtn').on('click', function(e) {
	var $audio = $(e.target).closest('.audio-player').find('audio');
	var $this = $(e.target);
	if ($this.html() == 'play_round') {
		$audio[0].play();
		$this.html('pause_round');
	} else {
		$audio[0].pause();
		$this.html('play_round');
	}
});
// 自制播放器-播放进度条-开始拖拽
$('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchstart', function(e) {
	var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
	var $playedPart = $processBar.find('.played-part');
	var $audio = $(e.target).closest('.audio-player').find('audio');
	var $time = $(e.target).closest('.audio-player').find('.time');
	var leftX = $processBar.offset().left + $processBar.parent().offset().left + 16;
	var barWidth = $processBar.width();
	var per = 0;
	// 去掉更新进度条的事件绑定
	$audio.off('timeupdate');
	$(document).on('touchmove', function(e) {
		per = (((e.touches[0].clientX - leftX) / barWidth) * 100).toFixed(2);
		if (per < 0) {
			per = 0;
		} else if (per > 100) {
			per = 100;
		}
		// 更新已播放的进度条长度
		$playedPart.css('width', per + '%');
		// 更新剩余时间
		var leftSeconds = parseInt($audio[0].duration * (1 - per / 100));
		$time.html(__formatTime(leftSeconds));
	});
});
// 自制播放器-播放进度条-释放
$('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchend', function(e) {
	console.log('touch-end');
	$(document).off('touchmove');
	var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
	var $playedPart = $processBar.find('.played-part');
	var $ppBtn = $(e.target).closest('.audio-player').find('.ppBtn');
	var endPer = ($playedPart.width() / $processBar.width() * 100).toFixed(2);
	// console.log('end at', endPer + '%');
	// 跳转到指定位置播放
	var $audio = $(e.target).closest('.audio-player').find('audio');
	$audio[0].currentTime = $audio[0].duration * 0.01 * endPer;
	// 绑定更新事件
	$audio.on('timeupdate', __audioTimeUpdateCallback);
	$audio[0].play();
	$ppBtn.html('pause_round');
});
// 自制播放器-更新进度条和剩余时间
$('.audio-player audio').on('timeupdate', __audioTimeUpdateCallback);
// 更新时间的回调
function __audioTimeUpdateCallback(e) {
	var $this = $(e.target);
	var scales = $this[0].currentTime / $this[0].duration;
	var leftSeconds = parseInt($this[0].duration - $this[0].currentTime);
	var persentNum = (scales * 100).toFixed(2);
	var $bar = $this.parent().find('.played-part');
	var $time = $this.parent().find('.time');
	
	// 更新已播放的进度条长度
	$bar.css('width',  persentNum + '%');
	// 更新剩余时间
	$time.html(__formatTime(leftSeconds));
}
// 秒数转“分:秒”
function __formatTime(second) {
	return [/*parseInt(second / 60 / 60), */parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
		.replace(/\b(\d)\b/g, "0$1");
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

function GetQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return r[2]; return null;
}

function initPageBindEvent() {
	// 退出webView的方法
	$$('.exit-web-view').on('click', customizedHistoryBack);

	// 微信分享方法
	$$('.share-btn').on('click', function(){
		var data = {
			link: location.pathname + location.search + '&isShared=1',
			teacherName: $$('.teacherName').html(),
			lessonNo: $$('.lessonNo').html(),
			lessonTitle: $$('.lessonTitle').html()
		};
		var urlParam = $$.param(data);
		var url = "/share-url?" + urlParam;
		
		window.location = url;
	});

	var myPhotoBrowser = undefined;

	// 查看已上传图片的方法
	$$('body').on('click', '.openPhotoBrowser', function(e) {
		var nowUrl = e.target.getAttribute('src');
		var urlList = $$(e.target).closest('.item-content').find('input').val().match(/images:\[(.*)\]/)[1].split(',');
		var nowIndex = urlList.indexOf(nowUrl);

		myPhotoBrowser = myApp.photoBrowser({
			photos: urlList,
			onOpen: function(photobrowser) {
				console.log('opened', photobrowser);
				$$('.photo-browser').find('i.icon').addClass('color-white').addClass('icon-white');
			}
		});

		// 加载失败的图片不响应打开相册操作
		if (nowIndex != -1) {
			myPhotoBrowser.open(nowIndex); // open photo browser
		}
	});
}

initPageBindEvent();

/*setTimeout(function() {
	preUploadCallback({formId: 'testForm', name: 'i1', groupId:  0, count: 3});
}, 4000);

setTimeout(function() {
	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 0, url: "http://192.168.10.123:9999/data/a.jpg"});
}, 5000);
setTimeout(function() {
	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 1, url: "http://192.168.10.123:9999/data/b.png"});
}, 5500);
setTimeout(function() {
	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 2, url: "http://192.168.10.123:9999/data/you-cant-find-me.gif"});
}, 6000);*/

