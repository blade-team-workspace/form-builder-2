var device = Framework7.prototype.device;

var project = 'blade';

var url_studentList;
var url_getformvaluebyid;
var url_getbyid;
var url_saveformData;

if (project == 'bpmApp') {
    // bpmApp用
    url_studentList = url+"/form/studentList";
    url_getformvaluebyid = url+"/form/getformvaluebyid";
    url_getbyid = url+"/form/getbyid";
    url_saveformData = url+"/form/saveformData";
} else if (project == 'blade') {
    // blade用
    url_studentList = "data/studentList.json";
    url_getformvaluebyid = "data/getformvaluebyid.json";
    url_getbyid = "data/getbyid2.json";
    url_saveformData = "data/saveformData.json";
}

// Initialize your app
var myApp = new Framework7({
    init: false,  // 关闭自动初始化
    modalTitle: '',
    smartSelectItemTemplate: '{{#if isLabel}}' +
    '<li class="item-divider">{{groupLabel}}</li>' +
    '{{else}}' +
    '<li{{#if className}} class="{{className}}"{{/if}}>' +
    '<label class="label-{{inputType}} item-content">' +
    '<input type="{{inputType}}" name="{{inputName}}" value="{{value}}" {{#if selected}}checked{{/if}}>' +
    '{{#if material}}' +
    '{{#if hasMedia}}' +
    '<div class="item-media">' +
    '{{#if icon}}<i class="icon {{icon}}"></i>{{/if}}' +
    '{{#if image}}<img src="{{image}}">{{/if}}' +
    '</div>' +
    '<div class="item-inner">' +
    '<div class="item-title-multi{{#if color}} color-{{color}}{{/if}}">{{text}}</div>' +
    '</div>' +
    '<div class="item-after">' +
    '<i class="icon icon-form-{{inputType}}"></i>' +
    '</div>' +
    '{{else}}' +
    '<div class="item-media">' +
    '<i class="icon icon-form-{{inputType}}"></i>' +
    '</div>' +
    '<div class="item-inner">' +
    '<div class="item-title-multi{{#if color}} color-{{color}}{{/if}}">{{text}}</div>' +
    '</div>' +
    '{{/if}}' +
    '{{else}}' +
    '{{#if hasMedia}}' +
    '<div class="item-media">' +
    '{{#if checkbox}}<i class="icon icon-form-checkbox"></i>{{/if}}' +
    '{{#if icon}}<i class="icon {{icon}}"></i>{{/if}}' +
    '{{#if image}}<img src="{{image}}">{{/if}}' +
    '</div>' +
    '{{/if}}' +
    '<div class="item-inner">' +
    '<div class="item-title-multi{{#if color}} color-{{color}}{{/if}}">{{text}}</div>' +
    '</div>' +
    '{{/if}}' +
    '</label>' +
    '</li>' +
    '{{/if}}'

});

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
    domCache: true,   //enable inline pages
    // swipePanel: 'left',
    animatePages: false
});

var serviceType = $$('#serviceType').val();
var formInsideId = $$('#formInsideId').val();
var groupId = $$('#groupId').val();
var workflowNumber = $$('#workflowNumber').val();
var hasValue = ($$('#hasValue').val() == 'true');
var isRead = false;
var isShared = !!getQueryString('isShared');

// 页面数据
var pageTitles = [
    {
        url: 'testForm',
        label: '班级信息'
    }];

myApp.showPreloader('加载学生列表中...');
var loadStudentListError = false;
$$.ajax({
    url: url_studentList,
    data: {'workflowNumber': workflowNumber},
    timeout : 15*1000, //超时时间设置，单位毫秒
    async: false,
    dataType: 'json',
    success: function(data) {
        pageTitles.add(data);
    },
    error: function(result) {
        loadStudentListError = true;
        console.error('[ERROR] 加载学生列表失败！');
    },
    complete: function(XMLHttpRequest,status) {
        myApp.hidePreloader();
        if(status=='timeout') {
            alertTimeOut(myApp,'加载超时');
        }
        if (loadStudentListError) {
            alertTimeOut(myApp,'加载班级表单数据失败。请稍后重试');
        }
    }
});

