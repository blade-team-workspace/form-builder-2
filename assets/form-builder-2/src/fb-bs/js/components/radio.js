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

    var component_radio = function (kargs) {
        baseComponent.apply(this, arguments);
        this.template = '<div class="formContent" ></div>';
        this.options = '<div class="radio clip-radio radio-primary radio-inline" ><input name = "{name}" type="radio" value="{value}" class="coreInput"><label class = "itemLabel">{label}</label></div>';
        var that = this ;
        function randomId(prefix){
            return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
        }
        this.__render = function() {


            that.$node = $(that.template);
            $.each(that.opts.options,function(idx, obj){
              var random_id = randomId();
                var $option = $(that.options.format($.extend({},that.opts.options[idx],{'name': that.opts.name})));
                $option.find('input').prop('id',random_id);
                $option.find('label').attr('for',random_id);
                that.$node.append($option);
            });


            // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
            this.$node.find('input').on('change', function(e) {
                var value = e.target.value;
                that.setValue(value);
            });

        }
        this.__setValue = function(value) {
            that.$node.find("input[value='" + value + "']").attr("checked",true);
            console.log("++++",that.$node.find("input[value='" + value + "']").attr("checked",true))
        }

    };
    $.formb.components.radio = component_radio;

}));