var device = Framework7.prototype.device;

// Initialize your app
var myApp = new Framework7({
    init: false     // 关闭自动初始化
});

// Export selectors engine
var $$ = Dom7;
var $ = $$;

var iosCss = 
    '<link class="ios-css" rel="stylesheet" href="assets/fw7/css/framework7.ios.min.css">' + 
    '<link class="ios-css" rel="stylesheet" href="assets/fw7/css/framework7.ios.colors.min.css">';
var androidCss = 
    '<link class="android-css" rel="stylesheet" href="assets/fw7/css/framework7.material.min.css">' +
    '<link class="android-css" rel="stylesheet" href="assets/fw7/css/framework7.material.colors.min.css">';

// change skin
if (device.android) {
    console.log('This is android');
    $$(androidCss).insertAfter($$('title'));
    $$('.ios-css').remove();
}

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
    domCache: true,         //enable inline pages
    swipePanel: 'left',
    animatePages: false
});

var jsonConf_index = {
    "items": [{
        "name": "s1111",
        "label": "下拉单选",
        "outerWidth": "12",
        "labelWidth": "3",
        "contentWidth": "9",
        "widthInSteam": "auto",
        "type": "select",
        "placeholder": "--请选择--",
        "description": "请点击选择",
        "dataUrl": "",
        "options": [{
            "label": "选项1",
            "value": "1"
        },
        {
            "label": "选项2",
            "value": "2"
        },
        {
            "label": "选项3",
            "value": "3"
        }]
    },
    {
        "name": "t1111",
        "label": "",
        "outerWidth": "12",
        "labelWidth": "3",
        "contentWidth": "9",
        "widthInSteam": "auto",
        "type": "text",
        "placeholder": "请输入文本",
        "description": "请输入英文、数字、下划线"
    }],
    "rules": {
        "s1111": {
            "required": true
        },
        "t1111": {
            "required": true,
            "maxlength": "10",
            "minlength": "5"
        }
    },
    "events": [{
        "eventType": "valueChangeShowHide",
        "trigger": "s1111",
        "valueResps": {
            "1": "t1111",
            "2": "",
            "3": ""
        }
    }, {
        "eventType": "valueChangeDisable",
        "trigger": "s1111",
        "valueResps": {
            "1": "t1111",
            "2": "",
            "3": ""
        }
    }],
    "values": {
        "s1111": "2",
        "t1111": "aaaa"
    },
    "isSteam": true,
    "isRead": false
};

// 定义首页初始化前执行代码
myApp.onPageBeforeInit('index', function (page) {
    $$('form#index').renderForm(jsonConf_index);
});

// 手动触发初始化（否则smart-select显示有问题)
myApp.init();

// 配置
var pageTemplate = 
    '<div class="page">' +
        '<div class="page-content">' +
            '<form id="{formId}">' +
            '</form>' +
        '</div>' +
    '</div>';

// 页面数据
var pageTitles = [
    {
        url: 'index',
        label: '班级信息'
    }, {
        url: 'student-1',
        label: '学生 - 1'
    }, {
        url: 'student-2',
        label: '学生 - 2'
    }];