myApp.showPreloader('加载班级信息中...');
var loadClassInfoError = false;
var jsonConf_index = "";
// 加载已填写过的首页数据
if (hasValue) {
    $$.ajax({
        url: url_getformvaluebyid,
        timeout : 15*1000, //超时时间设置，单位毫秒
        data: {
            'serviceType': serviceType,
            'formInsideId': formInsideId,
            'workflowNumber': workflowNumber,
            'formName': 'testForm'
        },
        dataType: 'json',
        async: false,
        success: function(data) {
//            jsonConf_index = strToJson(data);
            jsonConf_index = data;
        },
        error: function(result) {
            console.error('[ERROR] 加载班级表单数据失败！');
        },
        complete: function(XMLHttpRequest,status) {
            myApp.hidePreloader();
            if(status=='timeout') {
                alertTimeOut(myApp,'加载超时');
            }
            if (loadClassInfoError) {
                alertTimeOut(myApp,'加载班级表单数据失败。请稍后重试');
            }
        }
    });
}
// 新建时首页的数据
else {
    $$.ajax({
        url: url_getbyid,
        timeout : 15*1000, //超时时间设置，单位毫秒
        data: {
            'serviceType': serviceType,
            'formInsideId': formInsideId
        },
        dataType: 'json',
        async: false,
        success: function(data) {
            jsonConf_index = data;
//            jsonConf_index = strToJson(data);
        },
        error: function(result) {
            console.error('[ERROR] 加载班级表单配置失败！');
        },
        complete: function(XMLHttpRequest,status) {
            myApp.hidePreloader();
            if(status=='timeout') {
                alertTimeOut(myApp,'加载超时');
            }
            if (loadClassInfoError) {
                myApp.alert('加载班级表单配置失败。请稍后重试', '提示');
            }
        }
    });
}

//定义首页初始化前执行代码
myApp.onPageBeforeInit('testForm', function (page) {
    if (loadStudentListError || loadClassInfoError) {
        $$('form#testForm>div.content-block-title').html('加载失败');
    } else {
        $$('form#testForm>div.content-block-title').remove();
    }

    if (project == 'bpmApp') {
        // bpmApp用
        $$('form#testForm').renderForm(jsonConf_index);
    } else if (project == 'blade') {
        // blade用
        $$('form#testForm').renderForm(jsonConf_index['testForm']);
    }

    if(formInsideId == '26') {
        $$('form#testForm').find('[name=comments]').on('change', function(){
            if ($$(this).val()) {
                $$('#groupId').val($$(this).val());

                // 重新渲染后边的page
                initStudentsFormsAndPages();
            } else {
                myApp.hidePreloader();
            }
        });
        if (!jsonConf_index.isRead) {
            $$('form#testForm').find('[name=comments]').trigger('change');
        }
    }
    if (jsonConf_index.isRead) {
        isRead = true;
        // 隐藏上传按钮
        $$('.save-bar').hide();
        // 显示分享按钮
        $$('.share-btn').show();
        $$('#groupId').val(jsonConf_index.values['comments']);
        // 重新渲染后边的page
        initStudentsFormsAndPages();
    }
    if (isShared) {
        // 隐藏分享按钮
        $$('.share-btn').hide();
        //
        $$('.top-toolbar').hide();
        $$('.page-content').css('padding-top','initial');
        // 隐藏退出按钮
        $$('.exit-web-view').hide();
    }
    // 显示翻页按钮
    $$('.page-prev, .page-next').show();
});

// 手动触发初始化（否则smart-select显示有问题)
myApp.init();

$$('.view.view-main').off('touchstart');

// 配置
var pageTemplate =
    '<div class="page">' +
    '<div class="page-content">' +
    '<form id="{formId}">' +
    '</form>' +
    '</div>' +
    '</div>';

