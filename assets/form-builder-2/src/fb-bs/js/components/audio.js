/**
 * Created by wds on 2017/11/30.
 * 瞎写audio
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

    var component_audio = function(kargs) {
        baseComponent.apply(this, arguments);// 执行基类的初始化

        this.template =  '<audio src="{url}" controls="controls" id ="media" >您的浏览器不支持该功能</audio>';//url传进来的是json里面的MP3
        //controlsList="nodownload" oncontextmenu="return false"加入是为了隐藏下载按钮和屏蔽右键下载
        //或者用gayhub上的第三方audiojs
        var that = this ;

        this.__render = function () {

            that.$node = $(that.template.format(that.opts));//配参数

        };


    };

    $.formb.components.audio = component_audio;
}));