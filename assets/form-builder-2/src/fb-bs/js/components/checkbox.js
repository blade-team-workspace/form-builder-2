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

            if (that.opts.isRead ) {
                that.$node = $(that.readTemplate.format(that.opts));
                that.$node.find('input').on('change',function () {
                   that.setValue($(this).val());
                });
            } else {
                that.$node = $(that.template);
                $.each(that.opts.options,function (idx, obj) {
                    var random_id = randomId();
                    var label  = that.opts.options[idx].description !== undefined ? that.opts.options[idx].description : that.opts.options[idx].label;
                    var values = {
                        value:that.opts.options[idx].value,
                        label:label
                    }
                    var $option = $(that.options.format($.extend({},values,{'name' : that.opts.name})));
                    $option.find('input').prop('id',random_id);
                    $option.find('label').attr('for',random_id);
                    that.$node.find('.options').append($option);
                });
                // that.$node.find("input").on('change',function () {
                //     this.setValue($(this.val))
                // })
            }




        }

        this.__setValue = function(value) {
            if (!that.opts.isRead ) {
                if (value === '') {
                    value = [];
                } else {
                    value = value.split(",");
                }
                var targets = that.$node.find('input');
                $.each(targets, function (_idx) {
                    var $this = $(this);
                    if (value.indexOf($this.attr('value')) != -1) {
                        $this.prop('checked', true);
                    }
                })
            } else {
                var label = [];

                if(value !== undefined) {

                        if($.isArray(value)){

                        } else {
                            value = value.split(",");
                        }
                    $.each(that.opts.options, function (_idx) {

                        if(value.indexOf(that.opts.options[_idx].value.toString()) != -1) {
                            if(that.opts.options[_idx].description) {
                                label.add(that.opts.options[_idx].description);
                            }else{
                                label.add(that.opts.options[_idx].label);
                            }
                        }

                    });
                    var finalLabel = label.join(',');
                    that.$node.attr("title",finalLabel);
                    that.$node.find('input').val(value);
                    that.$node.find('.showValue').html(finalLabel);
                }
            }
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