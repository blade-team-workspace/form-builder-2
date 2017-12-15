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

    var component_multiselect = function(kargs) {
        // 定义默认图标
        this.componentDefaultOpts = {
            'placeholder': '--请选择--'
        };
        baseComponent.apply(this, arguments);

        this.template =
            '<select class="form-control coreinput" size="2"  multiple></select>';



        this.__render = function() {

            var that = this;

            that.$node = undefined;

            that.$node = $(that.template.format(that.opts));
            that.$node.multiselect('destroy');
            $('.multiselect-native-select:eq(0)',that.$node).replaceWith(that.$node);

            that.$node.html('');

            // if (that.opts.placeholder) {
            //     that.$node.append('<option value="">' + that.opts.placeholder + '</option>')
            // }

            if (that.opts.options !== undefined && that.opts.options.length > 0){
                $.each(that.opts.options, function() {
                    that.$node.append('<option value="' + this.value + '">' + this.label + '</option>');
                });
            } else {
                that.$node.append('<option value="">--No-Item--</option>');
            }


            that.$node.multiselect =  {
                dropRight: true,
                buttonContainer: '<div class="btn-group" style="width:100%;"/>',
                nonSelectedText: that.opts.placeholder||'--请选择--',
                templates: {
                    button:
                    '<button type="button" class="multiselect dropdown-toggle btn-block" data-toggle="dropdown" ' +
                    'style="text-align: left; padding-left: 16px; white-space:nowrap; text-overflow:ellipsis; ' +
                    'overflow:hidden;">' +
                    '<span class="multiselect-selected-text"></span>' +
                    '</button>',
                    ul: '<ul class="multiselect-container dropdown-menu" style="width: 100%;"></ul>'
                }
            };

            that.$node.on('change', function(){
                $(this).multiselect('refresh');

            });



        }


        this.__transRead = function() {

        }

        this.__setValue = function(value) {
            this.$node.find("option[value='"+value+"']").attr("selected",true);
            console.log("--",that.$node.find("option[value='"+value+"']").attr("selected",true));
        }



    };



    $.formb.components.multiselect = component_multiselect;

}));