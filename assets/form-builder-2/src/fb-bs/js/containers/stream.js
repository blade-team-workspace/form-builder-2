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
    var baseComponent = $.formb.baseContainer;


    var component_stream = function (kargs) {
        baseComponent.apply(this, arguments);
            this.template = '<div class="outerClass col-sm-12 drag_item">' +
                                '<div class="item row formDescription form-group">' +
                                    '<div class="contentClass col-sm-10">' +
                                        '<div class="formContent">' +
                                            '<div class="textarea-group one stream" style="color:#000;display:inline-block;">{label}</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';

        this.deleteBtn =
            '<span class="delete" style="">' +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</span>' ;


        var that = this ;

        this.__render = function() {
            // 渲染内部items
            var opt = undefined;
            var appendData = {
                label: this.opts.label,
                components: []				// 用于存放所有渲染完毕的components
            };

            // // 寻找appendData.label中的{taNewx}
            var reSearch = appendData.label.match((/{[^{}]*}/g));
            var itemComponentMap = {};
            $.each(that.opts.items, function (idx){
                var type = that.opts.items[idx].type;
                var name = that.opts.items[idx].name;
                var Component = $.formb.components[type];
                var component = new Component(that.opts.items[idx]);
                if(component !== undefined) {
                    itemComponentMap[name] = component;
                    }
                });

            // // 循环查找结果，将其替换；
            $.each(reSearch, function(idx) {
                //var opts = that.opts.items;
                var name = reSearch[idx];
                // name.substring(1,name.length-1);
                var component = itemComponentMap[name.substring(1,name.length-1)];
                component.render();
                var template = component.$node[0].outerHTML;

                appendData.label = appendData.label.replace(name, '<span item-name="{name}">{template}</span>'.format({name: name.match("{([^{}]*)}")[1],template:template}));

            });

            // var opts = this.template.format({label: appendData.label});

            $.each(this.opts.items, function(idx){
                opt = that.opts.items[idx];


                var Component = $.formb.components[opt.type];
                //console.log(Component)

                if (Component === undefined) {
                    console.error('组件或容器[{type}]未找到对应的class定义'.format({type: opt.type}));
                }
                // 将当前label传入下一层（textarea需要用到作为弹出的标题（扶额））
                // opt.label = that.opts.label;
                // 将当前$form传入下一层参数
                opt.$form = that.$form;
                // 将当前rule传入下一层
             /*   opt.rule = rules[opt.name];*/
                // console.log(opt.rule);		// undefined

                var component = new Component(opt);
                component.render();
                appendData.components.push(component);
            });
            that.append(appendData);
             console.log(appendData)
            // Object {label: "今天天气<span item-name={name}>{name}</span>,我们去了<span…me}</span>,心情<span item-name={name}>{name}</span>", components: Array[3]}
        };

        this.__append = function(appendData) {

            // 渲染label >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            //var $labels = $(this.template.format({labels: appendData.labels}));
             var $label = $(this.template.format({label: appendData.label}));
             console.log($label);

             this.$node = [$label];

             console.log([$label]); // [l] length=1(items行数) Array[0]

             $.each(appendData.components, function(idx) {
                 var childComponent = appendData.components[idx];
                 var opts = childComponent.opts;


          //       //判断是否是只读
          //       if (childComponent.opts.isRead) {
          //           childComponent.$node.next().addClass('hide');
          //           childComponent.transRead();
          //       }


             });
        }

    };
    $.formb.components.stream = component_stream;

}));