//$() 为什么返回一个对象？
//jquery库自己封闭了自己的作用域 他其实是一个大的闭包
(function () {
    function jQuery(selector) {
        return new jQuery.prototype.init(selector);
    }
    jQuery.prototype.init = function (selector) {
        //⚠️注意：只能传id和class现在
        // this = {};
        // 选出 dom 并且包装成jQuery对象  返回
        // id class
        this.length = 0;
        // null undefined dom
        if (selector == null) {
            return this;
        }

        if (typeof selector == 'string' && selector.indexOf('.') != -1) {
            var dom = document.getElementsByClassName(selector.slice(1));
        } else if (typeof selector == 'string' && selector.indexOf('#') != -1) {
            var dom = document.getElementById(selector.slice(1));
        }
        //如果是dom对象
        if (selector instanceof Element || dom.length == undefined) {
            this[0] = dom || selector;
            this.length++;
        } else {
            // 基础铺垫：通过上面class或者id获得的dom有很多个 把每一个都塞到this里去
            for (var i = 0; i < dom.length; i++) {
                this[i] = dom[i];
                this.length++
            }
        }
        //new了之后自动返回this
        // return this;
    }
    //this是谁呢，谁调用 this就是谁 比如$('.demo')，this就是'.demo'
    jQuery.prototype.css = function (config) {
        //解析样式对象
        for (var i = 0; i < this.length; i++) {
            for (var attr in config) {
                this[i].style[attr] = config[attr];
            }
        }
        //为什么要return this,这样后面就可以接着链式调用了
        return this;
    }

    jQuery.prototype.pushStack = function (dom) {
        //dom 是 newObj
        //如果不是一个jq对象
        if (dom.constructor != jQuery) {
            dom = jQuery(dom);
        }
        dom.prevObject = this;

        return dom;
    }
    jQuery.prototype.get = function (num) {
        // if(num == null){
        //     return [].slice.call(this,0);
        // }else{
        //     if(num>=0){
        //         return this[num];
        //     }else{
        //         return this[num+this.length];
        //     }
        // }
        //return的是原生 这个方法返回的就是原生
        return num != null ? (num >= 0 ? this[num] : this[num + this.length]) : [].slice.call(this, 0);
    }

    jQuery.prototype.eq = function (num) {
        var dom = num != null ? (num >= 0 ? this[num] : this[num + this.length]) : null;
        // return jQuery(dom);
        return this.pushStack(dom);
    }

    jQuery.prototype.add = function (selector) {
        //获得当前的obj
        var curObj = jQuery(selector);
        //获得最开始的obj，这个obj是经过了jQ的init选择后return出来的this
        var baseObj = this;
        //让curOBj 和 baseObj割成一个新的jQ对象
        var newObj = jQuery();

        //通过两个for loop把对象分别塞到newOBj里面 
        for (var i = 0; i < curObj.length; i++) {
            newObj[newObj.length++] = curObj[i];
        }
        for (var i = 0; i < baseObj.length; i++) {
            newObj[newObj.length++] = baseObj[i];
        }

        //
        this.pushStack(newObj);
        return newObj;
    }
    jQuery.prototype.end = function () {
        return this.prevObject;
    }


    jQuery.prototype.init.prototype = jQuery.prototype;
    window.$ = window.jQuery = jQuery;
})();