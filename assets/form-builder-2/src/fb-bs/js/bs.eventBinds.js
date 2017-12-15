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
    $.formb.eventBinds = $.formb.eventBinds || {};
    // 对象值改变，改变其他对象的显示和隐藏状态(并禁用组件)
    $.formb.eventBinds.valueChangeShowHide = {
        listener: 'change',
        callback: function(event) {
            // 当前事件的触发对象
            var $this = $(event.target);
            // 作用域（form）
            var $form = $this.closest('form');
            // 当前事件触发对象的name属性
            var triggerName = event.target.name;
            // 所有响应对象名
            var allResp = [];	// 一层级
            $.each(eb.valueResps, function(value){
                // 使用自定义组相加方法，是组合并，是内容直接加入组
                allResp.add(eb.valueResps[value]);
            });
            var valueRespMap = eb.valueResps;		// {触发器的value: 响应对象的name}的关系
            var triggerValues = [];					// 触发器现在的值(使用数组存储，统一格式方便操作)
            var respNames = [];						// 取得当前值对应的所有响应对象(应该显示的对象名)


            // 整理出所有需要显示的name，放到respNames中
            triggerValues.add($this.val());		// 将触发器值转化成数组放入triggerValues
            $.each(triggerValues, function(idx) {
                respNames.add(valueRespMap[triggerValues[idx]]);
            });

            console.log('Selected: [' + triggerValues.join(', ') + '], respNames:', respNames);

            // 轮询所有响应的输入项name
            $.each(allResp, function(idx){
                var itemName = allResp[idx];

                if (itemName != undefined && itemName.length > 0) {
                    //取到每个组件的Dom
                    var itemContainer = $form.find('[name=' + itemName + ']').closest('.outerClass');
                    // 当前轮询的name在本次应该显示的nameList中
                    if (respNames.indexOf(itemName) != -1) {
                        itemContainer.removeAttr('hidden');
                        // 启用存值的节点
                        $form.find('[name=' + itemName + ']').prop('disabled', false);
                    } else {
                        // 隐藏存值的节点
                        itemContainer.attr('hidden');

                        // 将要隐藏的组件值赋为空，并触发change事件
                        $form.find('[name=' + itemName + ']').val('').trigger('change');

                        // 禁用存值的节点
                        $form.find('[name=' + itemName + ']').prop('disabled', true);
                    }
                }
            });
        }
    }
}));
