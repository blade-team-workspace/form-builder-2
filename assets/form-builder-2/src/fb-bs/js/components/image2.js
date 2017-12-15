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

    var component_image = function(kargs) {
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

        this.addTemplate =
            '<span class="button thumbnail add fake-file-btn" title="点击上传图片">' +
            '<i class="fa fa-picture-o"></i>' +
            '<input class="ignore" type="file" multiple="true" ' +
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

        '<a class="openPhotoBrowser" href="javascript:void(0);">' +
        '<div class="image-container">' +
        '<img src="{url}" onerror=null />' +
        '</div>' +
        '</a>' +
        '</div>';

        //style=\'background: url(../../img/error.jpg) 0% 0% / 100% 100% no-repeat #000;\'
        this.waitingTemplate =
            '<div class="thumbnail waiting">' +
            '<div class="delete">' +
            '<i class="fa fa-minus"></i>' +
            '</div>' +
            '<div class="preloader"></div>' +
            '</div>';

        this.__render = function() {
            this.$node = $(this.template.format(this.opts));

            var $imageUrls = this.$node.find('input');
            var $container = this.$node.find('.thumbnails-container');

            var $addBtn = $(this.addTemplate);
            $container.append($addBtn);





            // 给添加图片按钮绑定上传方法
            var $files = $addBtn.find('input[type=file]');

            $files.on('change', function() {
                if ($(this).val() == '') {
                    return;
                }
                var formId = $(this).closest('form').attr('id');
                var name = $(this).closest('.item-input-image').find('input[type=hidden]').attr('name');

                // 更新已存值
                var imageData = {
                    formId: formId,
                    name: name
                };





                var groupId = $addBtn.data('groupId') || 0;
                // 定义表单变量
                var files = $(this)[0].files;
                // 新建一个FormData对象
                var formData = new FormData();
                // 追加文件数据
                for (var i = 0; i < files.length; i++) {
                    formData.append("file[" + i + "]", files[i]);

                }
                formData.append("groupId", groupId);
                // formData.append("file", files[0]);

                // 计算现在可上传文件的个数
                var nowCount = $addBtn.closest('.thumbnails-container').find('.thumbnail:not(.add)').length;
                var maxNow = that.opts.maxNumber - nowCount;
                var maxImageNum = that.opts["maxNumber"];

                // var maxNow = that.opts["maxNumber"];




                // 判断符合条件，立刻上传
                if (files.length <= maxNow && files.length >= that.opts.minNumber) {

                    // 放置占位图
                    $.each(files, function(idx) {
                        var $waiting = $(that.waitingTemplate);

                        // 绑定删除上传中的方法
                        _bindDelete($waiting);

                        $waiting.addClass('groupId_' + groupId);
                        $addBtn.before($waiting)
                    });


                    var aaa = $(".thumbnails-container");


                    // 上传
                    $.ajax({
                        // type: 'POST',
                        url: "data/multipleUploadReturn.json",
                        timeout: 30 * 1000,
                        data: formData,
                        processData: false,
                        contentType: false,
                        dataType: "json",
                        success: function(r) {
                            var $addBtn = $('form#{formId} input[name={name}]'.format(imageData)).closest('.item-input-image').find('.thumbnail.add');
                            var $node = $addBtn.closest('.drag_item');

                            $.each(r.urls, function(idx) {
                                var url = r.urls[idx];
                                var $item = $(sub.image.item.format({url: url}));

                                // 绑定删除的方法
                                _bindDelete($item);

                                $addBtn.before($item);
                            });

                            // 删掉占位图
                            var placeholders = $addBtn.closest('.thumbnails-container').find('.groupId_' + groupId);
                            if (placeholders.length > 0) {
                                placeholders.remove();
                            }

                            // 判断总thumbnail数量是否超过了max，超过就隐藏
                            var nowCount = $addBtn.closest('.thumbnails-container').find('.thumbnail:not(.add)').length;
                            if (nowCount >= $node.data('opts').maxNumber) {
                                $addBtn.closest('.thumbnails-container').find('.thumbnail.add').hide();
                            }

                            _updateImageItemUrls(imageData);
                        },
                        error: function(r) {
                            // TODO: 完成错误提示
                            alert('上传图片失败！'+ r.status + ' ' + r.statusText);
                        },
                        complete: function() {
                            // 删掉占位图
                            var placeholders = $addBtn.closest('.thumbnails-container').find('.groupId_' + groupId);
                            if (placeholders.length > 0) {
                                placeholders.remove();
                            }
                        }
                    });
                } else {
                    if (files.length > maxNow) {
                        // alert('应选择不超过{maxNow}个，现选择{count}个，超过最大个数限制！'.format({
                        //     maxNow: maxNow,
                        //     count: files.length
                        // }));
                        alert('应选择不超过{maxImageNum}个，现选择{count}个，超过最大个数限制！'.format({
                            maxImageNum: maxImageNum,
                            count: files.length
                        }));

                    } else if (files.length < that.opts.minNumber) {
                        alert('应选择不少于{min}个，现选择{count}个，少于最小个数限制！'.format({
                            min: that.opts.minNumber,
                            count: files.length
                        }));
                    } else {
                        alert('未知错误，现选择{count}个！'.format({
                            count: files.length
                        }));
                    }
                }

                $addBtn.data('groupId', groupId + 1);

                $(this).val('');
            });

            // 给对象绑定点击删除的方法
            function _bindDelete($obj) {
                $obj.find('.delete').on('click', function(e) {
                    var $delBtn = $(e.target).closest('.delete');
                    // 先定位到addBtn，然后再删掉delBtn对应的缩略图
                    var $addBtn = $delBtn.closest('.item-input-image').find('.add');
                    $delBtn.closest('.thumbnail').remove();

                    var $node = $addBtn.closest('.drag_item');
                    // 判断总thumbnail数量是否小于了max，小于则显示上传按钮
                    if ($addBtn.closest('.thumbnails-container').find('.thumbnail:not(.add)').length < $node.data('opts').maxNumber) {
                        $addBtn.closest('.thumbnails-container').find('.thumbnail.add').css('display', 'inline-block');
                    }

                    // 更新已存值
                    var imageData = {
                        formId: $node.closest('form').attr('id'),
                        name: $node.data('opts').name
                    };
                    _updateImageItemUrls(imageData);
                });
            }


            // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
            this.$node.find('input').on('change', function(e) {
                var value = e.target.value;
                // console.log('value ->', value);
                that.setValue(value);
            });

            // 点击当前节点进入编辑模式 TODEL
            // this.$node.on('click', this.editCallback);

            // 预上传回调
            this.$node.data('preUpload', function(data) {
                var groupId = data.groupId;
                var count = data.count;
                for (var i = 0; i < count; i++) {
                    var $waiting = $(that.waitingTemplate);
                    // 绑定删除上传中的方法
                    $waiting.find('.delete').on('click', function(e){
                        $delBtn = $(e.target).closest('.delete');
                        $delBtn.closest('.thumbnail').remove();
                    });
                    $waiting.addClass('groupId_' + groupId);
                    $waiting.addClass('index_' + i);
                    that.$node.find('.thumbnails-container').append($waiting);
                    // $waiting.insertBefore($addBtn);
                }
            });

            // 上传完毕回调
            this.$node.data('uploaded', function(imageData) {
                var $item = $(that.thumbnailTemplate.format(imageData));
                // 绑定删除当前图片的方法
                $item.find('.delete').on('click', function(e) {
                    $delBtn = $(e.target).closest('.delete');
                    $delBtn.closest('.thumbnail').remove();

                    // 更新urls表单数据
                    _updateImgUrls(imageData);

                    // TODO: 弹出上限提示
                    // 判断总thumbnail数量是否小于了max
                    if (this.$node.find('.thumbnails-container').find('.thumbnail').length < this.opts.maxNumber) {
                        this.$node.find('.thumbnails-container').find('.thumbnail.add').css('display', 'inline-block');
                    }
                });
                // 替换对应的等待对象
                $waiting = that.$node.find(
                    '.thumbnail.waiting.groupId_' + imageData.groupId + '.index_' + imageData.index);
                $item.insertBefore($waiting);
                $waiting.remove();

                // 更新urls表单数据
                _updateImgUrls(imageData);

                // TODO: 弹出上限提示
                // 判断总thumbnail数量是否超过了max
                /*if (this.$node.find('.thumbnails-container').find('.thumbnail').length >= this.opts.maxNumber) {
                    this.$node.find('.thumbnails-container').find('.thumbnail.add').hide();
                }*/
            });
        }

        // 更新指定的表单项的值
        function _updateImgUrls(data) {
            var $input = $('form#{formId} input[name={name}]'.format(data));
            var $node = $input.closest('.item-content');
            var urlList = [];
            var $imgs = $node.find('img');
            $.each($imgs, function(idx) {
                urlList.push($imgs[idx].getAttribute('src'));
            });
            if (urlList.length > 0) {
                $input.val('images:[' + urlList.join(',') + ']');
            } else {
                $input.val('');
            }

            // TODO: 检查下这里的逻辑，写的时候有点儿混乱
            that.value = $input.val();
            that.checkViewStatus();
        }

        this.__setValue = function(value) {
            console.log('image / this.__setValue(' + value + ')');

            // console.log(this.$node.find('input'));

            this.$node.find('input').val(value);
            this.$node.find('.showValue').html(value);

            // -----------------------------------------------------------

            var urlList = value.match(/images:\[(.*)\]/)[1].split(',');
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
            });

            // 判断总thumbnail数量是否超过了max
            // if (this.$node.find('.thumbnails-container').find('.thumbnail:not(.add)').length >= this.opts.maxNumber) {
            // 	this.$node.find('.thumbnails-container').find('.thumbnail.add').hide();
            // }
        }

        this.editCallback = function(e) {
            myApp.closeModal();

            if (that.fileGroupId === undefined) {
                that.fileGroupId = 0;
            }

            // 根据当前已存在的缩略图，调整max和min
            var nowCount = that.$node.find('.thumbnails-container').find('.thumbnail').length;
            var max = that.opts.maxNumber - nowCount;
            var min = (((that.opts.minNumber - nowCount) >= 0) ? (that.opts.minNumber - nowCount) : 0);

            var data = {
                type: 'image',
                formId: that.$node.closest('form').attr('id'),
                name: that.opts.name,
                max: max,
                min: min,
                groupId: that.fileGroupId
            };
            that.fileGroupId = that.fileGroupId + 1;
            var urlParam = $.param(data);
            window.location = '/upload?' + urlParam;
        }
    }



    $.formb.components.image = component_image;

}));