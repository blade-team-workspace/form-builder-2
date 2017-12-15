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

    const qiniu_domain = "olt0d7mfp.bkt.clouddn.com";
    const qiniu_token = "pBwzxNPBDAAD9cJaND2xh3TkgtTilQERWHSByAQ_:9CNVM9IegER_FjIbGKw3qcjTvIQ=:eyJzY29wZSI6ImJwbXRlc3QiLCJkZWFkbGluZSI6MTU0OTIxNTMxNX0=";

    var component_image = function(args) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'f7-icon': 'camera'
        };
        baseComponent.apply(this, arguments);	// 执行基类的初始化

        var that = this;

        this.template =
            '<div class="media-node">' +
            '<input type="hidden" name="{name}" />' +
            '<div class="thumbnails-container">' +
            '</div>' +
            '</div>';


        this.filestemplate =
            '<img id="preview" src="/3333.jpg" class="thumbnail" type="image" aria-hidden="true" onclick="">';



        this.addTemplate =
            '<span class="button thumbnail add fake-file-btn " title="点击上传图片">' +
            '<i class="fa fa-picture-o"></i>' +
            '<input id="file_upload" class="ignore" type="file" multiple="true" ' +
            'accept="image/x-png, image/gif, image/jpeg, image/bmp">' +
            '</span>';

        this.thumbnailTemplate =
            '<div class="thumbnail">' +
            '<div class="delete">' +
            '<i class="fa fa-minus"></i>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-xs-6 col-md-3">' +
            '<a href="#" class="thumbnail">' +
            '<img src="..." alt="...">' +
            '</a>' +
            '</div>' +

            '</div>';

            // '<a class="openPhotoBrowser" href="javascript:void(0);">' +
            // '<div class="image-container">' +
            // '<img src="{url}" onerror=null />' +
            // '</div>' +
            // '</a>' +
            // '</div>';

        this.waitingTemplate =
            '<div class="thumbnail waiting">' +
            '<div class="delete">' +
            '<i class="fa fa-minus"></i>' +
            '</div>' +
            '<div class="preloader"></div>' +
            '</div>';

        this.__render = function() {
            this.$node = $(this.template.format(this.opts));





            var imgNum = this.value;


            var $imageUrls = this.$node.find('input');
            var $container = this.$node.find('.thumbnails-container');


            // if (this.opts.readonly == true){//只读模式
                for (var i = 0;i<imgNum;i++){
                    $container.append(that.filestemplate);
                }

            // }else {
            //
            // }

            // var $name = this.$node.find('thumbnail');
            //
            // var $addBtn = $(this.addTemplate);



            /*

            this.$node.append($addBtn);
            $container.append($addBtn);
            // 给添加图片按钮绑定上传方法
            var $images = $addBtn.find('input[type=file]');

            $images.on('change', function() {


                var $file = $(this);
                var fileObj = $file[0];

                var windowURL = window.URL || window.webkitURL;
                var dataURL;
                var $img = $("#preview");


                if(fileObj && fileObj.files && fileObj.files[0]){
                    dataURL = windowURL.createObjectURL(fileObj.files[0]);
                    $img.attr('src',dataURL);
                    $addBtn.before(that.filestemplate);

                    // $img.attr('src',dataURL);

                }else{
                    dataURL = $file.val();
                    var imgObj = document.getElementById("preview");

                    imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                    imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

                }




                // $addBtn.before(that.filestemplate);

                // that.$node.find('');


0

                // if ($(this).val() == '') {
                //     return;
                // }
                // var formId = $(this).closest('form').attr('id');
                // var name = $(this).closest('.item-input-image').find('input[type=hidden]').attr('name');
                //
                // // 更新已存值
                // var imageData = {
                //     formId: formId,
                //     name: name
                // };
            })

*/




        }

        this.__setValue = function(value) {
            console.log('image / this.__setValue(' + value + ')');
            this.$node.find('input').val(value);
            this.$node.find('.showValue').html(value);

            // -----------------------------------------------------------

            var urlList;
            if (value.match(/images:\[(.*)\]/) && value.match(/images:\[(.*)\]/).length > 0) {
                urlList = value.match(/images:\[(.*)\]/)[1].split(',');
            } else {
                urlList = [];
            }

            console.log(urlList);

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
                //如果只读的时候，将delete删除
                if(that.opts.isRead){
                    $item.find('.delete').hide();
                }
            });


        }


    }



    $.formb.components.image = component_image;

}));