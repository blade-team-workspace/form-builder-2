/*
写在本层的是在运行my-app.js之前运行的
*/

// 机械后退按键使用的方法
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

// 从urlParam获取指定name的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return r[2]; return null;
}

/*
这个方法是在my-app.js运行完毕之后，在内部调用的
*/
function initPageBindEvent() {
	// 退出webView的方法
	$$('.exit-web-view').on('click', function(){
		window.location = '/exit-web-view';
	});

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
            backLinkText: "关闭",
            ofText: '/',
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