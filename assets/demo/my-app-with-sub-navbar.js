
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



var serviceType = $$('#serviceType').val();
var formInsideId = $$('#formInsideId').val();
var groupId = $$('#groupId').val();
var workflowNumber = $$('#workflowNumber').val();
var hasValue = ($$('#hasValue').val() == 'true');
// TODO：微信分享
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
	// 增加提交按钮
	var submitBtnTemplate = 
			'<div class="list-block">' +
				'<ul>' +
					'<li>' +
						'<a href="#" class="item-link list-button form-submit">提交</a>' +
					'</li>' +
				'</ul>' +
			'</div>';

	$$('form#testForm').append(submitBtnTemplate);

	// 提交方法、暂存方法
	$$('.form-submit').on('click', function () {
		window.location = '/SaveOrSubmit';
	});

});
// 手动触发初始化（否则smart-select显示有问题)
myApp.init();


function saveOrSubmit(isSubmit) {
	var formData = myApp.formToData('#testForm');

	console.log('saveOrSubmit formData ->', formData);

	if (isSubmit) {
		// 校验
		var isValid = $('#testForm').validate();
		if (isValid) {
			// 提交（对应已办）
			$$.ajax({
				url: url_saveformData,
				type: (project == 'blade') ? 'get' : 'post',
				dataType: 'json',
				data: 'formValue=' + encodeURI(JSON.stringify(formData)) + '&workflowNumber=' + workflowNumber + '&isSubmit=1',
				success: function(result){
					// TODO
					myApp.alert('提交成功', '提示');
					$$('.popup-submit .group-ready').hide();
					$$('.popup-submit .group-done').show();
				},
				error: function(result) {
					// TODO
					myApp.alert('提交失败', '提示');
				},
				complete: function() {
					setTimeout(function () {
						myApp.hidePreloader();
					}, 5000);
				}
			});
		}
	} else {
		myApp.showPreloader('上传中...');
		// 仅保存（对应待办）
		$$.ajax({
			url: url_saveformData,
			type: (project == 'blade') ? 'get' : 'post',
			dataType: 'json',
			data: 'formValue=' + encodeURI(JSON.stringify(formData)) + '&workflowNumber=' +workflowNumber + '&isSubmit=0',
			success: function(result){
				myApp.alert('暂存成功', '提示');
			},
			error: function(result) {
				myApp.alert('暂存失败', '提示');
			},
			complete: function() {
				setTimeout(function () {
					myApp.hidePreloader();
				}, 5000);
			}
		});
	}
}

initPageBindEvent();


/*setTimeout(function() {
	preUploadCallback({formId: 'testForm', name: 'i1', groupId:  0, count: 3});
}, 4000);


 setTimeout(function() {
 	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 0, url: "http://192.168.8.125:9999/data/a.jpg"});
 }, 5000);
 setTimeout(function() {
 	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 1, url: "http://192.168.8.125:9999/data/b.png"});
 }, 5500);
setTimeout(function() {
	preUploadCallback({formId: 'testForm', name: 'rec2', groupId:  0});
}, 1000);
setTimeout(function() {

	uploadedCallback({formId: 'testForm', name: 'i1', groupId:  0, index: 2, url: "http://192.168.10.123:9999/data/you-cant-find-me.gif"});
}, 6000);*/
setTimeout(function() {
    uploadedCallback({formId: 'testForm', name: 'rec2', groupId:  0,  url: "http://192.168.8.125:9998/data/556_Butterfly_Kiss.mp3"});
}, 2000);


