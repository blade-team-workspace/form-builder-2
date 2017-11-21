;(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['Dom7'], factory);
    } else {
        factory(window.Dom7);
    }
}(function ($, undefined) {
    $.formb = $.formb || {};

    $.formb.components = $.formb.components || {};
    var baseComponent = $.formb.baseComponent;
    var component_audio = function (kargs) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'f7-icon': 'compose'
        };

        baseComponent.apply(this, arguments);	// 执行基类的初始化
        var that = this;
        this.template =
            '<span class="media-node">' +
            '<input type="hidden" name="{name}" />' +
            '<div class="audioItems-container">' +
            '</div>' +
            '</span>';
        this.thumbnailTemplate =
            '<div class="audio-player audioItem swipeout-clean-item">' +
            '<audio src="{url}" onerror="onerror=null; $(this)' +
            '.next().css(\'border-color\', \'red\')' +
            '.find(\'.decorate\').css(\'background\', \'transparent\').html(\'ERROR\');">' +
            '</audio>' +
            '<div class="progress-bar">' +
            '<div class="played-part"></div>' +
            '<div class="decorate"></div>' +
            '</div>' +
            '<i class="ppBtn f7-icons">play_round</i>' +
            '<div class="time">00:00</div>' +
            '<div class="delete">' +
            '<i class="f7-icons size-smaller">close</i>' +
            '</div>' +
            '</div>';
        this.waitingTemplate =
            '<div class="audio-player audioItem swipeout-clean-item waiting">' +
            '<div class="progress-bar">' +
            'uploading ...' +
            '</div>' +
            '<div class="delete">' +
            '<i class="f7-icons">close</i>' +
            '</div>' +
            '</div>';
        this.__render = function () {
            this.$node = $(this.template.format(this.opts));
            // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
            this.$node.find('input').on('change', function(e) {
                var value = e.target.value;
                // console.log('value ->', value);
                that.setValue(value);
                // audioPlayer_bindEvents(($(e.target).closest('.item-content')));
            });
            function audioPlayer_bindEvents($item) {
                console.log("---" + $item.find('.audio-player i.ppBtn').length);
                // 自制播放器-播放/暂停事件绑定
                $item.find('.audio-player i.ppBtn').on('click', function(e) {
                    var $audio = $(e.target).closest('.audio-player').find('audio');
                    var $this = $(e.target);
                    if ($this.html() == 'play_round') {
                        $audio[0].play();
                        $this.html('pause_round');
                    } else {
                        $audio[0].pause();
                        $this.html('play_round');
                    }
                });
                // 自制播放器-播放进度条-开始拖拽
             /*   $item.find('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchstart', function(e) {
                    var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
                    var $playedPart = $processBar.find('.played-part');
                    var $audio = $(e.target).closest('.audio-player').find('audio');
                    var $time = $(e.target).closest('.audio-player').find('.time');
                    console.log($processBar);
                    var leftX = e.touches[0].clientX;
                    var barWidth = $processBar.width();

                    console.log("$playedPart.css('width')", $playedPart.css('width'));
                    var basePer = parseFloat(((parseFloat($playedPart.css('width').replace('px', '')) / barWidth) * 100).toFixed(2));
                    console.log('---- basePer', basePer);
                    // 去掉更新进度条的事件绑定
                    $audio.off('timeupdate');
                    $(document).on('touchmove', function(e) {
                        console.log('  --', parseFloat((((e.touches[0].clientX - leftX) / barWidth) * 100).toFixed(2)));
                        var per = basePer + parseFloat((((e.touches[0].clientX - leftX) / barWidth) * 100).toFixed(2));
                        console.log('    >> per2', per);
                        if (per < 0) {
                            per = 0;
                        } else if (per > 100) {
                            per = 100;
                        }
                        // 更新已播放的进度条长度
                        $playedPart.css('width', per + '%');
                        // 更新剩余时间
                        var leftSeconds = parseInt($audio[0].duration * (1 - per / 100));
                        $time.html(__formatTime(leftSeconds));
                    });
                });*/
                // 自制播放器-播放进度条-释放
               /* $item.find('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchend', function(e) {
                    console.log('touch-end');
                    $(document).off('touchmove');
                    var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
                    var $playedPart = $processBar.find('.played-part');
                    var $ppBtn = $(e.target).closest('.audio-player').find('.ppBtn');
                    var endPer = ($playedPart.width() / $processBar.width() * 100).toFixed(2);
                    // console.log('end at', endPer + '%');
                    // 跳转到指定位置播放
                    var $audio = $(e.target).closest('.audio-player').find('audio');
                    $audio[0].currentTime = $audio[0].duration * 0.01 * endPer;
                    // 绑定更新事件
                    $audio.on('timeupdate', __audioTimeUpdateCallback);
                    $audio[0].play();
                    $ppBtn.html('pause_round');
                });*/
                // 自制播放器-更新进度条和剩余时间
                $item.find('.audio-player audio').on('timeupdate', __audioTimeUpdateCallback);
                // 更新时间的回调
                function __audioTimeUpdateCallback(e) {
                    var $this = $(e.target);
                    var scales = $this[0].currentTime / $this[0].duration;
                    var leftSeconds = parseInt($this[0].duration - $this[0].currentTime);
                    var persentNum = (scales * 100).toFixed(2);
                    var $bar = $this.parent().find('.played-part');
                    var $time = $this.parent().find('.time');

                    // 更新已播放的进度条长度
                    $bar.css('width',  persentNum + '%');
                    // 更新剩余时间
                    $time.html(__formatTime(leftSeconds));
                }
                // 秒数转“分:秒”
                function __formatTime(second) {
                    return [/*parseInt(second / 60 / 60), */parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
                        .replace(/\b(\d)\b/g, "0$1");
                }
            }

            this.$node.data('preUpload', function (data) {
                var groupId = data.groupId;
                var $waiting = $(that.waitingTemplate);
                // 绑定删除上传中的方法
                $waiting.find('.delete').on('click', function (e) {
                    $delBtn = $(e.target).closest('.delete');
                    $delBtn.closest('.audioItem').remove();
                    that.$node.closest('li.swipeout').css('height', '0px');

                });
                $waiting.addClass('groupId_' + groupId);
                that.$node.find('.audioItems-container').append($waiting);
                that.$node.closest('li.swipeout').css('height', 'initial');
            });
            this.$node.data("uploaded", function (data) {
                var $item = $(that.thumbnailTemplate.format(data));
                // 绑定删除当前图片的方法
                $item.find('.delete').on('click', function(e) {
                    var $delBtn = $(e.target).closest('.delete');
                    $delBtn.closest('.audioItem').remove();
                    that.$node.closest('li.swipeout').css('height', '0px');
                    // 更新urls表单数据
                    _updateAudioUrls(data);
                });
                audioPlayer_bindEvents($item);
                var $waiting = $('form#{formId} input[name={name}]'.format(data)).closest('.item-content').find(
                    '.audioItem.waiting.groupId_' + data.groupId );
                $item.insertBefore($waiting);
                $waiting.remove();
                _updateAudioUrls(data);
            });
            this.__setValue = function(data) {
                console.log('audio / this.__setValue(' + data + ')');
                that.$node.find('input').val(data);
                if (data && data.match(/audios:\[(.*)\]/) !== null) {
                    var  url = data.match(/audios:\[(.*)\]/)[1].split(',')[0];
                    var $item = $(that.thumbnailTemplate.format({url:url}));
                    // 绑定删除当前图片的方法
                    $item.find('.delete').on('click', function(e) {
                        var $delBtn = $(e.target).closest('.delete');
                        $delBtn.closest('.audioItem').remove();
                        that.$node.closest('li.swipeout').css('height', '0px');
                        var audioData = {
                            formId: that.$node.closest('form').attr('id'),
                            name: that.opts.name
                        };
                        // 更新urls表单数据
                        _updateAudioUrls(audioData);
                    });
                    audioPlayer_bindEvents($item);
                    that.$node.find('.audioItems-container').append($item);
                }

                // _updateAudioUrls(data);

            };
            // 更新指定的表单项的值
            function _updateAudioUrls(data) {
                var $input = $('form#{formId} input[name={name}]'.format(data));
                var $node = $input.closest('.item-content');
                var $audio = $node.find('audio');
                //audio没有找到只有一种可能 点击delete删掉了
                if ($audio.length > 0 ) {
                    $input.val('audios:[' + $audio[0].getAttribute('src') + ']');
                } else {
                    $input.val('');
                }
            }
        };
        this.editCallback = function (e) {
            myApp.closeModal();

            if (that.fileGroupId === undefined) {
                that.fileGroupId = 0;
            }
            //只支持1个item
            max = 1;
            min = 1;
            var data = {
                type: 'audio',
                formId: that.$node.closest('form').attr('id'),
                name: that.opts.name,
                max: max,
                min: min,
                groupId: that.fileGroupId
            };
            that.fileGroupId = that.fileGroupId + 1;
            var urlParam = $.param(data);
            window.location = '/upload?' + urlParam;
        };

        //设置校验步骤
        this.__setCheckSteps = function() {
            $.each(this.rule, function(key) {
                var ruleValue = that.rule[key];
                console.log(ruleValue);
                var checkStepFunction = undefined;
                var label = that.opts.label;
                switch (key) {
                    case 'required':
                        checkStepFunction = function() {
                            if (that.$node.find('input').val() == '') {
                                myApp.alert('请填写"{label}"'.format({label: label}));
                                return false;
                            } else {
                                return true;
                            }
                        }
                        break;
                    default:
                        console.warn('[WARN] 发现未知参数 {key}: {ruleValue}'.format({key: key, ruleValue: ruleValue}));
                        break;
                }
                if (checkStepFunction) {
                    $.formb.appendCheckStepToForm(that.$form, checkStepFunction);
                }
            });
        }
    };


    $.formb.components.audio = component_audio;
}));