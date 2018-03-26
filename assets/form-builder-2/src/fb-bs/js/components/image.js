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
            '<div class="help-block-error"></div>'+
            '</div>';

        this.addTemplate =
            '<span class="button thumbnail add fake-file-btn">' +
            '<i class="fa fa-plus"></i>' +
            '<input class="ignore" id="{id}" type="file"  ' +
            'accept="image/x-png, image/gif, image/jpeg, image/bmp">' +
            '</span>';


        this.thumbnailTemplate =
            '<div class="thumbnail coreInput">' +
            '<div class="delete">' +
            '<i>&times;</i>' +
            '</div>' +
            '<a class="openPhotoBrowser" href="javascript:void(0);">' +
            '<div class="image-container">' +
            '<img src="{url}" onerror="onerror=null; src=\'/assets/fw7/img/error.jpg\'"/>' +
            '</div>' +
            '</a>' +
            '</div>';

        this.waitingTemplate =
            '<div class="thumbnail waiting">' +
            '<div class="delete">' +
            '<i>&times;</i>' +
            '</div>' +
            '<div class="help">' +
            '<i class="fa fa-spinner fa-spin fa-pulse fa-3x fa-fw"></i>' +
            '</div>' +
            '</div>';


        //绑定添加图片按钮id
        //确保唯一性，如果多个id重复的情况需要重新定义
        var add_id = this.opts.name + "_add";
        //绑定上传序号，自增变量，与max无关
        var index = 0;

        function _bindDelete($obj) {
            $obj.find('.delete').on('click', function(e) {
                var $delBtn = $(e.target).closest('.delete');
                // 先定位到addBtn，然后再删掉delBtn对应的缩略图
                var $addBtn = $delBtn.closest('.thumbnails-container').find('.add');
                $delBtn.closest('.thumbnail').remove();

                $addBtn.trigger('changeShowHide');
                var $node = $addBtn.closest('.component');

                // 更新已存值
                var imageData = {
                    formId: $node.closest('form').attr('id'),
                    name: that.opts.name
                };
                _updateImageItemUrls(imageData);
            });
        }
        // 更新指定的表单项的值
        function _updateImageItemUrls(data) {
            var $input = $('form#{formId} input[name={name}]'.format(data));
            var $node = $input.closest('.component');
            var urlList = [];
            var $imgs = $node.find('img');
            $.each($imgs || {}, function(idx) {
                urlList.push($imgs[idx].getAttribute('src'));
            });
            if (urlList.length > 0) {
                $input.val('images:[' + urlList.join(',') + ']');
            } else {
                $input.val('');
            }
        }
        this.__render = function() {
            this.$node = $(this.template.format(this.opts));


            var $add = $(this.addTemplate.format({id:add_id}));
            this.$node.find('.thumbnails-container').append($add);
            this.$node.find('input[name={name}]'.format({name:that.opts.name})).on('change', function(e) {
                var value = e.target.value;
                that.setValue(value);
                $(this).trigger('keyup');
            });

            $add.on('changeShowHide',function() {
                var current = $(this).closest('.thumbnails-container').find('.thumbnail:not(.add)').length;
                if (current >= that.opts.maxNumber) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });

            if(!that.opts.isRead){

                var index = 0 ;
                $add.find('input[type=file]').on('change', function(e) {
                    if($(this).val()!==''){
                    var ab_key = that.opts.name + '|' + index + '|' + (new Date()).valueOf();
                    index++;

                    var opt = {
                        data: {
                            file: $(this).get(0).files[0],
                            key: ab_key + $(this).val().match(/\.?[^.\/]+$/)
                        }, beforeSend: function (xhr) {
                            var key = ab_key.split('.')[0].split('|');
                            var name = key[0];
                            var index = key[1];
                            var $container = $('input[name={name}]'.format({name: name})).closest('.component').find('.thumbnails-container');
                            // 增加占位图
                            var $waiting = $(that.waitingTemplate);
                            $waiting.attr('index', index);
                            // 绑定删除上传中的方法
                            _bindDelete($waiting);
                            var $addBtn = $container.find('.thumbnail.add');
                            $addBtn.before($waiting);
                            $addBtn.trigger('changeShowHide');
                        }, success: function (res) {
                            console.log('upload success');
                            var domain = $('#qiniuDomain').val();
                            var sourceLink = domain + res.key;		// 获取上传成功后的文件的Url
                            var key = res.key.split('.')[0].split('|');
                            var name = key[0];
                            var index = key[1];
                            var $item = $(that.thumbnailTemplate.format({url: sourceLink}));
                            $item.attr('index', index);

                            // 绑定点击弹出
                            $item.find('.image-container').bindPopup();

                            _bindDelete($item);
                            var $container = $('input[name={name}]'.format({name: name})).closest('.component').find('.thumbnails-container');
                            var $waiting = $container.find('.thumbnail.waiting[index={index}]'.format({index: index}));
                            $waiting.replaceWith($item);
                            // 更新已存值
                            var imageData = {
                                formId: $container.closest('form').attr('id'),
                                name: that.opts.name
                            };
                            _updateImageItemUrls(imageData);
                        },
                        error: function (res) {
                            console.log('upload error.', res);
                            // that.$node.find('.help-info').html($.parseJSON(res.responseText)['error']);
                        }

                    }
                    qiniu_upload(opt)
                }
                });
                // sb七牛云必须加载到页面后的dom才能初始化
                // setTimeout(function() {
                //     _bindUpload(that.$node);
                // },500);
                var opt =
                $add.css('display','inline-block');
                // $add.show();
            } else {
                $add.css('display','none')
                // $add.hide();
            }

        }


        this.__setValue = function(value) {
            console.log('image / this.__setValue(' + value + ')');
            this.$node.find('input[name={name}]'.format({name:that.opts.name})).val(value);

            var urlList;
            if (value.match(/images:\[(.*)\]/) && value.match(/images:\[(.*)\]/).length > 0) {
                urlList = value.match(/images:\[(.*)\]/)[1].split(',');
            } else {
                urlList = [];
            }

            $.each(urlList, function(idx) {
                var $item = $(that.thumbnailTemplate.format({url: urlList[idx]}));
                if(that.opts.isRead) {
                    $item.find('.delete').hide();
                }
                _bindDelete($item);

                // 绑定点击弹出
                $item.find('.image-container').bindPopup();

                var $container = that.$node.find('.thumbnails-container');
                var $addBtn = $container.find('.thumbnail.add');
                $addBtn.before($item);
            });
            if(that.opts.isRead) {
                if (urlList.length == 0) {
                    that.$node.attr('hidden', true);
                } else {
                    that.$node.removeAttr('hidden');

                }
            }

        }



        this.__transRead = function () {
            //暂时不管image的transRead方法
        }

    }

    $.formb.components.image = component_image;
}));