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

    var component_checkbox = function (kargs) {
        baseComponent.apply(this, arguments);
        this.template = '<div class="component"><div class="options"></div></div>';
        this.options = '<div class="checkbox clip-check check-primary checkbox-inline" ><input type="checkbox" value="{value}" name="{name}" class="coreInput"><label class = "itemLabel">{label}</label></div>';
        var that = this ;
        function randomId(prefix){
            return ( prefix || '' ) + ( new Date().valueOf().toString(36)+Math.random().toString(36) ).split('0.').join('_').toUpperCase();
        }

        this.__render = function() {

            that.$node = $(that.template);
            $.each(that.opts.options,function(idx, obj){
              var random_id = randomId();

                var $option = $(that.options.format($.extend({},that.opts.options[idx],{'name' : that.opts.name})));

                $option.find('input').prop('id',random_id);

                $option.find('label').attr('for',random_id);
                that.$node.find('.options').append($option);
            })

            /*// 给用来存值的input对象加change监听，如果值改变，只有可能是setFormValue执行造成的
            this.$node.find('input').on('change', function(e) {
                var value = e.target.value;
                that.setValue(value);
            });*/

        }

        this.__setValue = function(value) {
            if(value === ''){
                value = [] ;
            }
            var targets = that.$node.find('input');
            $.each(targets , function(_idx) {
                var $this = $(this);
                if(value.indexOf($this.attr('value'))!= -1){
                    $this.prop('checked', true);
                }
            })

        }

        this.__transRead = function () {
            var $input = that.$node.find('input');
            var values = [];
            $.each($input ,function(idx) {
               var $this = $(this);
               if($this.prop("checked")) {
                   $.each(that.opts.options, function(idx) {
                       var option = that.opts.options[idx];
                       if(option.value == $this.val()){
                           values.add(option.label);
                           return;
                       }
                   })
               }
            });
            that.$node.find('.options').remove();
            that.$node.append(that.readTemplate.format({value:values.join(',')}));
        }
    };
    $.formb.components.checkbox = component_checkbox;

}));