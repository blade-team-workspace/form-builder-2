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

    var component_image = function(args) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'f7-icon': 'camera'
        };
        baseComponent.apply(this, arguments);	// 执行基类的初始化

        var that = this;

        this.template =
            '<div class="component">' +
            '<input type="hidden" name="{name}" />' +
            '<div class="thumbnails-container">' +
            '</div>' +
            '</div>';

        this.addTemplate =
            '<span class="button thumbnail add fake-file-btn " title="点击上传图片">' +
            '<i class="fa fa-picture-o"></i>' +
            '<input id="file_upload" class="ignore" type="file" multiple="true" ' +
            'accept="image/x-png, image/gif, image/jpeg, image/bmp">' +
            '</span>';

        this.thumbnailTemplate =
            '<div class="thumbnail">' +
            '<div class="image-container">' +
            '<img src="{url}" onerror="onerror=null;" onclick=""/>' +
            '</div>'+
            '</div>';

        this.waitingTemplate =
            '<div class="thumbnail waiting">' +
            '<div class="delete">' +
            '<i class="fa fa-minus"></i>' +
            '</div>' +
            '<div class="preloader"></div>' +
            '</div>';

        this.__render = function() {
            this.$node = $(this.template.format(this.opts));
        }

        this.__setValue = function(value) {
            console.log('image / this.__setValue(' + value + ')');
            this.$node.find('input').val(value);

            var urlList;
            if (value.match(/images:\[(.*)\]/) && value.match(/images:\[(.*)\]/).length > 0) {
                urlList = value.match(/images:\[(.*)\]/)[1].split(',');
            } else {
                urlList = [];
            }

            $.each(urlList, function(idx) {
                var $item = $(that.thumbnailTemplate.format({url: urlList[idx]}));
                that.$node.find('.thumbnails-container').append($item);
            });
            if(urlList.length == 0) {
                that.$node.attr('hidden',true);
            }

        }

        this.__transRead = function () {
            //暂时不管image的transRead方法
        }

    }

    $.formb.components.image = component_image;
}));