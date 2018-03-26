;(function (factory) {
    'use strict';
     if(typeof define === "function" && define.amd) {
         define(['jquery'], factory);
     }else{
         factory(jQuery);
     }
}(function ($) {
    $.formb = $.formb || {};
    $.formb.components = $.formb.components || {};
    var baseComponent = $.formb.baseComponent;

    var component_date = function (kargs) {

        // 定义默认图标
        this.componentDefaultOpts = {
            'placeholder': '请填写日期'
        };

        baseComponent.apply(this, arguments);
        this.template = '<div class="component">' +
                            '<input type="text"   name="{name}" class=" form-control coreInput " style="background: #fff url(vendor/My97Datepicker/skin/datePicker.gif) no-repeat right;" onClick="WdatePicker({el:this,dateFmt:\'yyyy-MM-dd HH:mm:ss\'})"/>'+
                            '<div class="help-block-error"></div>'+
                        '</div>';

        var that = this ;
        
        this.__render = function() {
            if(!that.opts.isRead) {
                that.$node = $(that.template.format(that.opts));
                var $input = that.$node.find('input');
                $input.attr('placeholder', that.opts.placeholder);

                $input.on('change', function (e) {
                    var value = e.target.value;
                    // console.log('value ->', value);
                    that.setValue(value);
                });
            } else {
                that.$node = $(that.readTemplate.format(that.opts));
                that.$node.find('input').on('change',function () {
                    that.setValue($(this).val());
                });
            }
            

        }

        this.__setValue = function (value) {

            if(!that.opts.isRead) {
                that.$node.find("input").val(value);
            } else {
                if(value === '') {
                    that.$node.attr('hidden',true);
                } else {
                    that.$node.removeAttr('hidden');
                    that.$node.attr("title",value);
                    that.$node.find('input').val(value);
                    that.$node.find('.showValue').html(value);
                }
            }
        }

    };
    $.formb.components.date = component_date;

}));