function strToJson(str){
    if (project == 'bpmApp') {
        // bpmApp用
        var json = eval('(' + str + ')');
        return json;
    } else if (project == 'blade') {
        // blade用
        return str;
    }
}

// 初始化导航栏
$$.each(pageTitles, function(idx) {
    var pt = pageTitles[idx];

    // 导航菜单初始化
    $$('.navList').append('<li class="item-content"><a class="item-inner close-panel" href="#' + pt.url + '__">' + pt.label + '</a></li>');
});

// 导航菜单加校验
$$('.navList a').on('click', function(){
    var href = $$(this).attr('href');
    if (!$('#{formId}'.format({formId:pageTitles[nowPageIndex].url})).validate()) {
        return false;
    } else {
        mainView.router.load({pageName: href.substring(1,href.length - 2)});
    }
});

// 当前页面的页码
var nowPageIndex = 0;

// 初始化学生表单和页面
function initStudentsFormsAndPages(){
    if ($$('.modal-overlay').length != 0) {
        myApp.hidePreloader();
    }
    myApp.showPreloader('加载学生表单中...');
    // 表单数据
    var jsonConfs = undefined;
    var groupId = $$('#groupId').val();

    // 编辑和只读模板数据
    if (hasValue) {
        jsonConfs = {};
        var completeCounts = 0;
        var loadError = [];
        for (var i = 0; i < pageTitles.length; i++) {
            (function(_i) {
                $$.ajax({
                    url: url_getformvaluebyid,
                    data: {
                        'serviceType': serviceType,
                        'formInsideId': groupId,
                        'workflowNumber': workflowNumber,
                        'formName': pageTitles[_i].url
                    },
                    dataType: 'json',
                    success: function (data) {
                        jsonConfs[pageTitles[_i].url] = data;
//                        jsonConfs[pageTitles[_i].url] = strToJson(data);
                        reRenderPage(_i, jsonConfs[pageTitles[_i].url]);
                    },
                    error: function (result) {
                        loadError.push(pageTitles[_i].label);
                        console.error('[ERROR] 加载学生表单数据失败！表单名：' + pageTitles[_i].label);
                        alertTimeOut(myApp,'[ERROR] 加载学生表单数据失败！表单名：' + pageTitles[_i].label);
                    },
                    complete: function(xhr, status) {
                        completeCounts += 1;
                        if (completeCounts == pageTitles.length - 1) {
                            myApp.hidePreloader();
                            if(status=='timeout') {
                                alertTimeOut(myApp,'加载超时');
                            }
                            if (loadError.length != 0) {
                                // myApp.alert('加载[' + loadError.join(', ') + ']表数据失败。请稍后重试', '提示');
                                alertTimeOut(myApp,'加载[' + loadError.join(', ') + ']表数据失败。请稍后重试');
                            }
                        }
                    }
                });
            })(i);
        }
    }
    // 新建时的模板数据
    else {
        var foundError = false;
        $$.ajax({
            url: url_getbyid,
            data: {
                'serviceType': serviceType,
                'formInsideId': groupId
            },
            dataType: 'json',
            async: false,
            success: function(data) {
                jsonConfs = data;
//                jsonConfs = strToJson(data);
                // 初始化页面和导航
                $$.each(pageTitles, function(idx){
                    if (project == 'bpmApp') {
                        // bpmApp用
                        reRenderPage(idx, jsonConfs);
                    } else if (project == 'blade') {
                        // blade用
                        reRenderPage(idx, jsonConfs['student_1']);
                    }
                });
            },
            error: function(result) {
                foundError = true;
                console.error('[ERROR] 加载学生表单配置失败！');
            },
            complete: function() {
                myApp.hidePreloader();
                if (foundError) {
                    myApp.alert('加载学生表单失败。请稍后重试', '提示');
                }
            }
        });
    }
}
if(formInsideId != '26') {
    initStudentsFormsAndPages();
}

