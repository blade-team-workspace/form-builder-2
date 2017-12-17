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
        this.template = '<div class="component" ><div class="radio-content"></div></div>';
        this.options = '<div class="radio clip-radio radio-primary radio-inline" ><input name = "{name}" type="radio" value="{value}" class="coreInput"><label class = "itemLabel">{label}</label></div>';
        this.readTemplate = '<div class="form-control-static" title="{value}">{value}</div>';
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
                that.$node.find('.radio-content').append($option);
            });


            // 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
            this.$node.find('input').on('change', function(e) {
                var value = e.target.value;
                that.setValue(value);
            });


        }

        this.__transRead = function (){

            var $input = that.$node.find('input');
            var label = '';
            $.each($input , function (idx) {
                var $this = $(this);
                if($this.prop('checked')) {
                    $.each(that.opts.options, function (idx){
                       if(that.opts.options[idx].value == $this.val()) {
                           label = that.opts.options[idx].label;
                       }
                    });

                }

            });
            that.$node.find('.radio-content').remove();
            that.$node.append(that.readTemplate.format({value:label}));
        }

        this.__setValue = function(value) {
            that.$node.find("input[value='" + value + "']").attr("checked",true);

        }

    };
    $.formb.components.radio = component_radio;

}));