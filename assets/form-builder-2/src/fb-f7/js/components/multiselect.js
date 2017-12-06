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

        var component_multiselect = function(kargs) {
            // 定义默认图标
            this.componentDefaultOpts = {
                'f7-icon': 'list',
                'placeholder': '--请选择--'
            }
            baseComponent.apply(this, arguments);	// 执行基类的初始化

            var that = this;

            this.template =
                '<span class="textarea-group">' +
                '<span href="#" class="smart-select "  data-back-on-select="true" data-open-in="picker">'+
                '<select name="{name}">{options} </select>'+
                '</span>'+
                '<span class="showValue"></span>' +
                '</span>';

            this.__beforeRender = function() {
            }
            this.__render = function() {
                var hideFlag = '';
                var option='<option value="{value}" {isHide}>{label}</option>';
                var optionshtml='';
                this.optionsMap = {};
                for (var i = 0; i < that.opts.options.length; i++) {
                    if(that.opts.options[i].isHide){
                        hideFlag = 'style="display:none"';
                    }else{
                        hideFlag = '';
                    }
                    optionshtml+=option.format({
                        value:that.opts.options[i].value,
                        label:that.opts.options[i].label,
                        isHide:hideFlag
                    });
                    that.optionsMap[that.opts.options[i].value] = that.opts.options[i].description || that.opts.options[i].label;
                };
                this.$node = $(this.template.format({
                    name: that.opts.name,
                    options: optionshtml
                }));
                this.$node.find('select').prop('multiple', true);
                if(that.rule !== undefined && that.rule.maxlength !== undefined){
                    that.$node.find('select').attr('maxlength',that.rule.maxlength);
                }
                // this.$node.attr('readonly', this.opts.readonly || false);

                var $select = this.$node.find('select');
                // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
                this.$node.find('select').on('change', function(e) {
                    // var value = e.target.selectedOptions[0]==undefined?'':e.target.selectedOptions[0].label;

                    var $select = that.$node.find('select');
                    console.log("+++",$select.length);
                    //用value判断是否有值比select.val好
                    if ($select.val().length == 0) {

                        // 利用timeout0将方法滞后执行
                        that.setValue([]);
                    }else {

                        that.setValue($select.val());
                    }

                });

                this.$node.on('click', this.editCallback);
            }
            this.__transRead = function() {
                this.$node.off('click', this.editCallback);
            }
            this.__setValue = function(value) {
                if(value === ''){
                    value = [] ;
                }
                var smartSelect = that.$node.find('.smart-select');
                smartSelect.smartSelectSetValue(value);
                var showValue = '';
                for(var i = 0;i<value.length;i++){
                    if(i == value.length-1){ // 最后一个不加逗号
                        showValue += that.optionsMap[value[i]];
                    }else{
                        showValue += that.optionsMap[value[i]];
                        showValue += ','
                    }
                }
                that.$node.find('.showValue').html(showValue);

                // this.$node.find('.showValue').html(this.optionsMap[value] || "");
            }

            this.editCallback = function(e) {
                setTimeout(function(){

                    var smartSelect = that.$node.find('.smart-select');
                    var $select = that.$node.find('select');
                    //当没有选择时，让checkbox没有默认点击
                    if(that.value == undefined || that.value === []) {
                        that.__setValue([]);
                    }
                    myApp.smartSelectOpen(smartSelect);


                    /*在picker退出的时候需要有段动画，这段动画结束后才能正常使用，在这里
                    我们取得最后一项的picker-modal-inner
                    */
                    var pickerLength = $('.picker-modal-inner').length;
                    var $picker = $($('.picker-modal-inner')[pickerLength - 1]);
                    // 手动将options 带有hide的选项去掉

                    var pickerOptions = $picker.find('input');
                    //判断select长度和pickerOptions的长度必须调整成一致
                    var minLength = $select[0].length > pickerOptions.length ? pickerOptions.length : $select[0].length;

                    for(var i = 0 ; i < minLength ; i++) {

                        if($($select[0][i]).css("display")==='none'){
                            $(pickerOptions[i]).closest('li').remove();
                        }

                    }
                }, 0);
            }

            //设置校验步骤
            this.__setCheckSteps = function() {
                $.each(this.rule, function(key) {
                    var ruleValue = that.rule[key];
                    var checkStepFunction = undefined;
                    var label = that.opts.label;
                    switch (key) {
                        case 'required':
                            checkStepFunction = function() {
                                if (that.$node.find('select').val() == '') {
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

        }
        $.formb.components.multiselect = component_multiselect;


    }
));