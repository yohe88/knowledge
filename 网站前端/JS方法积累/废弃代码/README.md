# JS废弃代码

## 目录
1. [原生JS方法](#原生js方法)

    1. 可用[moment](https://github.com/moment/moment/)代替

        1. [格式化日期](#原生js格式化日期)
        1. [获取年龄](#原生js获取年龄)
        1. [倒计时显示](#原生js倒计时显示)
    1. 可用[jquery](https://github.com/jquery/jquery)或ES6或其他库代替

        1. [多异步返回后才执行总回调函数（利用jQuery的`$.ajax`）](#原生js多异步返回后才执行总回调函数利用jquery的ajax)
        1. [对象合二为一（改变第一个参数）](#原生js对象合二为一改变第一个参数)
        1. [深复制](#原生js深复制)
        1. [通过类名获取DOM](#原生js通过类名获取dom)
    1. 可用[js-cookie](https://github.com/js-cookie/js-cookie)代替

        1. [操作cookie](#原生js操作cookie)
    1. 可用[lodash](https://github.com/lodash/lodash)或[underscore](https://github.com/jashkenas/underscore)代替

        1. [防抖函数](#原生js防抖函数)
        1. [节流函数](#原生js节流函数)
1. [Polyfill](#polyfill)

    1. [`requestAnimationFrame`和`cancelAnimationFrame`](#原生jsrequestanimationframe和cancelanimationframe的polyfill)
    1. [`Date.now`](#原生jsdatenow的polyfill)
    1. [`Object.create`](#原生jsobjectcreate的polyfill)
    1. [`Array.isArray`](#原生jsarrayisarray的polyfill)
    1. [`Array.prototype.map`](#原生jsarrayprototypemap的polyfill)
    1. [`Function.prototype.bind`](#原生jsfunctionprototypebind的polyfill)
    1. [`String.prototype.trim`](#原生jsstringprototypetrim的polyfill)
    1. [`String.prototype.repeat`](#原生jsstringprototyperepeat的polyfill)
    1. [`Number.isNaN`](#原生jsnumberisnan的polyfill)
    1. [`Number.isFinite`](#原生jsnumberisfinite的polyfill)
    1. [`Number.isInteger`](#原生jsnumberisinteger的polyfill)
    1. [`Number.isSafeInteger`](#原生jsnumberissafeinteger的polyfill)

---
## 原生JS方法

### *原生JS*格式化日期
```javascript
var format = {
  date: function (dateObj, fmt) {    /* 格式化日期 */
    var o = {
        'q+': Math.floor((dateObj.getMonth() + 3) / 3), // 季度
        'M+': dateObj.getMonth() + 1, // 月
        'd+': dateObj.getDate(), // 日
        'h+': dateObj.getHours() % 12 === 0 ? 12 : dateObj.getHours() % 12, // 12小时制
        'H+': dateObj.getHours(), // 24小时制
        'm+': dateObj.getMinutes(), // 分
        's+': dateObj.getSeconds(), // 秒
        'S': dateObj.getMilliseconds(), // 毫秒
      },
      week = {
        '0': '日',
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
      },
      i;

    /* [{y:'7'},{yy:'17'},{yyy+:'017'},{yyyy+:'2017'}] */
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    /* [{E:'一'},{EE:'周一'},{EEE+:'星期一'}] */
    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[dateObj.getDay() + '']);
    }
    for (i in o) {
      if (new RegExp('(' + i + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[i]) : (('00' + o[i]).substr(('' + o[i]).length)));
      }
    }

    return fmt;
  },
};


/* 使用测试 */
var a = format.date(new Date(), 'yyyy-MM-dd HH:mm:ss S毫秒 EEE 季度q');
```
>可以使用[moment](https://github.com/moment/moment/)格式化时间，完全替代。

### *原生JS*获取年龄
```javascript
/**
 * 获取年龄
 * @param {String|Number} birthday - 年月日（8位，如：'19900220'或19900220） 或 空字符串
 * @returns {String} age - 年龄 或 空字符串
 */
function getAge (birthday) {
  birthday = birthday.toString()

  var age = 0

  if (birthday && birthday.length === 8) {
    var now = new Date()
    var nowYear = now.getFullYear()
    var nowMonth = now.getMonth() + 1
    var nowDay = now.getDate()

    if (nowMonth < 10) {
      nowMonth = '0' + nowMonth
    }
    if (nowDay < 10) {
      nowDay = '0' + nowDay
    }

    age = Math.floor((parseInt('' + nowYear + nowMonth + nowDay, 10) - parseInt(birthday, 10)) / 10000)
  }

  if (age > 0) {
    age = age.toString()
  } else {
    age = ''
  }

  return age
}
```
>可以使用[moment](https://github.com/moment/moment/)格式化时间，完全替代。

### *原生JS*倒计时显示
1. 统一输出

    ```javascript
    /**
     * 显示倒计时，统一输出
     * @constructor
     * @param {Object} data
     * @param {Number} data.deadline - 到期的时间戳
     * @param {Object} [data.dom] - 输出节点，若不是节点则console.log输出
     * @param {Function} [data.callback] - 到点后的回调函数
     * @param {Number} [data.leftSec = 0] - 提前到期的秒数
     * @param {Boolean} [data.completeZero = false] - 是否个位数补全0
     * @param {String} [data.dType = ' '] - “天”后面的文字
     * @param {String} [data.hType = ' '] - “时”后面的文字
     * @param {String} [data.mType = ' '] - “分”后面的文字
     * @param {String} [data.sType = ' '] - “秒”后面的文字
     */
    function CountDown (data) {
      const _dTypeSend = (typeof data.dType !== 'undefined') && data.dType !== ''
      const _hTypeSend = (typeof data.hType !== 'undefined') && data.hType !== ''
      const _mTypeSend = (typeof data.mType !== 'undefined') && data.mType !== ''
      const _sTypeSend = (typeof data.sType !== 'undefined') && data.sType !== ''
      const _isElement = ((o) => {  /* 是否为Element */
        return typeof HTMLElement === 'object' ? o instanceof HTMLElement : !!o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
      })(data.dom)

      const _formatNum = (number) => {    /* 格式化数字格式 */
        if (number < 10 && data.completeZero) {
          return '0' + number
        } else {
          return number.toString()
        }
      }

      const _SetInterval = function (func, millisecond) {  /* 周期执行 */
        let _setIntervalId

        if (typeof func === 'function') {
          _setIntervalId = setTimeout(function self () {
            _setIntervalId = setTimeout(self, millisecond)

            func()
          }, millisecond)
        }

        this.stop = () => {
          clearTimeout(_setIntervalId)
        }
      }

      const _print = (time) => {  /* 输出 */
        const day = _formatNum(Math.floor((time / (24 * 60 * 60))))
        const hour = _formatNum(Math.floor((time / (60 * 60)) % 24))
        const minute = _formatNum(Math.floor((time / 60) % 60))
        const second = _formatNum(time % 60)
        let text

        if (day != 0 || _dTypeSend) {
          text = day + data.dType + hour + data.hType + minute + data.mType + second + data.sType
        } else if (hour != 0 || _hTypeSend) {
          text = hour + data.hType + minute + data.mType + second + data.sType
        } else if (minute != 0 || _mTypeSend) {
          text = minute + data.mType + second + data.sType
        } else {
          text = second + data.sType
        }

        if (_isElement) {
          data.dom.innerHTML = text
        } else {
          console.log(text)
        }
      }

      if (!_dTypeSend) {
        data.dType = ' '
      }
      if (!_hTypeSend) {
        data.hType = ' '
      }
      if (!_mTypeSend) {
        data.mType = ' '
      }
      if (!_sTypeSend) {
        data.sType = ''
      }

      /* 初始化时就输出一遍 */
      _print(Math.round((data.deadline - Date.now()) / 1000))

      const obj = new _SetInterval(() => {
        const time = Math.round((data.deadline - Date.now()) / 1000)

        if (time < (data.leftSec || 0)) {
          obj.stop()
          if (typeof data.callback === 'function') {
            data.callback()
          }
          return
        }

        _print(time)
      }, 1000)

      this.stop = obj.stop
    }


    /* 使用测试 */
    var a = new CountDown({
      deadline: Date.now() + 10000,
      dom: document.getElementById('j-test'),
      callback: () => {
        console.log('完成')
      },
      leftSec: 1,
      completeZero: false,
      dType: '',
      hType: '小时',
      mType: '分',
      sType: '秒'
    })

    // a.stop();
    ```
2. 分开输出

    ```javascript
    /**
     * 显示倒计时，单独输出每一个位数（秒个位、秒十位、分个位、分十位、时个位、时十位、天）
     * @constructor
     * @param {Number} deadline - 到期的时间戳
     * @param {Function} [callback] - 到点后的回调函数
     * @param {Array} [DOMList] - 展示的DOM集合，前7个项有效（若存在，则从最小的时间开始展示；若不存在，则console.log）
     */
    function CountDown ({ deadline, callback = () => {}, DOMList = [] } = {}) {
      /* 周期执行 */
      const SetInterval = function (func, millisecond) {
        let setIntervalId

        if (typeof func === 'function') {
          setIntervalId = setTimeout(function self () {
            setIntervalId = setTimeout(self, millisecond)

            func()
          }, millisecond)
        }

        this.stop = () => {
          clearTimeout(setIntervalId)
        }
      }

      /* 秒数 -> 天、时、分、秒 */
      const formatSeconds = (seconds) => {
        const secondArr = (seconds % 60).toString().split('')
        const secondObj = {
          second0: secondArr.pop(), // 秒的个位数
          second00: secondArr.pop() || '0'  // 秒的十位数
        }

        const minuteArr = (Math.floor(seconds / 60) % 60).toString().split('')
        const minuteObj = {
          minute0: minuteArr.pop(), // 分的个位数
          minute00: minuteArr.pop() || '0'  // 分的十位数
        }

        const hourArr = (Math.floor(seconds / 3600) % 24).toString().split('')
        const hourObj = {
          hour0: hourArr.pop(), // 时的个位数
          hour00: hourArr.pop() || '0'  // 时的十位数
        }

        const dayObj = {
          day: (Math.floor(seconds / (3600 * 24))).toString() // 天的所有
        }

        return { ...secondObj, ...minuteObj, ...hourObj, ...dayObj }
      }

      const timeMapDom = [ // 映射 DOM和时间 的顺序
        'second0',  // 第一个DOM -> 'second0'
        'second00',
        'minute0',
        'minute00',
        'hour0',
        'hour00',
        'day'
      ]

      /* 输出 */
      const print = (time) => {
        const timeObj = formatSeconds(time)

        if (DOMList.length > 0) {
          DOMList.map((value, index) => { // 仅输出有给DOM展示的内容，多余的时间丢弃
            requestAnimationFrame(() => {
              value.innerText = timeObj[timeMapDom[index]]
            })
          })
        } else {
          console.log(timeObj)
        }
      }

      // 初始化时就输出一遍
      print(Math.round((deadline - Date.now()) / 1000))

      // 每秒输出一遍
      const obj = new SetInterval(() => {
        const time = Math.round((deadline - Date.now()) / 1000)

        if (time < 0) {
          obj.stop()
          if (typeof callback === 'function') {
            callback()
          }
        } else {
          print(time)
        }
      }, 1000)

      this.stop = obj.stop
    }


    /* 使用测试 */
    var a = new CountDown({
      deadline: Date.now() + 10000,
      callback: function () {
        console.log('完成')
      },
      DOMList: [
        document.getElementById('j-7'),
        document.getElementById('j-6'),
        document.getElementById('j-5'),
        document.getElementById('j-4'),
        document.getElementById('j-3'),
        document.getElementById('j-2'),
        document.getElementById('j-1')
      ].slice(0, Math.floor(Math.random() * 8))  // 0~7
    })

    // a.stop();
    ```

>可以使用[moment](https://github.com/moment/moment/)或[date-fns](https://github.com/date-fns/date-fns)格式化时间。

### *原生JS*多异步返回后才执行总回调函数（利用jQuery的`$.ajax`）
```javascript
/**
 * 异步函数都成功返回后，执行func
 * @param {Function} func
 * @param {...String} url - AJAX请求的地址
 */
function multiCallback(func, url) {
    if (typeof func === 'function' && arguments.length >= 2) {
        var urlLength = arguments.length - 1,
            handle = function () {
                var self = arguments.callee;

                if (self.count === urlLength) {
                    func.call(undefined, self.result);
                }
            };

        handle.count = 0;
        handle.result = {};

        for (var i = 1; i <= urlLength; i++) {
            (function (url) {
                $.ajax({
                    url: url,
                    dataType: 'json',
                    data: {}
                    /*,
                     // Zepto默认：没有deferred的对象，用参数模式代替
                     success: function (data) {
                         handle.result[url] = data;
                         handle.count += 1;
                         handle();
                     }
                    */
                }).done(function (data) {
                    handle.result[url] = data;
                    handle.count += 1;
                    handle();
                });
            }(arguments[i]));
        }
    } else {

        return false;
    }
}
```
>1. 可以使用Promise对象或`async-await`方法实现。
>2. 可以使用jQuery的Deferred对象`$.when($.ajax()...).done(成功后方法)`，完全替代。

### *原生JS*对象合二为一（改变第一个参数）
```javascript
function extend(target, options) {
    var copy, name;

    for (name in options) {
        copy = options[name];

        if (Object.prototype.toString.call(copy) === '[object Array]') {
            target[name] = arguments.callee([], copy);
        } else if (Object.prototype.toString.call(copy) === '[object Object]') {
            target[name] = arguments.callee(target[name] ? target[name] : {}, copy);
        } else {
            target[name] = options[name];
        }
    }

    return target;
}
```
>1. 可以使用jQuery的`$.extend(对象1, 对象2)`，完全替代。
>2. 可以使用[deepmerge](https://github.com/KyleAMathews/deepmerge)，完全替代。

### *原生JS*深复制
```javascript
/**
 * 深复制。针对：基本数据类型、数组、基本对象、正则对象、方法（方法的属性不再深复制）
 * @param {*} obj - 被深复制的内容
 * @returns {*} - 深复制后的内容
 */
function deepCopy (obj) {
  if (typeof obj === 'function') {  // Function
    const newFunc = eval('(' + obj.toString() + ')');
    for (let key in obj) {
      newFunc[key] = obj[key]; // 避免“调用栈溢出”，方法的属性不再深复制
    }

    return newFunc;
  } else if (typeof obj !== 'object' || obj === null) { // 基本数据类型

    return obj;
  } else if (Object.prototype.toString.call(obj) === '[object RegExp]') { // RegExp
    const g = obj.global ? 'g' : '';
    const m = obj.multiline ? 'm' : '';
    const i = obj.ignoreCase ? 'i' : '';

    return new RegExp(obj.source, g + i + m);
  } else if (Array.isArray(obj)) {  // Array

    return obj.map(() => deepCopy(obj));  // 多层深复制，容易产生“调用栈溢出”
  } else {  // Object
    const newObj = {};
    for (let key in obj) {
      newObj[key] = deepCopy(obj[key]); // 多层深复制，容易产生“调用栈溢出”
    }

    return newObj;
  }
}


/* 使用测试 */
var a = {
  b: [],
  c: null,
  d: undefined,
  e: Symbol('e'),
  f: {},
  g: {
    h1: function () {},
    h2: function h () {}
  },
  i: /g/gim
};
a.g.h1.j = [1, 2];

var b = deepCopy(a);
console.log(b);
```
>1. 可以使用jQuery的`$.extend(true, {}, 被复制对象)`，完全替代。
>2. 可以使用lodash的`_.cloneDeep(被复制对象)`，完全替代。

### *原生JS*通过类名获取DOM
```javascript
/**
 * 通过类名获取一组元素
 * @param {String} className - 类名
 * @param {Object} [parentDom = document] - 父级DOM
 * @returns {Array} - 类名匹配的DOM数组
 */
function getElementsByClassName(className, parentDom) {
    parentDom = parentDom || document;

    className = className.replace(/(^\s+)|(\s+$)/g, ''); // 去除前后空格

    if (document.getElementsByClassName) {  /* ie9+ */

        return parentDom.getElementsByClassName(className);
    } else if (document.querySelectorAll) { /* ie8+ */

        className = '.' + className.split(/\s+/).join('.');

        return parentDom.querySelectorAll(className);
    } else {
        var doms = parentDom.getElementsByTagName('*'),
            nameArr = className.split(/\s+/),
            nameLen = nameArr.length,
            domArr = [],
            i, len, j, regex;

        for (i = 0, len = doms.length; i < len; i++) {  /* 遍历所有标签 */
            for (j = 0; j < nameLen; j++) { /* 遍历类名 */
                regex = new RegExp('\\b' + nameArr[j] + '\\b');

                if (!regex.test(doms[i].className)) {
                    break;
                }
            }

            if (j >= nameLen) {
                domArr.push(doms[i]);
            }
        }

        return domArr;
    }
}
```
>可以使用jQuery的`$('.类名')`，完全替代。

### *原生JS*操作cookie
```javascript
var cookieFuc = {

    /**
     * 读取一个cookie的值
     * @param {String} key - 名
     * @returns {String|Null} - 值 或 null
     */
    getItem: function (key) {
        if (!key) {

            return null;
        } else {

            return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
        }
    },

    /**
     * 新建或更新一个cookie
     * @param {String} key - 名
     * @param {String} value - 值
     * @param {Number|Date|String|Infinity} [deadline] - 过期时间。默认：关闭浏览器后过期
     * @param {String} [path] - 路径。默认：当前文档位置的路径
     * @param {String} [domain] - 域名。默认：当前文档位置的路径的域名部分
     * @param {Boolean} [secure] - 是否“仅通过https协议传输”。默认：否
     * @returns {Boolean} - 操作成功或失败
     */
    setItem: function (key, value, deadline, path, domain, secure) {
        if (!key || /^(?:expires|max\-age|path|domain|secure)$/i.test(key)) {

            return false;
        } else {
            var expires = '';

            if (deadline) {
                switch (deadline.constructor) {
                    case Number:
                        expires = deadline === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + deadline;
                        break;
                    case String:
                        expires = '; expires=' + deadline;
                        break;
                    case Date:
                        expires = '; expires=' + deadline.toUTCString();
                        break;
                }
            }

            document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + expires + (domain ? '; domain=' + domain : '') + (path ? '; path=' + path : '') + (secure ? '; secure' : '');

            return true;
        }
    },

    /**
     * 删除一个cookie
     * @param {String} key - 名
     * @param {String} [path] - 路径。默认：当前文档位置的路径
     * @param {String} [domain] - 域名。默认：当前文档位置的路径的域名部分
     * @returns {Boolean} - 操作成功或失败
     */
    removeItem: function (key, path, domain) {
        if (!key || !this.hasItem(key)) {

            return false;
        } else {
            document.cookie = encodeURIComponent(key) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + ( domain ? '; domain=' + domain : '') + ( path ? '; path=' + path : '');

            return true;
        }
    },

    /**
     * 检查一个cookie是否存在
     * @param {String} key - 名
     * @returns {Boolean} - 存在与否
     */
    hasItem: function (key) {
        if (!key) {

            return false;
        } else {

            return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
        }
    },

    /**
     * 返回cookie名字的数组
     * @returns {Array} - 名的数组 或 []
     */
    listItems: function () {
        if (document.cookie === '') {

            return [];
        } else {
            var keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/),
                i, len;

            for (i = 0, len = keys.length; i < len; i++) {
                keys[i] = decodeURIComponent(keys[i]);
            }

            return keys;
        }
    },

    /**
     * 清空所有cookie
     * @returns {Boolean} - 操作成功或失败
     */
    clear: function () {
        if (document.cookie === '') {

            return false;
        } else {
            var keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/),
                i, len;

            for (i = 0, len = keys.length; i < len; i++) {
                this.removeItem(decodeURIComponent(keys[i]));
            }

            return true;
        }
    }
};
```
>参考：[MDN:cookie](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie#一个小框架：一个完整支持unicode的cookie读取写入器)。

>可以使用[js-cookie](https://github.com/js-cookie/js-cookie)，完全替代。

### *原生JS*防抖函数
>来自：[underscore](https://github.com/jashkenas/underscore)。

```javascript
/**
 * 函数连续调用时，间隔时间必须大于或等于wait，func才会执行
 * @param {Function} func - 传入函数
 * @param {Number} wait - 函数触发的最小间隔
 * @param {Boolean} [immediate] - 设置为ture时，调用触发于开始边界而不是结束边界
 * @returns {Function} - 返回客户调用函数
 */
function debounce(func, wait, immediate) {
    if (typeof Date.now !== 'function') {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    var timeout, args, context, timestamp, result;

    var later = function () {
        // 据上一次触发时间间隔
        var last = Date.now() - timestamp;

        // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;

            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args);

                if (!timeout) {
                    context = args = null;
                }
            }
        }
    };

    return function () {
        context = this;
        args = arguments;
        timestamp = Date.now();

        var callNow = immediate && !timeout;

        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }

        return result;
    };
}


/* 使用测试 */
var a = debounce(function () {  // 不要使用箭头函数，因为实现代码中有用`apply`
    console.log(1);
}, 1000);

$(window).on('scroll', a);
```
>可以使用[lodash](https://github.com/lodash/lodash)或[underscore](https://github.com/jashkenas/underscore)，完全替代。

### *原生JS*节流函数
>来自：[underscore](https://github.com/jashkenas/underscore)。

```javascript
/**
 * 函数连续调用时，func在wait时间内，执行次数不得高于1次
 * @param {Function} func - 传入函数
 * @param {Number} wait - 函数触发的最小间隔
 * @param {Object} [options] - 如果想忽略开始边界上的调用，传入{leading: false}；如果想忽略结尾边界上的调用，传入{trailing: false}
 * @returns {Function} - 返回客户调用函数
 */
function throttle(func, wait, options) {
    if (typeof Date.now !== 'function') {
        Date.now = function () {
            return new Date().getTime();
        };
    }

    var context, args, result;
    var timeout = null;
    var previous = 0;   // 上次执行时间点

    if (!options) {
        options = {};
    }

    // 延迟执行函数
    var later = function () {
        // 若设定了开始边界不执行选项，上次执行时间始终为0
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };

    return function () {
        var now = Date.now();

        // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
        if (!previous && options.leading === false) {
            previous = now;
        }

        // 延迟执行时间间隔
        var remaining = wait - (now - previous);

        context = this;

        args = arguments;

        // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口 || remaining大于时间窗口wait，表示客户端系统时间被调整过
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) { // 如果延迟执行不存在，且没有设定结尾边界不执行选项
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}


/* 使用测试 */
var a = throttle(function () {  // 不要使用箭头函数，因为实现代码中有用`apply`
    console.log(1);
}, 1000);

$(window).on('scroll', a);
```

>可以使用[lodash](https://github.com/lodash/lodash)或[underscore](https://github.com/jashkenas/underscore)，完全替代。

---
## Polyfill

### *原生JS*`requestAnimationFrame`和`cancelAnimationFrame`的Polyfill
>来自：[rAF.js](https://gist.github.com/paulirish/1579671)。

```javascript
(function () {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'],
        x;

    for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);

            lastTime = currTime + timeToCall;

            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());
```

### *原生JS*`Date.now`的Polyfill
```javascript
if (typeof Date.now !== 'function') {
    Date.now = function () {
        return new Date().getTime();
    };
}
```
>`Date.now()`相对于`new Date().getTime()`及其他方式，可以避免生成不必要的`Date`对象，更高效。

### *原生JS*`Object.create`的Polyfill
>来自：[MDN:Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#Polyfill)。

```javascript
if (typeof Object.create !== 'function') {
    Object.create = (function () {
        function Temp() {}

        var hasOwn = Object.prototype.hasOwnProperty;

        return function (O) {
            if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
            }

            Temp.prototype = O;
            var obj = new Temp();
            Temp.prototype = null; // 不要保持一个 O 的杂散引用（a stray reference）...

            if (arguments.length > 1) {
                var Properties = Object(arguments[1]);

                for (var prop in Properties) {
                    if (hasOwn.call(Properties, prop)) {
                        obj[prop] = Properties[prop];
                    }
                }
            }

            return obj;
        };
    })();
}
```

### *原生JS*`Array.isArray`的Polyfill
>来自：[MDN:Array.isArray](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray#Polyfill)。

```javascript
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}
```

### *原生JS*`Array.prototype.map`的Polyfill
>来自：[MDN:Array.prototype.map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Compatibility)。

```javascript
if (!Array.prototype.map) {
    Array.prototype.map = function (callback, thisArg) {
        var T, A, k;

        if (this == null) {
            throw new TypeError(' this is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (Object.prototype.toString.call(callback) != '[object Function]') {
            throw new TypeError(callback + ' is not a function');
        }

        if (thisArg) {
            T = thisArg;
        }

        A = new Array(len);

        k = 0;

        while (k < len) {
            var kValue, mappedValue;

            if (k in O) {

                kValue = O[k];

                mappedValue = callback.call(T, kValue, k, O);

                A[k] = mappedValue;
            }

            k += 1;
        }

        return A;
    };
}
```

### *原生JS*`Function.prototype.bind`的Polyfill
>来自：[MDN:Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Compatibility)。

```javascript
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis || this,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
```

### *原生JS*`String.prototype.trim`的Polyfill
>来自：[MDN:String.prototype.trim](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#兼容旧环境)。

```javascript
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
```

### *原生JS*`String.prototype.repeat`的Polyfill
>来自：[MDN:String.prototype.repeat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/repeat#填充)。

```javascript
if (!String.prototype.repeat) {
  String.prototype.repeat = function (count) {
    'use strict';
    if (this == null) {
      throw new TypeError('can\'t convert ' + this + ' to object');
    }
    var str = '' + this;
    count = +count;
    if (count != count) {
      count = 0;
    }
    if (count < 0) {
      throw new RangeError('repeat count must be non-negative');
    }
    if (count == Infinity) {
      throw new RangeError('repeat count must be less than infinity');
    }
    count = Math.floor(count);
    if (str.length == 0 || count == 0) {
      return '';
    }
    // 确保 count 是一个 31 位的整数。这样我们就可以使用如下优化的算法。
    // 当前（2014年8月），绝大多数浏览器都不能支持 1 << 28 长的字符串，所以：
    if (str.length * count >= 1 << 28) {
      throw new RangeError('repeat count must not overflow maximum string size');
    }
    var rpt = '';
    for (; ;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    return rpt;
  };
}
```

### *原生JS*`Number.isNaN`的Polyfill
>来自：[MDN:Number.isNaN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill)。

```javascript
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && isNaN(value);
};
```

### *原生JS*`Number.isFinite`的Polyfill
>来自：[MDN:Number.isFinite](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isFinite#Polyfill)。

```javascript
Number.isFinite = Number.isFinite || function (value) {
  return typeof value === 'number' && isFinite(value);
};
```

### *原生JS*`Number.isInteger`的Polyfill
>来自：[MDN:Number.isInteger](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger#Polyfill)。

```javascript
Number.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};
```

### *原生JS*`Number.isSafeInteger`的Polyfill
>来自：[MDN:Number.isSafeInteger](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger#Polyfill)。

```javascript
Number.isSafeInteger = Number.isSafeInteger || function (value) {
  return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
};
```