// 重新渲染指定page的方法
function reRenderPage(idx, jsonConf) {
    var pt = pageTitles[idx];
    // 除首页外
    if (idx != 0) {
        // 干掉已经渲染过得page
        $$('[data-page=' + pt.url + ']').remove();

        // page初始化
        var $page = $$(pageTemplate.format({formId: pt.url})).attr('data-page', pt.url)
            .attr('page-index', idx).addClass('cached');

        $$('.pagesContainer').append($page);

        // 渲染form主体
        $page.find('form').renderForm(jsonConf);

        // 加form的标题
        $page.find('form').prepend('<div class="content-block-title">' + pt.label + '</div>');
    }

    // 翻页后事件回调绑定
    myApp.onPageAfterAnimation(pt.url, function(pageData) {
        // 更新当前页码
        nowPageIndex = parseInt($$(pageData.container).attr('page-index'));
        // 临时解决multiselect的placeholder初始化问题
        $$(pageData.container).find('select[multiple]').change();

        // 显示翻页按钮
        $$('.page-prev, .page-next').show();
    });
}

function saveOrSubmit(isSubmit) {
//    var formData = myApp.formToData('#testForm');

    var formDatas = {};
    $$.each(pageTitles, function(idx){
        var formId = pageTitles[idx].url;

        var formData = getFormData(formId);
        if(formData !== undefined) {
            formDatas[formId] = formData;
        }
    });
    console.log('saveOrSubmit formData ->', formDatas);

    if (isSubmit) {
        // 校验
        var isValid = true;
        $$.each(pageTitles, function(idx){
            var formId = pageTitles[idx].url;
            if($$('form#' + formId).length == 1) {
                isValid = $$('form#' + formId).validate();
            }
            if (!isValid) {return;}
        });
        if (isValid) {
            myApp.showPreloader('提交中...');
            // 提交（对应已办）
            $$.ajax({
                url: url_saveformData,
                type: (project == 'blade') ? 'get' : 'post',
                dataType: 'json',
                data: 'formValue=' + encodeURI(JSON.stringify(formDatas)) + '&workflowNumber=' + workflowNumber + '&isSubmit=1',
                success: function(result){
                    // TODO
//                    myApp.alert('提交成功', '提示');
                    myApp.alert('提交成功', '提示',function(){
                        window.location = "submit-success";
                    });
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
            data: 'formValue=' + encodeURI(JSON.stringify(formDatas)) + '&workflowNumber=' +workflowNumber + '&isSubmit=0',
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

// 翻页方法
function bindPagerBtn() {
    $$('.page-prev').on('click', function () {
        $$('.page-prev').hide();
        var prevIndex = nowPageIndex - 1;
        if (prevIndex < 0) {
            // prevIndex = pageTitles.length - 1;
            $$('.page-prev').show();
            myApp.alert('到达首页', '提示');
        } else {
            mainView.router.load({pageName: pageTitles[prevIndex].url});
        }
        return false;
    });
    $$('.page-next').on('click', function () {
        $$('.page-next').hide();

        if (!$('#{formId}'.format({formId:pageTitles[nowPageIndex].url})).validate()) {
            $$('.page-next').show();
            return false;
        }

        var nextIndex = nowPageIndex + 1;
        if (nextIndex >= pageTitles.length) {
            $$('.page-next').show();
            if (isRead) {
                myApp.alert('到达末页', '提示');
            } else {
//                myApp.popup('.popup-submit');
                window.location = '/SaveOrSubmit';
            }
        } else {
            mainView.router.load({pageName: pageTitles[nextIndex].url});
        }
        return false;
    });
    $$('.save-bar').on('click', function () {
        window.location = '/SaveOrSubmit';
        return false;
    });
}
bindPagerBtn();

initPageBindEvent();

function getFormData(formId) {
    if($$('form#' + formId).length == 1) {
        var formData = myApp.formToData('#' + formId);
        return formData;
    } else {
        return undefined;
    }
}
