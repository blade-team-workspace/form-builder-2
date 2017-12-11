/**
 * Created by wds on 2017/12/5.
 * 瞎写打开电脑文件夹的功能
 */
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

    var component_button_audio = function(kargs) {

        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: 'pickfiles',         // 上传选择的点选按钮，必需
            // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
            // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
            // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
             uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
             uptoken_url: '/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
             uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
                // do something
                return uptoken;
             },
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
             downtoken_url: '/downtoken',
            // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
             unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
             save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
            domain: '<Your bucket domain>',     // bucket域名，下载资源时用到，必需
            container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
            max_file_size: '100mb',             // 最大文件体积限制
            flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
            max_retries: 3,                     // 上传失败最大重试次数`
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'container',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                  // 分块上传时，每块的体积
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            //x_vars : {
            ////    查看自定义变量
            //    'time' : function(up,file) {
            //        var time = (new Date()).getTime();
            // do something with 'time'
            //        return time;
            //    },
            //    'size' : function(up,file) {
            //        var size = file.size;
            // do something with 'size'
            //        return size;
            //    }
            //},
            init: {
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                        // 文件添加进队列后，处理相关的事情
                    });
                },
                'BeforeUpload': function(up, file) {
                    // 每个文件上传前，处理相关的事情
                },
                'UploadProgress': function(up, file) {
                    // 每个文件上传时，处理相关的事情
                    //获取上传进度
                    var percent = file.percent;
                    //上传提示
                    $("#uploadBanner").text("已经上传" + percent + "%");
                },
                'FileUploaded': function(up, file, info) {
                    // 每个文件上传成功后，处理相关的事情
                    // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                    // 查看简单反馈
                     var domain = up.getOption('domain');
                     var res = parseJSON(info.response);
                    var url = domain + obj.key;
                    $("#banner").val(obj.key);
                    $("#uploadBanner").text("重新上传");
                    $("#bannerBackShow").attr("src",url);
                    var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url
                },
                'Error': function(up, err, errTip) {
                    //上传出错时，处理相关的事情
                    alert(errTip);
                },
                'UploadComplete': function() {
                    //队列文件处理完毕后，处理相关的事情
                },
                'Key': function(up, file) {
                    // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                    // 该配置必须要在 unique_names: false , save_key: false 时才生效
                    //key就是上传的文件路径
                    var key = "";
                    //获取年月日时分秒
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                    var second = date.getSeconds();
                    key += '/gcrcsUploadFile/' + year+'/'+month+'/'+day+'/'+hour+minute+second +'/';
                    console.log(file.name);
                    key += file.name;
                    return key ;
                }
            }
        });
        // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
        // uploader为一个plupload对象，继承了所有plupload的方法

        baseComponent.apply(this, arguments);// 执行基类的初始化

        this.template =  '<button onclick="selectAudio()" id ="pickfiles">点击选择音频文件</button>'

        var that = this ;

        this.__render = function () {

            that.$node = $(that.template.format(that.opts));//配参数


        };


    };
    function selectAudio()
    {
        //try {
        //    var Message = "请选择文件夹"; //选择框提示信息
        //    var Shell = new ActiveXObject("Shell.Application");
        //    var Folder = Shell.BrowseForFolder(0, Message, 0x0040, 0x11);//起始目录为我的电脑
        //    //var Folder = Shell.BrowseForFolder(0,Message,0); //起始目录为桌面
        //    if (Folder != null) {
        //        Folder = Folder.items(); // 返回 FolderItems 对象
        //        Folder = Folder.item(); // 返回 Folderitem 对象
        //        Folder = Folder.Path;  // 返回路径
        //        if (Folder.charAt(Folder.length - 1) != "\\") {
        //            Folder = Folder + "\\";
        //        }
        //        return Folder;
        //    } else {
        //        Folder = "";
        //        return Folder;
        //    }
        //} catch (e) {
        //    alert(e.message);
        //}
        alert("有机会一起睡觉");
    }
    $.formb.components.button_audio = component_button_audio;
}));