// 表单数据
var jsonConfs = {
    'student-1':{
        "items": [
            {
                "name": "s1",
                "label": "下拉单选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "select",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                }, {
                    "label": "选项2",
                    "value": 2
                }, {
                    "label": "选项3",
                    "value": 3
                }]
            },
    {
        "name": "x",
        "label": "",
        "outerWidth": "12",
        "labelWidth": "3",
        "contentWidth": "9",
        "widthInSteam": "auto",
        "type": "static",
        "placeholder": "静态文字内容静态文字内容静态文字内容静态文字内容静态文字内容静态文字内容静态文字内容",
        "description": "--静态文字描述--"
    },
            {
                "name": "t1",
                "label": "文本框",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "text",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            }, {
                "name": "s2",
                "label": "下拉多选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "multiselect",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                },
                {
                    "label": "选项2",
                    "value": 2
                },
                {
                    "label": "选项3",
                    "value": 3
                }]
            }, {
                "name": "ta1",
                "label": "多行文本",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "textarea",
                "rows": 3,
                "resize": "none",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            }],
        "rules": {
            "s1": {
                "required": true
            },
            "t1": {
                "required": true,
                "maxlength": 10,
                "minlength": 5
            },
            "s2": {
                "required": true,
                "maxlength": 2
            },
            "ta1": {
                "required": true,
                "maxlength": 200,
                "minlength": 0
            }},
        "events": [
            {
                "eventType": "valueChangeDisable",
                "trigger": "s1",
                "valueResps": {
                    "1": "t1",
                    "2": "s2",
                    "3": "ta1"
                }
            }],
        "values": {
            "s1": "1",
            "t1": "测试文本",
            "s2": ["2", "3"],
            "ta1": "多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行多行"},
        "isSteam": false,
        "isRead": true},
    'student-2':{
        "items": [
            {
                "name": "s1",
                "label": "下拉单选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "select",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                }, {
                    "label": "选项2",
                    "value": 2
                }, {
                    "label": "选项3",
                    "value": 3
                }]
            }, {
                "name": "t1",
                "label": "文本框",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "text",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            }, {
                "name": "s2",
                "label": "下拉多选",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "multiselect",
                "placeholder": "请点击选择",
                "description": "请点击选择",
                "dataUrl": "",
                "options": [{
                    "label": "选项1",
                    "value": 1
                },
                {
                    "label": "选项2",
                    "value": 2
                },
                {
                    "label": "选项3",
                    "value": 3
                }]
            }, {
                "name": "ta1",
                "label": "多行文本",
                "outerWidth": 12,
                "labelWidth": 3,
                "contentWidth": 9,
                "widthInSteam": "auto",
                "type": "textarea",
                "rows": 3,
                "resize": "none",
                "placeholder": "请输入文本",
                "description": "请输入英文、数字、下划线"
            }],
        "rules": {
            "s1": {
                "required": true
            },
            "t1": {
                "required": true,
                "maxlength": 10,
                "minlength": 5
            },
            "s2": {
                "required": true,
                "maxlength": 2
            },
            "ta1": {
                "required": true,
                "maxlength": 200,
                "minlength": 0
            }},
        "events": [
            {
                "eventType": "valueChangeDisable",
                "trigger": "s1",
                "valueResps": {
                    "1": "t1",
                    "2": "s2",
                    "3": "ta1"
                }
            }],
        "values": {
            "s1": "3",
            "t1": "ccccccc",
            "s2": ["1", "3"],
            "ta1": ""},
        "isSteam": false,
        "isRead": false},
    };

// 当前页面的页码
var nowPageIndex = 0;

// 初始化页面和导航
$$.each(pageTitles, function(idx){
    var pt = pageTitles[idx];

    // 导航菜单初始化
    $$('.navList').append('<li class="item-content"><a class="item-inner close-panel" href="#' + pt.url + '">' + pt.label + '</a></li>');


    // page初始化
    var $page = $$(pageTemplate.format({formId: pt.url})).attr('data-page', pt.url)
            .attr('page-index', idx).addClass('cached');

    // TODO: 初始化页面详细过程
    if (idx != 0) {
        $$('.pages').append($page);

        // 渲染form主体
        $page.find('form').renderForm(jsonConfs[pt.url]);

        // 加form的标题
        $page.find('form').prepend('<div class="content-block-title">' + pt.label + '</div>');
    }

    // 翻页后事件回调绑定
    myApp.onPageAfterAnimation(pt.url, function(pageData) {
        // 更新当前页码
        nowPageIndex = parseInt($$(pageData.container).attr('page-index'));
        // 临时解决multiselect的placeholder初始化问题
        $$(pageData.container).find('select[multiple]').change();

        console.log('pageData:', pageData);

        addHistory(pt.url);
    });
});

function getFormData(formId) {
    if($$('form#' + formId).length == 1) {
        var formData = myApp.formToData('#' + formId);
        var allDisabled = $$('#' + formId).find(':disabled');

        // 手动删掉禁用的项
        $$.each(allDisabled, function(idx) {
            var disabledName = allDisabled[idx].name;
            if (disabledName in formData) {
                delete formData[disabledName];
            }
        });

        return formData;
    } else {
        return undefined;
    }
}


// 提交方法、暂存方法
$$('.all-form-submit, .all-form-save').on('click', function () {
    var submitMode = $$(event.target).hasClass('all-form-submit');
    var formDatas = {};
    $$.each(pageTitles, function(idx){
        var formId = pageTitles[idx].url;

        var formData = getFormData(formId);
        if(formData !== undefined) {
            formDatas[formId] = formData;
        }
    });

    myApp.alert(JSON.stringify(formDatas));

    if (submitMode) {
        // 提交（对应已办）
        $$.ajax({
            url: '${ctx}/form/saveformData',
            type: 'post',
            dataType: 'json',
            data: 'formValue=' + JSON.stringify(formDatas) + '&workflowNumber=' + $('[name=workflowNumber]').val(),
            success: function(result){
                myApp.alert('提交成功');
                $$('.popup-submit .group-ready').hide();
                $$('.popup-submit .group-done').show();
            },
            error: function(result) {
                myApp.alert('提交失败');
            }
        });
    } else {
        // 仅保存（对应待办）
        $$.ajax({
            url: '${ctx}/form/saveformData',
            type: 'post',
            dataType: 'json',
            data: 'formValue=' + JSON.stringify(formDatas) + '&workflowNumber=' + $('[name=workflowNumber]').val(),
            success: function(result){
                myApp.alert('暂存成功');
            },
            error: function(result) {
                myApp.alert('暂存失败');
            }
        });
    }
});

var historyList = [];
function addHistory(url) {
    historyList.push(url);
}
function backHisory() {
    return historyList.pop();
}
// 给安卓机械后退按键使用的方法
function androidBackBtn() {
    var backUrl = backHisory();
    if (backUrl) {
        mainView.router.back();
    } else {
        window.location = '/exit-web-view';
    }
}

// 翻页方法
function bindPagerBtn() {
    $$('.page-prev').on('click', function () {
        var prevIndex = nowPageIndex - 1;
        if (prevIndex < 0) {
            // prevIndex = pageTitles.length - 1;
            myApp.alert('到达首页', '提示');
        } else {
            mainView.router.load({pageName: pageTitles[prevIndex].url});
        }
    });
    $$('.page-next').on('click', function () {
        var foundMissing = false;
        // 提示必填项、校验
        var $form = $$('form#' + pageTitles[nowPageIndex].url);
        if ($form.length == 1) {
            var formId = $form.attr('id');
            // 当前form数据
            var formData = getFormData(formId);
            // 当前form所有必填name（去重用）
            var allRequiredNames = [];
            var allRequiredNode = $form.find(':required:enabled');
            $$.each(allRequiredNode, function(idx){
                var requiredName = allRequiredNode[idx].name;
                if (allRequiredNames.indexOf(requiredName) == -1) {
                    allRequiredNames.push(requiredName);
                    // 请求数据没在formdata中有 或者 formdata中对应数据是空的
                    if (!((requiredName in formData) && formData[requiredName] !== undefined && formData[requiredName].length != 0)) {
                        foundMissing = true;
                        var studentMissingLabel = $form.find('[name=' + requiredName + ']').closest('.listNode').children().data('opts').label;
                        var formTitle = pageTitles[nowPageIndex].label;
                        myApp.alert('请输入：' /*+ formTitle + '/'*/ + studentMissingLabel, '提示');
                    }
                }
            });
        }

        if (foundMissing) {
            return false;
        }

        var nextIndex = nowPageIndex + 1;
        if (nextIndex >= pageTitles.length) {
            // nextIndex = 0;
            // myApp.alert('到达末页', '提示');
            myApp.popup('.popup-submit');
        } else {
            mainView.router.load({pageName: pageTitles[nextIndex].url});
        }
    });    
}
bindPagerBtn();

// iOS退出webView的方法，安卓未测试
$$('.exit-web-view').on('click', function(){
    window.location = '/exit-web-view';
});
