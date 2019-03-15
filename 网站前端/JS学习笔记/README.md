# JS学习笔记

## 目录
1. [DOM操作](#dom操作)

    1. [获取位置信息](#获取位置信息)
    1. [节点与视口距离关系](#节点与视口距离关系)
    1. [判断滚动定位](#判断滚动定位)
    1. [进行文档滚动](#进行文档滚动)
    1. [DOM相对位置](#dom相对位置)
    1. [`Node`与`Element`](#node与element)
    1. [`attribute`与`property`](#attribute与property)
    1. [jQuery相关](#jquery相关)
1. [事件相关](#事件相关)

    1. [事件绑定](#事件绑定)
    1. [事件流（event flow）](#事件流event-flow)
    1. [WAP端相关](#wap端相关)
1. [编程技巧](#编程技巧)

    1. [函数模板](#函数模板)
    1. [JS代码风格规范（coding style guide）](#js代码风格规范coding-style-guide)
    1. [编程实践（programming practices）](#编程实践programming-practices)
    1. [函数防抖、函数节流](#函数防抖函数节流)
    1. [自执行匿名函数（拉姆达，λ，lambda）](#自执行匿名函数拉姆达λlambda)
    1. [Hybrid App相关](#hybrid-app相关)
    1. [Tips](#tips)
1. [功能归纳](#功能归纳)

    1. [判断数据类型](#判断数据类型)
    1. [跨域请求](#跨域请求)
    1. [Web Storage && cookie](#web-storage--cookie)
    1. [错误处理机制](#错误处理机制)
    1. [预加载](#预加载)
    1. [循环遍历](#循环遍历)
    1. [判断对象、方法是否定义](#判断对象方法是否定义)
    1. [javascript伪协议](#javascript伪协议)
1. [性能原理](#性能原理)

    1. [JS的预编译](#js的预编译)
    1. [函数](#函数)
    1. [闭包（closure）](#闭包closure)
    1. [原型](#原型)
    1. [继承](#继承)
    1. [内存机制](#内存机制)
    1. [深复制（拷贝）实现思路](#深复制拷贝实现思路)
    1. [内存泄漏](#内存泄漏)
    1. [数据类型转换](#数据类型转换)
    1. [`||`和`&&`](#和)
    1. [事件循环（event loop）](#事件循环event-loop)
    1. [定时器 && 重绘函数](#定时器--重绘函数)
    1. [数组的空位（hole）](#数组的空位hole)

><details>
><summary>约定</summary>
>
>1. `dom`为JS对象，`$dom`为jQuery（或Zepto）对象。
>2. 大部分情况下，jQuery内容适用于Zepto。
></details>

---
## DOM操作
>以纵轴为例。

### 获取位置信息
1. DOM节点

    1. 节点高度：

        1. height+padding：

            `dom.clientHeight`

            或

            `$dom.innerHeight()`
        2. height+padding+border：

            `dom.offsetHeight`

            或

            `$dom.outerHeight()`
    2. 节点内容高度：

        `dom.scrollHeight`
    3. 节点内滚动距离：

        `dom.scrollTop`

        或

        `$dom.scrollTop()`
    4. 节点顶部相对视口顶部距离：

        `dom.getBoundingClientRect().top`

        或

        `$dom.offset().top + document.documentElement.clientTop - $(window).scrollTop()`

        >`document.documentElement.clientTop`：`<html>`的`border-top-width`数值。
    5. 节点顶部相对文档顶部距离（不包括~~文档的border~~）：

        `dom.getBoundingClientRect().top + (document.body.scrollTop || document.documentElement.scrollTop) - document.documentElement.clientTop`

        或

        `$dom.offset().top`
2. 文档和视口

    1. 视口高度：

        `window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight`

        或

        `$(window).height()`
    2. 文档内容高度：

        `document.body.scrollHeight`

        或

        `$(document).height()`
    3. 文档滚动高度：

        `document.body.scrollTop || document.documentElement.scrollTop`

        或

        `$(window).scrollTop()`

>1. 还可以使用[`IntersectionObserver`](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/标准库文档.md#intersectionobserver)判断节点和视口（或祖先节点）相交程度。
>2. Zepto没有`innerHeight`和`outerHeight`，改为`height`。

### 节点与视口距离关系
1. jQuery

    1. 节点**顶部**在**视口底部**以上

        `$dom.offset().top <= $(window).scrollTop() + $(window).height()`
    2. 节点**底部**在**视口顶部**以下

        `$dom.offset().top + $dom.outerHeight() >= $(window).scrollTop()`
    3. 节点在视口内

        以上`&&`结合。
2. 原生JS

    ><details>
    ><summary>视口高度</summary>
    >
    >`window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight`
    >
    >或
    >
    >`$(window).height()`
    ></details>

    1. 节点**顶部**在**视口底部**以上

        `dom.getBoundingClientRect().top <= 视口高度`
    2. 节点**底部**在**视口顶部**以下

        `dom.getBoundingClientRect().bottom >= 0`
    3. 节点在视口内

        以上`&&`结合。

    - [`IntersectionObserver`](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/标准库文档.md#intersectionobserver)判断节点和视口（或祖先节点）相交程度。

### 判断滚动定位
>也可以给底部（或顶部）放置一个标记节点，当这个节点的顶部在容器底部以上（或这个节点的底部在容器顶部以下）时为滚动到底部（或顶部）。

1. DOM节点

    1. 内容滚动到底部：

        `dom.offsetHeight + dom.scrollTop >= dom.scrollHeight`
    2. 内容滚动到顶部：

        `dom.scrollTop === 0`
2. 文档

    ><details>
    ><summary>视口高度、文档滚动高度、文档内容高度</summary>
    >
    >1. 视口高度:
    >
    >    `window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight`
    >
    >    或
    >
    >    `$(window).height()`
    >2. 文档滚动高度：
    >
    >    `document.body.scrollTop || document.documentElement.scrollTop`
    >
    >    或
    >
    >    `$(window).scrollTop()`
    >3. 文档内容高度：
    >
    >    `document.body.scrollHeight`
    >
    >    或
    >
    >    `$(document).height()`
    ></details>

    1. 滚动到底部：

        `视口高度 + 文档滚动高度 >= 文档内容高度`
    2. 滚动到顶部：

        `文档滚动高度 === 0`

### 进行文档滚动
1. 滚动到DOM进入视口：[`dom.scrollIntoView()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollIntoView)
2. #锚点
3. `document.body.scrollTop = document.documentElement.scrollTop = 纵轴坐标`

    >`document.body.scrollLeft = document.documentElement.scrollLeft = 横轴坐标`
4. `window.scroll/scrollTo(横轴坐标, 纵轴坐标)`

    >`window.scrollBy(相对横轴坐标, 相对纵轴坐标)`

### DOM相对位置
1. DOM点击事件的定位（原生JS）

    1. PC端`MouseEvent`

        `e.`（`e`为传入事件处理程序的第一个参数）或`window.event.`：

        1. `pageX/Y`（ie8-不支持）

            距离文档的左边缘/上边缘。
        2. `clientX/Y`

            距离浏览器窗口。
        3. `screenX/Y`

            距离屏幕。
        4. `offsetX/Y`

            距离目标元素自身填充边界。
        5. `movementX/Y`（ie、Safari不支持）

            （仅针对`mousemove`事件）相对于上一帧鼠标移动距离。
        6. `x/y`

            等价于：`clientX/Y`。
    2. WAP端`TouchEvent`

        `e.touches[0].`（`e`为传入事件处理程序的第一个参数）：

        1. `pageX/Y`
        2. `clientX/Y`
        3. `screenX/Y`
2. 相对偏移（jQuery）

    1. `$dom.offset()`

        返回：相对于文档的距离（可以设置）。
    2. `$dom.position()`

        返回：相对于**距离该元素最近的且被定位过的祖先元素**的距离。
    3. `$dom.offsetParent()`

        返回：相对于**距离该元素最近的且被定位过的祖先元素**的jQuery对象。
    4. `$dom.scrollLeft/Top()`

        返回：当前滚动条的位置（可以设置）。

### `Node`与`Element`

- Node根据`nodeType`属性区分节点类型：

    1. `1 === Node.ELEMENT_NODE`

        `Element`

        >`Element`继承了`Node`。
    2. `3 === Node.TEXT_NODE`

        `Element`的`文本`或`属性`
    3. `7 === Node.PROCESSING_INSTRUCTION_NODE`
    4. `8 === Node.COMMENT_NODE`

        注释
    5. `9 === Node.DOCUMENT_NODE`

        `document`
    6. `10 === Node.DOCUMENT_TYPE_NODE`

        文档类型节点，如：`<!DOCTYPE html>`
    7. `11 === Node.DOCUMENT_FRAGMENT_NODE`

        `DocumentFragment`
- [判断是否为`Node`、是否为`Element`](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js判断是否为node是否为element)

### `attribute`与`property`
- 在HTML标签里定义标签的`attributes`，一旦浏览器解析后，所有DOM节点会被创建成对象，每个DOM对象就拥有`properties`，因此：

    1. `attributes`：是HTML标签的属性。

        >`dom.attributes`能展示此DOM对象的所有`attribute`。
    2. `properties`：是DOM对象的属性。
- 当一个DOM节点为某个HTML标签所创建时，其大多数`properties`与对应`attributes`拥有相同或相近的名字，并不是一对一的关系：

    1. 有几个`property`是直接反映`attribute`（`rel`、`id`），而有一些则用稍微不同的名字也直接映射（`htmlFor`映射`for`，`className`映射`class`，`dataset`映射`data-`集合）

        获取该`property`即等于读取其对应的`attribute`值，而设置该`property`即为`attribute`赋值。
    2. 很多`property`所映射的`attribute`是带有**限制**或**变动**的（`src`、`href`、`disabled`、`multiple`）

        1. `type`的值被限制在已知值（即`<input>`的合法类型，如：`text`、`password`）。
        2. `value`（`property`）并不会映射`value`（`attribute`），而是`<input>`的当前值。

            当用户手动更改输入框的值，`value`（`property`）会反映该改变；`value`（`attribute`）还是原始值，也就是`defaultChecked`（`property`）。

### jQuery相关
1. 当变量是jQuery对象时，可用`$`作为开头命名，利于与普通变量区分

    ```javascript
    // e.g.
    var num = 1;
    var dom = $('div').get();
    var $dom = $('div');
    ```
2. 选择器
    1. `$('子','父') === $('父').find('子')`

        找到所有父级，若子级在此父级后面，则选择。
    2. ~~`$('父 子')`~~（效率低）

        找到所有子级，然后向前找出有父级的，则选择（与CSS相同的查询方式）。
3. 判断选择器选择到空内容

    选择器选取的内容返回数组（空内容返回`[]`），所以`if($(...)) {}`永远成立。因此用以下方法：

    1. `if($(...).length > 0) {}    // 若无则为0`
    2. `if($(...)[0]) {}    // 若无则为undefined`
4. `on`绑定效率（事件代理、事件委托）

    >1. 事件代理：把原本需要绑定的事件委托给祖先元素，让祖先元素担当事件监听的职务。
    >
    >    1. 原理：DOM元素的事件冒泡。
    >    2. 好处：提高性能，避免~~批量绑定~~。
    >2. `paste`、`reset`不支持事件代理，仅能够直接绑定；事件代理不能用于SVG。

    >e.g. `$(eventHandler).on(event, selector, func);`

    1. 确定绑定内容：

        1. 执行`on`方法的时刻，把所有满足条件的DOM对象安装指定的应用逻辑**func**，成为**eventHandler**；
        2. 有且仅有这些eventHandler绑定成功；之后动态生成的且满足条件的DOM不再安装；对已生效的eventHandler操作DOM（如：增删类名）不会使绑定内容失效（除非删除DOM或解绑事件）；
        3. 在eventHandler内动态增删的**selector**都可以由条件判定是否生效绑定内容（因为事件是绑定在eventHandler上，而不是selector上）。
    2. 绑定的eventHandler距离selector越近，效率越高。因此虽然把selector都绑定在`$(document)`上能够避免增删节点对事件绑定造成的影响，但效率会下降。

        >每次触发事件，jQuery会比较从目标元素（`target`）到eventHandler路径中每一个元素上所有该类型的事件（冒泡）。
5. 判断是否加载成功，不成功则加载其他文件地址

    ```html
    <script>
        window.jQuery || document.write('<script src="其他文件地址"><\/script>');
    </script>
    ```
6. `$dom.focus()`

    1. 直接调用，光标停留在文本开头或上一次光标停留的地方。
    2. 先清空文本再`focus`然后再添加文本，光标停留在文本结尾。

    [JSFiddle demo](https://jsfiddle.net/realgeoffrey/zep4cr3p/)
7. 判断一个标签的动态属性（DOM对象的`property`）

    >以`<input>`的`checked`为例，类似的特性还有`selected`、`disabled`、`value`等，但[每个`attribute-property`映射关系略有差别](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#attribute与property)。

    ```html
    <input type="checkbox" checked="checked" id="j-input">

    <script>
      var $dom = $('#j-input');
      var dom = $dom.get(0);

      // ①
      // 共通的值，存储在jQuery内部
      // 获取：真实效果的值
      // 设置：可以改变页面上显示效果、不会改变HTML上属性的值
      dom.checked; // 设置 dom.checked = true/false
      $dom.prop('checked'); // 设置 $dom.prop('checked', true/false);

      // ②
      // 获取：HTML上属性的值
      // 设置：若没有使用①设置值，则可以控制①结果、可以改变页面上显示效果；
      //    若使用①设置过，则仅设置HTML上属性的值、不会真的改变显示效果
      $dom.attr('checked'); // 设置 $dom.attr('checked', true/false);

      // ③
      // 获取：HTML上属性的值
      // 设置：若没有使用①设置值，则可以仅把关闭设置为打开、无法把打开设置为关闭；
      //    若使用①设置过，则仅设置HTML上属性的值、不会真的改变显示效果
      dom.getAttribute('checked'); // 设置 dom.setAttribute('checked', 值)
    </script>
    ```

    - 若要判断、获取或设置，建议仅使用：

        1. 判断、获取：`dom.checked`，设置：`dom.checked = true/false`。
        2. 判断、获取：`$dom.prop('checked')`，设置：`$dom.prop('checked', true/false)`。
        3. 判断、获取：`$dom.is(':checked')`。
8. `$dom.data()`仅在第一次使用后（获取或设置）获取HTML上的值或设置到jQuery内部（不会改变HTML上属性的值），之后不再因为HTML改变而改变，也无法修改HTML上属性的值。

    `$dom.removeData()`删除绑定的数据后，再使用`$dom.data()`则重新获取HTML上的值或设置到jQuery内部。

    >因为`<object>`、`<embed>`、`<applet>`不能绑定数据，所以它们不能使用`.data()`。
9. jQuery操作CSS样式：

    1. 设置大部分CSS样式时，不写单位默认：`px`；对于`px`单位的样式可以设置相对值`'+=数字'`或`'-=数字'`：

        `.css()`、`.width()`、`.height()`、`.animate()`。

        >`jQuery.cssNumber`保存着没有默认单位的属性名，可设置为`false`尝试添加默认单位。
    2. 获得样式时，都是换算成`px`（若可以换算）。

        >1. `.height/innerHeight/outerHeight()`返回`数字`。
        >2. `.css('height')`返回带`px`的`字符串`。
10. `$.proxy()`和原生JS的`Function.prototype.bind`类似，返回一个确定了`this`（和参数）的新方法

    >新方法的参数填补在原函数去除已设置形参的后面（与`Function.prototype.bind`一致）。

    <details>
    <summary>额外的，jQuery确保即使绑定的函数经过<code>$.proxy()</code>处理，依然可以用原先的函数来正确地取消绑定</summary>

    ```javascript
    // e.g.
    var obj = {
      test: function () {
        console.log(this);
        $('#test').off('click', obj.test);  // 可以解绑$.proxy(obj, 'test')
      }
    };

    $('#test').on('click', $.proxy(obj, 'test'));
    ```
    </details>

---
## 事件相关

>1. 事件：用户或浏览器执行某种动作，如：`click`、`load`。
>2. 事件处理程序（事件处理函数、事件监听器）：当某个事件触发之后响应的函数。
>3. 事件对象：触发DOM事件产生的对象，包含与事件有关的所有信息。

### 事件绑定

><details>
><summary>约定</summary>
>
>1. 以点击事件`click`为例。
>2. `funcAttr`、`func0`、`funcIe`、`func2`为已经定义的方法。
></details>

1. 原生JS

    >参考：[JavaScript 事件绑定机制](http://www.cnblog.me/2016/05/08/javascript-event-binding/)、[理解Javascript中的事件绑定与事件委托](https://segmentfault.com/a/1190000006667581)。

    1. HTML事件处理程序（冒泡）

        `<div onclick="funcAttr()"></div>`（不能同个事件监听多个处理程序）

        <details>
        <summary>移除或修改绑定事件</summary>

        1. 事件处理程序设置为空方法或修改方法：

            `funcAttr = function () {};`、`funcAttr = function () {/* 修改方法 */};`
        2. 移除或修改DOM元素的事件绑定属性：

            `dom.removeAttribute('onclick');`、`dom.setAttribute('onclick', '(function () {/* 修改方法 */} ())');`
        </details>

    >本质上，DOM0级事件处理程序等于HTML事件处理程序。因此可以互相覆盖、移除绑定的事件处理程序。

    2. DOM0级事件处理程序（冒泡）

        `dom.onclick = func0;`（不能同个事件监听多个处理程序）

        <details>
        <summary>移除或修改绑定事件</summary>

        `dom.onclick = null;`、`dom.onclick = function () {/* 修改方法 */};`
        </details>
    3. IE事件处理程序（冒泡）

        `dom.attachEvent('onclick', funcIe);`（可监听多个，按绑定顺序的逆序触发；需参数完全对应才能解绑定；无法解绑匿名函数）

        <details>
        <summary>移除绑定事件</summary>

        `dom.detachEvent('onclick', funcIe);`
        </details>
    4. DOM2级事件处理程序（冒泡、捕获）

        >ie8-不兼容。

        `dom.addEventListener('click', func2, false);`（可监听多个，按绑定顺序触发，需参数完全对应才能解绑定；无法解绑匿名函数）

        <details>
        <summary>移除绑定事件</summary>

        `dom.removeEventListener('click', func2, false);`
        </details>

    - [兼容各浏览器的绑定、解绑事件](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js绑定解绑事件)
2. jQuery（冒泡）

    >来自：[jQuery:Events](http://api.jquery.com/category/events/)。

    1. `on`（`one`类似）

        >jQuery的事件系统需要DOM元素能够通过元素的属性附加数据，使事件可以被跟踪和传递。因为`<object>`、`<embed>`、`<applet>`不能绑定数据，所以它们不能进行jQuery的事件绑定。

        <details>
        <summary>移除绑定事件</summary>

        `off`
        </details>
    2. <details>

        <summary>其他</summary>

        1. 一系列`on`的事件绑定快捷方法:

            `click`、`dblclick`、`contextmenu`、`keydown`、`keyup`、`keypress`、`mousedown`、`mouseup`、`mousemove`、`mouseenter`、`mouseleave`、`mouseover`、`mouseout`、`hover`、`blur`、`focus`、`focusin`、`focusout`、`select`、`change`、`submit`、`ready`、`resize`、`scroll`
        2. 由`on`或`off`实现的：（废除或不建议）

            1. 绑定：~~`bind`~~、~~`live`~~、~~`delegate`~~
            2. 解绑：~~`unbind`~~、~~`die`~~、~~`undelegate`~~
        </details>

- 移除绑定：

    1. HTML事件处理程序、DOM0级事件处理程序，用赋值覆盖解绑。
    2. `attachEvent/detachEvent`，必须一一对应具体的**handle**进行解绑。**handle**是匿名函数无法解绑。

        ><details>
        ><summary>ie的<strong>handle</strong>中<code>this</code>指向<code>window</code>的兼容方式</summary>
        >
        >1. 处理**handle**（传入方法不改变）
        >
        >    `function () {funcIe.apply(dom, arguments);}`（无法解绑）。
        >2. 修改`funcIe`
        >
        >    1. `funcIe.bind(dom)`（需要`bind`的[polyfill](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/废弃代码/README.md#原生jsfunctionprototypebind的polyfill)）。
        >    2. 使用`window.event`定义~~this~~
        >
        >        ```javascript
        >        function funcIe(e) {
        >            e = e || window.event;                 // 事件对象
        >            var _this = e.srcElement || e.target;  // 触发的DOM
        >
        >            /* funcIe代码 */
        >        }
        >        ```
        ></details>
    3. `addEventListener/removeEventListener`，必须一一对应具体的**handle**、**布尔值**进行解绑。**handle**是匿名函数无法解绑。
    4. jQuery的`on/off`（以及其他绑定解绑方法）：

        1. 写具体**handle**时解绑具体**handle**。
        2. 不写**handle**时解绑对象下某事件的所有方法。
        3. 还可以对事件添加**namespace**。
        4. 若要移除元素上所有的代理事件，而不移除任何非代理事件，使用特殊值`'**'`。

            e.g. `$dom.off('click', '**');   // 解绑$dom代理到子节点的click事件，但不解绑$dom自己的click事件`
- JS的自定义事件

    1. 原生JS：

        ```javascript
        // 创建自定义事件
        var event = new Event('事件名');   // 新
        // 或：var event = document.createEvent('Event'); event.initEvent('事件名', true, true);   // 旧

        // 监听自定义事件
        dom.addEventListener('事件名', function (e) { ... }, false);

        // 触发
        dom.dispatchEvent(event);
        ```
    2. `jQuery`：

        ```javascript
        $('选择器').on('自定义事件', function () {});
        $('选择器').trigger('自定义事件');
        ```

### 事件流（event flow）
1. 类型：

    1. 捕获（capture）：

        从外层元素到目标元素的过程，
    2. 冒泡（bubbling）：

        >事件都有`bubbles`属性，判断是否冒泡。W3定义的[DOM-Level-3-Events](https://www.w3.org/TR/DOM-Level-3-Events/)可查冒泡情况：；[media相关事件](https://html.spec.whatwg.org/multipage/media.html#mediaevents)均不冒泡。

        从目标元素到外层元素的过程。
2. DOM标准事件流触发顺序：

    ![事件流图](./images/event-flow-1.png)

    1. 先按**捕获**顺序依次执行节点注册**捕获**的事件。
    2. 抵达目标

        1. 依据注册顺序执行事件处理程序，分为捕获、冒泡两种抵达类型。浏览器默认行为：冒泡抵达类型（在捕获、冒泡的事件处理程序执行之后才执行默认行为）。
        2. 可设置不再冒泡或不执行浏览器默认行为。
        3. 建议仅在**需要在事件到达目标之前截获它的情况**才设置捕获的事件处理程序。

        >DOM2规范要求：实际的目标不接收~~捕获~~事件，仅接收冒泡事件。但浏览器的实现却都让实际目标接收捕获和冒泡事件。
    3. 再按**冒泡**顺序依次执行节点注册**冒泡**的事件。

    >ie10-的DOM事件流只有冒泡，没有~~捕获~~。

### WAP端相关
1. WAP端点透bug

    >1. PC端没有 ~~`touch`~~ 事件。
    >2. WAP端有`touchstart`、`touchmove`、`touchend`、`touchcancel`等`touch`事件。
    >3. Zepto用`touch`一系列事件封装了`tap`事件。

    1. 点透现象：

        使用Zepto的`tap`事件绑定（或原生JS的`touchstart`绑定）后，若此元素在触摸事件发生后离开原始位置（CSS或JS），同一位置正好有一个DOM元素绑定了`click`事件或`<a>`，则会出现“点透”bug（触发底下元素的`click`事件）。
    2. 原因

        >历史原因：WAP端增加快速双击缩放和恢复功能。由于当用户一次点击屏幕之后，浏览器并不能立刻判断用户是单击还是双击操作。因此，就等待300ms左右，以判断用户是否再次点击了屏幕。

        WAP端触摸事件顺序：`touchstart` -> `touchmove` -> `touchend` -> `click`，触摸一瞬间触发`touchstart`，触摸结束后触发Zepto封装的`tap`事件，触摸结束后300ms左右触发`click`事件。
    3. 解决方法：

        1. 使用[fastclick.js](https://github.com/ftlabs/fastclick)消除`click`的延时（最佳方式）

            用`click`代替全部`tap`事件，这样PC端和WAP端都可以一致用`click`事件且不会出现WAP端点透bug。

            >fastclick.js原理：在检测到`touchend`事件时，通过DOM自定义事件立即触发一个模拟`click`事件，并阻止浏览器在300ms之后真正触发的`click`事件。
        2. 禁用缩放，设置`<meta name="viewport" content="initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">`。
        3. 布局viewport小于等于可视viewport则浏览器禁用双击缩放，设置`<meta name="viewport" content="width=device-width, initial-scale=1.0">`。
        4. CSS属性`touch-action: manipulation;`仅允许在元素上进行触屏操作的平移、缩放，忽略~~双击~~。
        5. 使用缓动动画，过度300ms延迟。
        6. 中间增加一层接受这个点透事件，然后去除此层。
        7. [模拟点击事件](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js触摸屏模拟点击事件消除延时300毫秒后才触发click事件使点击事件提前触发)代替`click`。
2. WAP端使用`:active`

    1. Android系统的浏览器大部分直接使用CSS伪类即可。
    2. iOS系统的浏览器要添加：`document.body.addEventListener('touchstart', function () {}, true);`。
    3. <details>

        <summary><del>JS添加类的方法模拟</del></summary>

        ```html
        <style>
            .d:active,
            .d.active { }
        </style>

        <script type="text/javascript">
            var selector = '.a,.b .c,.d';   /* 选择器字符串 */

            $(document.body).on('touchstart', selector, function () {
                $(this).addClass('active');
            }).on('touchmove touchend touchcancel', selector, function () {
                $(this).removeClass('active');
            });
        </script>
        ```
        </details>

    - 添加`document.body.addEventListener('touchstart', function () {}, true);`即可满足大部分浏览器使用伪类。
3. WAP端播放

    >大部分`<video>`、`<audio>`同理。

    1. 播放事件

        >参考：[MDN：媒体相关事件](https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Media_events)。

        1. 正在播放

            `timeupdate`事件：当`媒体.currentTime`改变（拉动进度或播放中）。
        2. 开始播放

            1. `play`事件：初次播放、暂停后恢复。
            2. `playing`事件：初次播放、暂停后恢复、结束后自动开始（`loop`属性模式）。
        3. 暂停播放

            `pause`事件
        4. 完成一轮播放

            >因为`loop`属性模式无法触发`ended`事件，又`timeupdate`事件触发时间不确定、无法和`媒体.duration`取等判断成功，故无法在`loop`属性模式中判定。

            （非`loop`属性模式下的）`ended`事件（伴随`pause`事件）。

        - 建议只用`timeupdate`和`ended`事件处理需求。

        >各机型/浏览器对视频事件、API的处理不同，甚至某些Android机型会要求：只有触发在视频区域内的事件才可执行视频的API。
    2. 自动播放

        1. JS代码模拟

            ```html
            <video id="j-video">
              您的浏览器不支持 video 标签
            </video>

            <script>
              var video = document.getElementById('j-video')

              document.addEventListener('DOMContentLoaded', function () {
                video.setAttribute('src', '视频地址')   // 代替preload="none"
                video.play()
              }, false)

              // 根据需求选用
              window.ontouchstart = function () {
                video.play()
                window.ontouchstart = null
              }
            </script>
            ```
        2. ~~`autoplay`~~ 属性模式

            >兼容性差。
    3. 循环播放

        1. JS代码模拟

            `ended`事件中触发`媒体.play()`。
        2. `loop`属性模式
    4. 内嵌播放

        >因为全屏播放完`<video>`会白屏，故可以在父级添加封面图片背景。

        ```html
        <video id="j-video"
               webkit-playsinline
               playsinline
               x5-video-player-type="h5">
          您的浏览器不支持 video 标签
        </video>

        <script>
          var video = document.getElementById('j-video')

          // QQ浏览器去除 x5-video-player-type 属性
          if (/QQBrowser/.test(window.navigator.userAgent)) {
            video.removeAttribute('x5-video-player-type')
          }
        </script>
        ```
    5. 播放控件（内嵌播放）

        1. `controls`属性模式
        2. <details>

            <summary><del>JS代码模拟</del></summary>

            >兼容性差。

            ```html
            <style>
              .video-wrap {
                position: relative;
                width: 320px;
                height: 500px;
                background: red;
              }
              .video-wrap video {
                max-width: 100%;
                max-height: 100%;
              }
              .icon {
                position: absolute;
                top: 0;
                width: 100%;
                height: 50%;
                background: yellow;
              }
            </style>

            <div id="j-video-wrap" class="video-wrap">
              <video id="j-video"
                     webkit-playsinline
                     playsinline
                     x5-video-player-type="h5"
                     style="width: 1px;height: 1px;">
                您的浏览器不支持 video 标签
              </video>

              <div id="j-start-icon" class="icon">
                封面图（初始点击）
              </div>
              <div id="j-play-icon" class="icon" style="pointer-events: none;display: none;">
                播放按钮
              </div>
            </div>

            <script>
             var video = document.getElementById('j-video')
             var start = document.getElementById('j-start-icon')
             var play = document.getElementById('j-play-icon')

             if (/QQBrowser/.test(window.navigator.userAgent)) { // QQ浏览器去除 x5-video-player-type 属性
               video.removeAttribute('x5-video-player-type')
             }

             function touchstartFunc () {
               start.style.display = 'none'
               video.setAttribute('src', '视频地址')    // 代替preload="none"
               video.removeAttribute('style')
               video.play()

               setTimeout(function () {
                 /* 点击播放 */
                 document.getElementById('j-video-wrap').addEventListener('touchstart', function () {
                   if (video.paused) { // 播放
                     video.play()
                     play.style.display = 'none'
                   } else {  // 暂停
                     video.pause()
                     play.style.display = 'block'
                   }
                 }, false)

                 /* 视频播放结束 */
                 video.addEventListener('ended', function () {
                   // video.play()
                   play.style.display = 'block'
                 }, false)

                 start.removeEventListener('touchstart', touchstartFunc, false)
               }, 0)
             }

             start.addEventListener('touchstart', touchstartFunc, false)
            </script>
            ```
            >[JSFiddle demo](https://jsfiddle.net/realgeoffrey/Lko8u1ku/)
            </details>
    - 播放视频问题：

        1. 无法操作客户端自定义播放控件：

            1. 一般手机有两种播放方式：

                1. 全屏模式
                2. 内联模式（浏览器支持其中一种）：

                    1. `webkit-playsinline playsinline`内联模式。

                        >针对iOS的UC或QQ浏览器，可以添加[iphone-inline-video](https://github.com/bfred-it/iphone-inline-video)。
                    2. `x5-video-player-type="h5"`在底部的全屏内联模式（同层播放）。

                        >[Android的腾讯x5内核App](https://x5.tencent.com/tbs/guide/video.html)特有。
            2. 无法操作全屏模式

                1. 无法改变全屏播放方向以及控件内容

                    DOM属性`x5-video-orientation="landscape或portraint"`、`x5-video-player-fullscreen="true"`无法解决。
                2. 有些浏览器在全屏模式中，不触发任何video事件

                    >无法自定义loading。
            3. 关闭`controls`模式，部分浏览器依然出现播放按钮
            4. 无法控制内联模式类型（内联模式/在底部的全屏内联模式）
        2. Android机型播放了`<video>`，会把视频的层级放到最高，暂时没有直接解决方法。
        3. 打开全屏会触发window的`scroll`事件。

            此时的屏幕可能高宽发生切换，页面内的DOM位置信息可能没有变化（如：`getBoundingClientRect`还是在原界面的值，屏幕高宽却变了）。
        4. 播放（`.play()`）是异步行为。

---
## 编程技巧

### 函数模板
1. 构造函数

    1. 普通版：

        ```javascript
        var OneConstructor = function () {
            /* 私有的内容 */
            var _para = {a: '私有的变量_para'},
                _func = function () {
                    console.log('私有的业务逻辑_func', _para);
                },
                _bindEvent = function () {  /* 绑定事件 */

                },
                _init = function () {   /* 初始化 */
                    _func();
                    _bindEvent();
                };

            _init();

            for (var _arr = [], _i = 0; _i < arguments.length; _i++) {
                _arr.push(arguments[_i]);
            }

            /* 公开的内容 */
            this.para = _arr;
            this.para_1 = {b: '公开的变量para_1（每个实例不共享）'};
            this.func_1 = function () {
                console.log('公开的业务逻辑func_1（每个实例不共享）');
            };
        };
        ```
    2. 修改构造函数的原型对象（所有实例都共享）：

        ```javascript
        var OneConstructor = (function () {
            /* 私有的内容 */
            var _para = {a: '私有的变量_para'},
                _func = function () {
                    console.log('私有的业务逻辑_func', _para);
                },
                _bindEvent = function () {  /* 绑定事件 */

                },
                _init = function () {   /* 初始化 */
                    _func();
                    _bindEvent();
                };

            function Constructor() {
                _init();

                for (var _arr = [], _i = 0; _i < arguments.length; _i++) {
                    _arr.push(arguments[_i]);
                }

                /* 公开的内容 */
                this.para = _arr;
                this.para_1 = {b: '公开的变量para_1（每个实例不共享）'};
                this.func_1 = function () {
                    console.log('公开的业务逻辑func_1（每个实例不共享）');
                };
            }

            /* 构造函数的原型对象上，每个实例共享 */
            Constructor.prototype = {
                para_2: {c: '公开的变量para_2（每个实例共享）'},
                func_2: function () {
                    console.log('公开的业务逻辑func_2（每个实例共享）');
                }
            };

            /* 原型对象添加constructor属性 */
            if (typeof Object.defineProperty === 'function') {

                /* 使属性：不可以改变描述符、不可以删除、不可以枚举、不可以被赋值运算符改变 */
                Object.defineProperty(Constructor.prototype, 'constructor', {
                    value: Constructor
                });
            } else {
                Constructor.prototype.constructor = Constructor;
            }

            return Constructor;
        }());
        ```
2. 模块模式（单例模式+私有变量和特权方法）

    ```javascript
    var singletonObj = (function () {
        /* 私有变量和私有方法，无法直接访问，只能由return的对象字面量访问 */
        var _para = {a: '私有变量'},
            _func = function () {
                console.log('私有方法');
            };

        /* 单例模式，可以访问私有内容 */
        return {
            get: function () {  /* 特权方法 */
                _func();

                return _para;
            },
            set: function (para) {  /* 特权方法 */
                _func();

                _para = para;
            },
            para: {b: '公开对象'},
            func: function () {
                console.log('公开方法');
            }
        }
    }());
    ```
    >单例模式：
    >```javascript
    >var singletonObj = {
    >   para: {},
    >   func: function () {}
    >};
    >```

### JS代码风格规范（coding style guide）
1. 声明

    >因为[JS的预编译](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#js的预编译)。

    1. 变量声明（`var`）

        无论语句在何处，无论是否会真正执行到，所有的`var`语句的**声明**都提升到作用域（函数体内或全局）顶部执行（hoisting），但具体**赋值**不会被提前。

        ><details>
        ><summary>e.g.</summary>
        >
        >```javascript
        >(function () {
        >    console.log(a);    // undefined
        >    var a = 2;
        >    console.log(a);    // 2
        >})();
        >
        >// 等价于：
        >(function () {
        >    var a;
        >    console.log(a);    // undefined
        >    a = 2;
        >    console.log(a);    // 2
        >})();
        >```
        ></details>

        1. 声明变量是所在上下文环境的不可配置属性；非声明变量是可配置的。
        2. 相同作用域中，对同一个变量进行多次声明，则忽略第一次之后的声明（会执行变量赋值）。

        >建议：总是把所有变量声明都放在函数顶部，而不是散落在各个角落。
    2. 函数声明

        1. 也会被JS引擎提前到作用域顶部声明，因此代码中函数的调用可以出现在函数声明之前。
        2. 函数声明不应当出现在~~语句块~~内（如：条件语句），语句块的函数也会提前声明，导致语义不清容易出错。
    3. 函数表达式（Function expressions）声明

        必须先声明：`var a = function(){...};`才可以使用，声明会被提前，但赋值不会被提前。
    4. 同名的变量声明和函数声明（不是函数表达式）

        同时声明的情况下（顺序不影响结果）：

        1. 变量仅声明不赋值：被赋值为函数。
        2. 变量赋值：被赋值为变量。

        ><details>
        ><summary>e.g.</summary>
        >
        >```javascript
        >var a1 = 1;
        >function a1() {}
        >console.log(a1);    // 1
        >
        >function b2() {}
        >var b2 = 1;
        >console.log(b2);    // 1
        >
        >var c3;
        >function c3() {}
        >console.log(c3);    // function
        >
        >function d4() {}
        >var d4;
        >console.log(d4);    // function
        >```
        ></details>

    >建议：先声明再使用；把函数声明紧接着放在变量声明之后。

2. 严格模式`use strict`

    可用于全局，也可以用于局部（函数体内）。

    >1. 不建议在全局作用域中使用，因为当有JS文件合并时，一个文件的全局严格模式会导致整个文件都是严格模式。
    >2. 可以用`(function(){'use strict';/* 执行内容 */}());`匿名函数方式使用严格模式。
3. 全等`===`（不全等`!==`）与等号`==`（不等`!=`）的区别

    1. 当比较的两个值的类型不同时，`==`和`!=`都会强制[类型转换](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#数据类型转换)，再进行转换后值的比较。
    2. 用`===`和`!==`则不会转换，若类型不同则直接返回`false`（`switch`语句比较值是全等模式比较）。

    >1. 建议：都用`===`或`!==`进行比较。
    >2. `>=`等价于：`== || >`；`<=`等价于：`== || <`。
4. 三元运算符应当仅仅用在条件赋值语句中，而不要作为`if`语句的替代：

    1. `var a = condition ? '1' : '2';`
    2. ~~`condition ? func1() : func2();`~~
5. 命名

    1. 变量命名的前缀应当是**名词**，函数命名的前缀应当是**动词**。
    2. 约定函数名：

        1. `can`、`has`、`is`开头的返回值是布尔型。
        2. `get`开头的返回是非布尔型。
        3. `set`开头的执行保存动作。
    3. 常量用大写字母和下划线分割，如：`MAX_COUNT`。
    4. 构造函数用大驼峰命名法（Pascal Case），首字母大写（以非动词开头），单词首字母大写：

        1. `var a = new Person();   // 构造函数`
        2. `var b = getPerson();    // 普通函数`
    5. 不要用多行的字符串写法

        ><details>
        ><summary>e.g.</summary>
        >
        >```javascript
        >/* 不提倡的多行写法 */
        >var a = 'abc\
        >def';
        >
        >
        >/* 一般写法 */
        >var b = 'abc' +
        >    'def';
        >```
        ></details>
    6. 对象的属性、方法，与变量、方法命名规则相同。
    7. 若属性、变量、方法在表示其是私有的，可在开头加一个下划线`_`作为区分。
6. 使用字面量代替构造函数（普通函数）的[数据创建方式](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/基础知识.md#数据创建方式)

    >好处：
    >1. 代码更少。
    >2. 不需要构造函数的“作用域解析”（scope resolution），提高性能。
    >3. 构造函数可以接收参数，返回的实例不可控、易混淆；字面量简单不出错。

    1. 对象

        e.g.

        ```javascript
        /* 不提倡的构造函数写法 */
        var a1 = new Object();
        a.attr1 = '...';
        var a2 = new Object({attr1: '...'});


        /* 提倡的字面量写法 */
        var b = {attr1: '...'};
        ```
    2. 数组

        e.g.

        ```javascript
        /* 不提倡的构造函数写法 */
        var arr1 = new Array('a', 'b');


        /* 提倡的字面量写法 */
        var arr2 = ['a', 'b'];
        ```
    3. 字符串

        e.g.

        ```javascript
        /* 不提倡的构造函数写法 */
        var str1 = new String('a');


        /* 提倡的字面量写法 */
        var str2 = 'a';
        ```

    - 其他数据类型
7. 长字符串拼接使用`Array.prototype.join()`，而不使用`+`

    1. `.join()`性能好（建议方式）

        <details>
        <summary>e.g.</summary>

        ```javascript
        var arr = [],
            i;

        for (i = 0; i < 100; i++) {
            arr[i] = '字符串' + i + '字符串';
        }

        return arr.join('');
        ```
        </details>
    2. `+`性能差（不建议）

        <details>
        <summary>e.g.</summary>

        ```javascript
        var text = '',
            i;

        for (i = 0; i < 100; i++) {
            text = text + '字符串' + i + '字符串';
        }

        return text;
        ```
        </details>
8. 注释规范

    1. 单行注释：`//`后不空格

        - 使用场景：

            1. 代码上方独占一行，缩进与备注内容一致，注释前必须空一行。
            2. 代码尾部（至少一个缩进）。
            3. 被注释的大段代码。
    2. 多行注释：`/*`和`*`后空一格

        - 使用场景：

            1. 代码上方独占多行，缩进与备注内容一致，注释前必须空一行。
            2. 作用：

                1. 难以理解的代码。
                2. 可能被误认为错误的代码。
                3. 浏览器特性hack。
    3. 函数注释规范（使用部分[JSDoc](http://usejsdoc.org/)）

        ```javascript
        /**
         * 方法描述
         * @constructor - （是否构造函数）
         * @param {Number} param1 - 参数描述，限制值为：1 描述|2 描述|3 描述
         * @param {Object|String|Boolean|Function|Array} param2 - 参数描述
         * @param {*} [param3] - 可选参数
         * @param [param4 = 'default'] - 可选参数拥有默认值
         * @param {Object} param5 - 对象
         * @param {Object|String|Boolean|Function|Array} param5.param5_1 - 对象的属性描述
         * @param {...Number} param6 - 可重复使用参数
         * @returns {Object|Undefined} result - 参数描述
         */
        function func(param1, param2, param3, param4, param5, param6) {
            // param5.param5_1

            return result;
        }
        ```
9. JS编程风格总结（programming style）

    >参考：[阮一峰：JavaScript 编程风格](http://javascript.ruanyifeng.com/grammar/style.html)。

    1. 表示区块起首的大括号，不要另起一行。
    2. 调用函数的时候，函数名与左括号之间没有空格。
    3. 所有其他语法元素与左括号之间，都有一个空格。
    4. 不要省略句末的分号。
    5. 不要使用`with`语句。
    6. 不要使用“相等”（`==`）运算符，只使用“严格相等”（`===`）运算符（同理仅使用`!==`，不使用`!=`）。
    7. 不要将不同目的的语句，合并成一行。
    8. 所有变量声明都放在函数的头部。
    9. 所有函数都在使用之前定义。
    10. 避免使用全局变量；*如果不得不使用，用大写字母表示变量名。*
    11. 不要使用`new`命令，改用`Object.create()`命令。
    12. 构造函数的函数名，采用首字母大写；其他函数名，一律首字母小写。
    13. 不要使用自增（`++`）和自减（`--`）运算符，用`+= 1`和`-= 1`代替。
    14. 不省略大括号。
10. JS编码规范

    绝大部分同意[fex-team:tyleguide](https://github.com/fex-team/styleguide/blob/master/javascript.md#javascript编码规范)。

    >可以设置为IDEs的**Reformat Code**的排版样式。
11. 用户体验

    1. 平稳退化（优雅降级）：当浏览器不支持或禁用了JS功能后，访问者也能完成最基本的内容访问。

        1. 为JS代码预留出退路（`<a>`添加`href`属性，用JS事件绑定去拦截浏览器默认行为）

            `<a href="真实地址" class="j-func">...</a>`

            >`href="真实地址"`也是为了SEO。
        2. ~~javascript伪协议~~

            `<a href="javascript: func();">...</a>`
        3. ~~内嵌事件处理程序~~

            `<a href="#" onclick="func();return false;">...</a>`
    2. 渐进增强：先完成基本通用功能，再追加额外功能。
    3. 向后兼容：确保老版本浏览器基本可用，使之虽不能支持某些功能，但仍能基本访问。

        1. 能力检测：`if(func){func();}`（最适当方式）。
        2. 怪癖检测：`try-catch`。
        3. 浏览器嗅探技术（用户代理`navigator.userAgent`检测）。
    4. 资源分离：把样式表、脚本分离出HTML。

        1. 使用外部资源。
        2. 不在HTML内嵌：事件处理程序、javascript伪协议。
        3. 对只为DOM增添的内容，转移到外部资源中动态创建。
    5. 性能优化[从URL输入之后](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/README.md#页面加载解析步骤)就开始考虑。

        1. 关于“性能”的写法建议，更多的是一种编程习惯（微优化）：写出更易读、性能更好的代码。
        2. 在解决页面性能瓶颈时，要从URL输入之后就进行[网站性能优化](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/README.md#网站性能优化)；避免在处理网页瓶颈时进行~~微优化~~。

            >1. 即时编译（just in time compile，JIT）：JS引擎会在JS运行过程中逐渐重新编译部分代码为机器码，使代码运行更快。
            >2. 微优化（micro-optimizations）：尝试写出认为会让浏览器稍微更快速运行的代码或调用更快的方法。

### 编程实践（programming practices）
1. UI层的松耦合

    1. 不要~~用JS修改CSS样式~~，JS仅修改class（任何时刻，CSS中的样式都可以修改，而不必更新JS）。

        >特例：根据页面重新定位，可以用JS设定位置（如：`top`、`left`等）。
    2. 将HTML从JS中抽离，避免增加跟踪文本和结构性问题的复杂度。可以使用模板引擎，如：[handlebars.js](https://github.com/wycats/handlebars.js)。
2. 避免使用全局变量

    >任何来自函数外的数据都应当以参数形式传进函数：将函数与其外部环境隔离开。

    1. 单全局变量

        唯一全局对象是独一无二的（不与内置API冲突），并将所有功能代码都挂载到这个全局对象上，因此每个可能的全局变量都成为这个唯一全局对象的属性（或方法）。
    2. 零全局变量（立即调用的函数表达式）

        隔离代码。

        ```javascript
        (function (win) {
            'use strict';   // 严格模式可以避免创建全局变量

            var doc = win.document;
            /* 代码 */
        }(window));
        ```
3. 事件处理程序

    1. 把事件逻辑（与用户行为相关的代码）与应用逻辑（与应用相关的功能性代码）隔离开。
    2. 不要分发事件：

        让事件处理程序成为接触到`event`对象的唯一函数，在event进入应用逻辑前完成用户相关操作（包括阻止默认事件或阻止冒泡等）。
4. 将配置数据从代码中分离

    配置数据：URL、展示内容、重复的值、设置、任何可能发生变更的值。
5. 代码调试方式

    1. JS：

        1. 展示：`console.log`、`console.info`、`console.warn`、`console.error`（`alert`）
        2. 调用栈：`console.trace`
        3. 更好的展示：

            1. 缩进：`console.groupCollapsed或console.group`至`console.groupEnd`
            2. 表格：`console.table`
        4. 执行时间：`console.time`至`console.timeEnd`

        >（Value below was evaluated just now.）`console`引用类型的数据，在点击开来查看的瞬间才去取引用类型的快照（意味着可以console之后再修改展示内容），打开之后不再关联。
    2. PC端的DevTool：Sources断点（`debugger`、配合SourceMap，通过Call Stack查看调用栈）
    3. WAP端使用页面模拟调试，如：[eruda](https://github.com/liriliri/eruda)、[vConsole](https://github.com/Tencent/vConsole)
    4. 上线的页面中藏着某些“后门”调试（如：隐蔽操作开启`console`）

        1. PC端可以在URL中判断某些特定的`search`值，以开启调试模式。

            >e.g. `xxx?debug=1`开启
        2. WAP端可以用一些隐蔽的手势触发log信息展示。

            ><details>
            ><summary>e.g.</summary>
            >
            >```javascript
            >let consolelogi = 0
            >
            >function wapConsole () {
            >  if (event.touches.length >= 4) {    // 4个触发点以上
            >    consolelogi += 1
            >
            >    if (consolelogi >= 2) {    // 2次以上触发
            >      // 展示隐藏的调试信息
            >      const newScript = document.createElement('script')
            >      const appendPlace = document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]
            >
            >      newScript.onload = function () { // 只能保证加载完成，但不能判断是否执行
            >        eruda.init()   // new VConsole()
            >        newScript.onload = null
            >      }
            >
            >      // onerror表示加载失败
            >
            >      newScript.src = '//unpkg.com/eruda'    // '//unpkg.com/vconsole'
            >
            >      appendPlace.appendChild(newScript)
            >
            >      document.removeEventListener('touchstart', wapConsole, false)
            >    }
            >  }
            >}
            >
            >document.addEventListener('touchstart', wapConsole, false)
            >```
            ></details>

### 函数防抖、函数节流
>都是用来限制某个函数在一定时间内执行次数的技巧。

1. 防抖（debounce）

    一个函数被调用后不执行，在间隔时间内没有再次被调用才执行（或一调用就执行，在间隔时间内没有再次被调用才可以进行下一次执行）；若在间隔时间内再次被调用，则刷新等待时间并且继续等待间隔时间结束后才执行。
2. 节流（throttle）

    一个函数无法在间隔时间内连续执行，当上一次函数执行后过了间隔时间后才能进行下一次该函数的调用。

### 自执行匿名函数（拉姆达，λ，lambda）
立即调用的函数表达式（IIFE，Immediately Invoked Function Expression）。

>ES6拥有了块级作用域之后，不再需要~~自执行匿名函数~~。

1. 写法：

    >1. `function`关键字当作一个**函数声明**的开始，函数声明的后面不能跟圆括号；
    >2. 将函数声明包含在圆括号中，表示**函数表达式**，函数表达式的后面可以跟圆括号，表示执行此函数。

    ```javascript
    /* 建议方式 */
    (function () {}());
    (function () {})();


    /* 不建议方式 */
    [function () {}()];

    ~function () {}();
    !function () {}();
    +function () {}();
    -function () {}();

    delete function () {}();
    typeof function () {}();
    void function () {}();
    new function () {}();
    new function () {};

    var f = function () {}();

    1, function () {}();
    1 ^ function () {}();
    1 > function () {}();
    ```
2. 传值进自执行匿名函数可以避免闭包导致无法记录变量值的问题

    ><details>
    ><summary>e.g.</summary>
    >
    >```javascript
    >for (var i = 0; i < 3; i++) {
    >    // 不用匿名函数
    >    setTimeout(function () {
    >        console.log(i);         // 每个结果都是固定的最后一个值（闭包作用）
    >    }, 0);
    >}
    >
    >for (var i = 0; i < 3; i++) {
    >    // 匿名函数
    >    (function (para) {
    >        setTimeout(function () {
    >            console.log(para);  // 结果是传入进匿名函数的参数
    >        }, 0);
    >    }(i));
    >}
    >
    >for (var i = 0; i < 3; i++) {
    >    // ES6的块级作用域（ES6拥有了块级作用域之后，不再需要~~自执行匿名函数~~）
    >    let num = i;
    >    setTimeout(function () {
    >        console.log(num);       // 结果是1 2 3
    >    }, 0);
    >}
    >```
    ></details>
3. 可以添加函数名：`(function 内部名字 () { console.log(内部名字); 错误 }())`

    1. 用于在执行栈中标记匿名函数的函数名
    2. 可以在匿名函数内部引用匿名函数本身

### Hybrid App相关
>1. 相对于Native App的高成本、原生体验，Hybrid App具有低成本、高效率、跨平台、不依赖Native发包更新等特性。
>2. Hybrid底层依赖Native提供的容器（WebView），上层使用HTML、CSS、JS进行业务开发。

1. Native提供给Hybrid宿主环境

    1. 互相调用：Native调用WebView的JS方法；WebView调用`桥协议`或触发`自定义URL Scheme`。
    2. 资源访问机制

        1. 以`file`方式访问Native内部资源。
        2. 以`url`方式访问线上资源。
        3. 增量替换机制（不依赖发包更新）

            1. Native本地下载、解压线上的打包资源，再替换旧资源。
            2. ~~manifest~~。
        4. URL限定，限制访问、跨域问题的解决方案

            1. 可以限制WebView的能发起的请求内容。
            2. 可以代替WebView进行会触发跨域的AJAX请求。
    3. 身份验证机制

        >客户端注入方式：javascript伪协议方式`javascript: 代码`。

        Native创建WebView时，根据客户端登录情况注入跟登录有关的cookie（session_id）或token。
    4. Hybrid开发测试

        1. 提供**切换成线上资源请求方式**的功能，用代理工具代理成本地资源。
        2. Chrome的Remote devices调试。
2. Hybrid的前端处理

    ><details>
    ><summary>WebView环境兼容性</summary>
    >
    >1. CSS、HTML
    >
    >    >除了[样式适配](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/响应式相关.md#wap端适配总结)之外。
    >
    >    1. 添加厂商前缀（如：`-webkit-`）。
    >    2. 布局有问题的机型额外调试。
    >    3. `<video>`、`<audio>`、`<iframe>`调试。
    >2. JS
    >
    >    兼容性判断（能力检测等）。
    ></details>

    1. 与Native配合方式：

        >1. 都是以**字符串**（数据用JSON字符串）的形式交互，向客户端传递：
        >
        >    1. 全局的方法名 -> 客户端调用`方法名(JSON数据)`
        >    2. 匿名函数 -> 客户端调用`(匿名函数(JSON数据))`
        >2. WebView无法判断是否安装了其他App。
        >3. 可以通过`查看注入的全局方法`或`客户端调用回调函数`来判定H5页面是否在具体App内打开。
        >4. `桥协议`仅在App内部起作用；`自定义URL Scheme`是系统层面，所以可以额外针对跨App起作用（如：分享去其他App）；iOS的**通用链接**可以认为是高级的`自定义URL Scheme`。

        1. `桥协议`：Native注入全局方法至WebView的`window`，WebView调用则客户端拦截后触发Native行为。

            >1. 客户端注入方式：javascript伪协议方式`javascript: 代码`。
            >2. 注入JS代码可以在创建WebView之前（`[native code]`）或之后（全局变量JS注入）。
            >3. 若注入的方法为`undefined`，则认为不在此App内部。
        2. `自定义URL Scheme`：拦截跳转（`<iframe>`或`<img>`设置`src`、点击`<a>`、`window.location.href`），触发Native行为。

            ><details>
            ><summary><code>URL Scheme</code></summary>
            >
            >是iOS和Android提供给开发者的一种WAP唤醒Native App方式。Android应用在mainfest中注册自己的Scheme；iOS应用在App属性中配置。典型的URL Scheme：`myscheme://my.hostxxxxxxx`。
            ></details>

            >1. 客户端可以捕获、拦截任何行为（如：`console`、`alert`）。相对于注入全局变量，拦截方式可以隐藏具体JS业务代码，且不会被重载，方便针对不可控的环境。
            >2. 有些App会设置允许跳转的其他App的白名单或黑名单，如：微信白名单。
            >3. 除了增加回调函数且被客户端调用，否则无法判定是否在此App内部。
            >4. 跨App使用`自定义URL Scheme`，其后面的字符串要产生的行为仅目的App能理解。

            1. iOS8-

                ```javascript
                var iframe = document.createElement('iframe');
                iframe.src = '自定义URL Scheme';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                setTimeout(function () {
                  document.body.removeChild(iframe);
                }, 3000);

                location.href = '下载地址';
                ```
            2. iOS9+

                >`<iframe>`无效。

                ```javascript
                location.href = '自定义URL Scheme';

                setTimeout(function () {
                  location.href = '下载地址';
                }, 250);
                setTimeout(function () {
                  location.reload();
                }, 1000);
                ```
            3. Android

                ```javascript
                location.href = '自定义URL Scheme';	  // 也可以用`<iframe>`

                var start = Date.now();
                setTimeout(function () {    // 尝试通过上面的唤起方式唤起本地客户端，若唤起超时（还在这个页面），则直接跳转到下载页（或做其他未安装App的事情）（浏览器非激活时，定时器执行时间会变慢，所以会大于定时器时间之后才执行定时器内回调）
                  if (Date.now() - start < 3100) {  // 还在这个页面，认为没有安装App
                    location.href = '下载地址';
                  }
                }, 3000);
                ```

            >1. <details>
            >
            >    <summary>（在微信及其他APP中）使用应用宝<strong>下载/打开</strong>其他APP</summary>
            >
            >    >参考:[关于微信中直接调起 Native App 的调研报告](https://blog.csdn.net/lixuepeng_001/article/details/78043418)。
            >
            >    应用宝在微信中可能可以更好识别是否安装了其他APP，从而可以在应用宝页面选择打开其他APP，而不仅仅是下载。
            >
            >    - 拼接应用宝下载/打开其他APP的链接：
            >
            >        1. 应用宝主链接：`https://a.app.qq.com/o/simple.jsp?`
            >        2. 跳转参数（search值，在`?`后面，用`&`分割）:
            >
            >            1. 包名：`pkgname=` + `com.xx.xxx`
            >            2. 其他APP内打开路径（可选）：`android_schema=` + `自定义URL Scheme://具体跳转路径`
            >
            >                >若有一些特殊字符，可以用`encodeURIComponent`转义。
            >            3. 渠道包链接（可选）：`ckey=` + `CK1234567890123`
            >
            >        最终链接：`https://a.app.qq.com/o/simple.jsp?pkgname=com.xx.xxx&android_schema=xxxx://xx`
            >    </details>
            >2. 微信分享在部分系统（低于微信客户端Android6.2）使用~~pushState~~导致签名失败，可查询[官方文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)；又因为一般是异步加载、配置微信的设置，所以要等待微信第三方文件和接口完成后才能够配置成功（才能够设置成功）。
        3. iOS9+的Universal links（通用链接），可以从底层打开其他App客户端，跳过白名单（微信已禁用）

            >需要HTTPS域名配置、iOS设置等其他端配合。

            >参考：[通用链接（Universal Links）的使用详解](http://www.hangge.com/blog/cache/detail_1554.html)、[Universal Link 前端部署采坑记](http://awhisper.github.io/2017/09/02/universallink/)、[Support Universal Links](https://developer.apple.com/library/content/documentation/General/Conceptual/AppSearch/UniversalLinks.html#//apple_ref/doc/uid/TP40016308-CH12-SW2)。

        - WebView提供Native调用的全局回调函数（或匿名函数）。

            >判断多个回调函数顺序：带id触发Native行为，Native调用回调函数时携带之前的id。
    3. 根据WebView的[错误处理机制](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#错误处理机制)统计用户在Hybrid遇到的bug。

        1. 对于App内不方便查看的信息，可以发送需要查看的信息、再抓包的方式进行调试。
        2. 可以用一些隐蔽的手势触发log信息展示。

            <details>
            <summary>e.g.</summary>

            ```javascript
            var consolelogi = 0;

            document.addEventListener('touchstart', function () {
                if (event.touches.length >= 4) {    // 4个触发点以上
                    consolelogi += 1;
                    if (consolelogi >= 2) {    // 2次以上触发
                        // 展示隐藏的调试信息
                    }
                }
            }, false);
            ```
            </details>
    4. 分享到其他App

        1. 通过JS触发Native App之间的切换分享（自己Native内可用桥协议，任意App均要起作用只能用Scheme）。
        2. 带分享信息参数去访问其他App提供的分享URL。

### Tips
1. `var a = b = c = 1;/* b、c没有var的声明。等价于：var a = 1; b = 1; c = 1; */`

    第二个以后的变量表示没有~~var~~的赋值。
2. `var a = a || {};`执行顺序：

    <details>
    <summary>等价于：</summary>

    ```javascript
    /* 不是传参情况 */
    var a;

    if (a === 0 || a === "" || a === false || a === null || a === undefined) {
        a = {};
    }


    /* 传参情况 */
    function func(b) {
        if (b === 0 || b === "" || b === false || b === null || b === undefined) {
            b = {};
        }
    }
    ```
    </details>

    1. 声明提前`var a;`。
    2. 右侧的表达式`a || {}`先执行：根据规则先判断a的值是否为真，如果a为真，则返回a；如果a不为真，则返回{}。
    3. 最后再将结果赋值给`a`。

    ><details>
    ><summary><code>var a = b || {};</code>与<code>if (c) {}</code>会因为b或c没有定义而报错，可以用<code>typeof</code>来使代码健壮</summary>
    >
    >1. `var a = typeof b !== 'undefined' && b !== null ? b : {};`
    >2. `if (typeof c !== 'undefined' && c !== null) {}`
    ></details>
3. `if`、`while`之类的判断语句中用赋值操作：

    （大部分是误用）赋值的内容Boolean后为假会导致条件判断为假：`if(a = false){/* 不执行 */}`。

    >判断语句内只判断整体返回值是`true`还是`false`，与里面执行内容无关（尽管对其语法有所限制）。
4. 逗号操作符`,`对每个操作对象求值（从左至右），然后返回最后一个操作对象的值。

    1. `(0, obj.func)()`相当于`0; var tmp = obj.func; tmp();`

        ```javascript
        const obj = {
          func () {
            console.log(this)
          }
        }

        obj.func();     // obj
        (0, obj.func)() // window
        // 返回最后一个操作对象的值，返回一个方法
        ```
    2. `if(var a = 1, b = 2, c = 3, false){/* 不执行 */}`：

        >`var`语句中的逗号不是逗号操作符，因为它不存在于一个表达式中。尽管从实际效果来看，那个逗号同逗号运算符的表现很相似。但它是`var`语句中的一个特殊符号，用于把多个变量声明结合成一个。
    3. `var a = [10, 20, 30, 40][1, 2, 3];  // 40`：

        1. `[10, 20, 30, 40]`被解析为数组；
        2. `[1, 2, 3]`被解析为属性调用，逗号操作符取最后一个值为结果。

        因此结果为数组`[10, 20, 30, 40]`的`[3]`属性值：`40`。
5. `{a: 'b'} + 1;   // 1`：

    大括号视为代码块，没有返回值。需要给大括号加上小括号，表明为一个值：`({a: 'b'}) + 1;  // [object Object]1`。
6. 浮点数的计算：

    浮点数值计算会产生舍入误差，因此永远不要用条件语句判断某个特定浮点数值，也不要用JS进行复杂的计算。

    >避免浮点数运算误差函数：[用整数进行小数的四则运算](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js用整数进行小数的四则运算避免浮点数运算误差)。
7. 判断DOM是否支持某属性：

    若要判定一个属性是否被DOM所支持，新建一个DOM来判断：`if('属性' in document.createElement('某标签')){...}`。

    >在DOM中随意添加一个属性，`此属性 in 此DOM`永远为真，不可以判断是否此DOM存在此属性（或方法）。
8. `eval`中直接执行`function`声明无效，必须用引号把`function`声明包裹起来才有效（尽量不用`eval`）：

    ```javascript
    eval(function a() {});      // 返回function a() {}，但没有声明
    eval('function b() {}');    // 返回undefined，声明成功
    ```

    >1. `if()`中的代码对于`function`的声明就是用`eval`带入方法做参数，因此虽然返回true，但方法没有被声明。
    >2. `setTimeout`与`setInterval`中第一个参数若使用字符串，也是使用`eval`把字符串转化为代码。
9. 获取数组中最大最小值：

    1. `Math.min(...[1, 2, 3])`或`Math.min.apply(null, [1, 2, 3])`
    2. `Math.max(...[1, 2, 3])`或`Math.max.apply(null, [1, 2, 3])`
10. 设置CSS的内嵌样式：

    `dom.style`返回一个对象，包含：此DOM的所有内嵌样式（没设置的属性的值默认：`''`）、`cssText`（所有有值的内嵌样式的文本）。

    1. `cssText`（ie8-返回时不包含最后一个`;`）：

        1. 添加：`dom.style.cssText += '; 样式: 属性; 样式: 属性'`
        2. 替换：`dom.style.cssText = '样式: 属性; 样式: 属性'`

        >若赋值错误，则去除无效样式、保留有效的赋值内容。
    2. 删除某个内嵌样式属性：`dom.style.某属性名 = ''`。

        >若赋值错误，则保持赋值前的值。
11. 文档或一个子资源正在被卸载（关闭、刷新）时先触发`beforeunload`、再触发`unload`：

    >关闭前异步发送数据：`navigator.sendBeacon(地址, 数据)`（`XMLHttpRequest`：异步会被忽略、同步影响体验）。

    1. `beforeunload`(可取消默认行为)

        1. PC：若事件处理程序返回为`真`，则试图弹出对话框让用户选择是否继续操作。
        2. Android：可以执行事件函数但不会弹出对话框。
        3. iOS：无效。

        ```javascript
        window.onbeforeunload = function (e) {
          // do sth.

          var msg = needConfirm ? '信息' : '';

          (e || window.event).returnValue = msg;

          return msg;
        };
        ```
    2. `unload`

        1. 所有资源仍存在（图片、iframe等）
        2. 对于终端用户所有资源均不可见
        3. 界面交互无效（`window.open`、`alert`、`confirm`等）
        4. 错误不会停止卸载文档的过程
12. 页面的id值会动态地成为`window`的属性（全局变量），值为这个id所在的Element，除非`window`已存在这个属性名。

    ><details>
    ><summary>e.g.</summary>
    >
    >```html
    ><div id="j-dom"></div>
    >
    ><script>
    >  document.getElementById('j-dom') === window['j-dom']  // 当window原本没有j-dom属性时成立
    ></script>
    >```
    ></details>
13. （非打开新窗口的、非`history.pushState/replaceState`改变路由的）页面回退

    `if (document.referrer !== '') { history.back() } else { /* 回退到底的其他行为 */ }`

    >1. 若是新打开的窗口（`target="_blank"`），则会出现`document.referrer`有值，但`history.back()`已回退到底。
    >2. 若是`history.pushState/replaceState`改变路由，则不改变`document.referrer`（可能初始`document.referrer === ''`）。
    >3. 重新请求当前页面链接（如：`location.reload()`、或点击`<a href="当前页面链接">`），会导致`document.referrer === '当前页面链接'`。
14. 使用`encodeURIComponent/decodeURIComponent`，不使用 ~~`encodeURI/decodeURI`~~

    >`encodeURIComponent`与`encodeURI`都是对URI（统一资源标识符）进行编码。因为 ~~`encodeURI`~~ 无法产生能适用于HTTP GET/POST请求的URI（没转义`&` `=`等），所以不使用。

    1. `encodeURIComponent`

        转义除了以下字符之外的所有字符：`字母` `数字` `(` `)` `.` `!` `~` `*` `'` `-` `_`
    2. `encodeURI`

        转义除了以下字符之外的所有字符：`字母` `数字` `(` `)` `.` `!` `~` `*` `'` `-` `_` `;` `,` `/` `?` `:` `@` `&` `=` `+` `$` `#`
15. 当一个`<script>`被执行时，在它之前的标签可以访问，但在它之后的标签无法访问（还不存在、未被解析到）

    ```html
    <!-- document、document.documentElement、document.head 出现 -->
    <html>
      <head></head>
      <body> <!-- document.body出现 -->
        某id的DOM <!-- 某id的DOM出现 -->
      </body>
    </html>
    ```
16. 判断浏览器标签是否在激活状态

    1. `document.hidden`：当前文档是否被隐藏
    2. `document.visibilityState`：当前文档的可见情况（`'visible'`、`'hidden'`、`'prerender'`、`'unloaded'`）
    3. `document`的`visibilitychange`事件：当前文档切换**隐藏/显示**时触发

        >`window`的`focus/blur`事件：当前文档**获得焦点/失去焦点**时触发（并不意味着被浏览器标签是否被隐藏）
    4. `document.hasFocus()`：当前文档是否获得焦点

---
## 功能归纳

### 判断数据类型
1. `Object.prototype.toString.call(值);`（或`apply`）

    1. 没有跨帧问题。
    2. 放入**内置对象**，返回`'[object 构造函数的名称]'`的字符串

        >特例：自定义类型返回`'[object Object]'`，`undefined`、`null`返回对应名字。

        1. `undefined` 或 不填 -> `'[object Undefined]'`
        2. `null` -> `'[object Null]'`
        3. Boolean实例 -> `'[object Boolean]'`
        4. Number实例 -> `'[object Number]'`
        5. String实例 -> `'[object String]'`
        6. Symbol实例 -> `'[object Symbol]'`
        7. Object实例 -> `'[object Object]'`
        8. 自定义类型实例 -> `'[object Object]'`
        9. Array实例 -> `'[object Array]'`
        10. Function实例 -> `'[object Function]'`
        11. Date实例 -> `'[object Date]'`
        12. RegExp实例 -> `'[object RegExp]'`
        13. <details>

            <summary>Error类型实例 -> <code>'[object Error]'</code></summary>

            Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
            </details>
        14. Map实例 -> `'[object Map]'`
        15. Set实例 -> `'[object Set]'`
        16. WeakMap实例 -> `'[object WeakMap]'`
        17. WeakSet实例 -> `'[object WeakSet]'`
        18. Promise实例 -> `'[object Promise]'`
        19. 生成器实例 -> `'[object GeneratorFunction]'`
        20. `window` -> `'[object Window]'`
        21. `document` -> `'[object HTMLDocument]'`

            >参考：[MDN：HTML 元素接口](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model#HTML_元素接口)。

            继承`document`的各种DOM，返回`'[object HTML继承类Element]'`。
        22. HTMLCollection实例（DOM集合） -> `'[object HTMLCollection]'`
        23. NodeList实例（`DOM.childNodes`或`document.querySelectorAll`返回） -> `'[object NodeList]'`
        24. `arguments` -> `'[object Arguments]'`
        25. `Math` -> `'[object Math]'`
        26. `JSON` -> `'[object JSON]'`
        27. `WebAssembly` -> `'[object WebAssembly]'`
        28. <details>

            <summary>TypedArray实例 -> <code>'[object 构造函数名]'</code></summary>

            Int8Array、Uint8Array、Uint8ClampedArray、Int16Array、Uint16Array、Int32Array、Uint32Array、Float32Array、Float64Array
            </details>
        29. ArrayBuffer实例 -> `'[object ArrayBuffer]'`
        30. DataView实例 -> `'[object DataView]'`

        ><details>
        ><summary>对于没有声明的变量，直接使用会报<strong>引用不存在变量</strong>的错误，可以用<code>typeof</code>来使代码健壮</summary>
        >
        >`if (typeof 变量 !== 'undefined' && Object.prototype.toString.call(变量) === '[object 某]') {}`
        ></details>
2. `typeof 值`

    1. 没有跨帧问题。
    2. 返回一个表示值类型的字符串。

        1. 字符型 -> `'string'`
        2. 布尔型 -> `'boolean'`
        3. 数值型 -> `'number'`
        4. Symbol型 -> `'symbol'`
        5. `undefined` -> `'undefined'`
        6. 函数 -> `'function'`
        7. 引用对象型 -> `'object'`
        8. `null` -> `'object'`

        >1. 因为`typeof null`返回`'object'`，因此typeof不能判断是否是引用数据类型。
        >2. ie8-的DOM节点的方法返回不是~~function~~，而是`object`，因此只能用`方法名 in DOM`检测DOM是否拥有某方法。

3. `对象 instanceof 构造函数`

    1. 不能跨帧（`<iframe>`、`window.open()`的新窗口）。

        >```javascript
        >/* 跨帧：浏览器的帧（frame）里的对象传入到另一个帧中，两个帧都定义了相同的构造函数 */
        >A实例 instanceof A构造函数; // true
        >A实例 instanceof B构造函数; // false
        >```
    2. 判断`构造函数.prototype`是否存在于对象的原型链上。
    3. 不仅检测对象本身，还检测至原型链。

        >e.g. `new Number() instanceof Object;  /* true */`。
    4. **检测自定义类型的唯一方法。**
4. `属性 in 对象`

    1. 仅判断属性是否存在检测的对象上，不读取属性值。
    2. 检测至原型链。

    >1. `对象.hasOwnProperty(属性)`仅检查在当前实例对象，不检测其原型链。
    >2. ie8-的DOM对象并非继承自Object对象，因此没有hasOwnProperty方法。

### 跨域请求

><details>
><summary>浏览器同源策略（协议、域名、端口号，必须完全相同）限制</summary>
>
>- 当一个资源从非同源中请求资源时，资源会发起一个跨域HTTP请求。出于安全原因，**浏览器**限制：从**脚本**内发起的跨源HTTP请求 或 拦截跨域HTTP响应。
>
>1. 跨域请求（XMLHttpRequest、Fetch等）不一定是浏览器限制了发起跨站请求，也可能是跨站请求可以正常发起，但返回结果被浏览器拦截。
>2. 现代浏览器会进行CORS处理，发起请求并与服务器协商（特例：有些浏览器不允许从HTTPS跨域访问HTTP，在请求还未发出时就拦截请求）。低版本浏览器可能不会发起跨域请求，直接拒绝发起请求。
></details>

1. [CORS](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTTP相关/README.md#corscross-origin-resource-sharing跨域资源共享)（服务端需要支持）

    >ie9-的jQuery的非jsonp的AJAX跨域，要添加`jQuery.support.cors = true`。
2. jsonp（服务端需要支持）

    >只支持**GET**请求。

    网页通过添加一个`<script>`，向服务器发起文档请求（不受同源政策限制）；服务器收到请求后，将数据放在一个指定名字的回调函数里传回网页直接执行。

    ><details>
    ><summary>jQuery在它的<code>AJAX</code>方法中封装了<code>jsonp</code>功能</summary>
    >
    >```javascript
    >$.ajax({
    >    url: '接口地址',
    >    dataType: 'jsonp',
    >    jsonp: '与服务端约定的支持jsonp方法',  // 前端唯一需要额外添加的内容
    >    data: {},
    >    success: function(data) {
    >        // data为跨域请求获得的服务端返回数据
    >    }
    >})
    >```
    ></details>

><details>
><summary>不同源的文档间（文档与<code><iframe></code>、文档与<code>window.open()</code>的新窗口）不能进行JS交互操作</summary>
>
>1. 可以获取window对象，但无法进一步获取相应的属性、方法。
>2. 无法获取DOM、`cookie`、`Web Storage`、`IndexDB`。
></details>

3. `document.domain`相同则可以文档间互相操作

    把不同文档的`document.domain`设置为一致的值（仅允许设置为上一级域），即可双向通信、互相操作（`cookie`可以直接操作；`localStorage`、`IndexDB`只能通过`postMessage`通信）。

    1. 与`<iframe>`通信：

        ```javascript
        // 父窗口调用`<iframe>`的window对象
        var newIframe = document.getElementById('new-iframe').contentWindow;    // 或：window.frames[0]


        // `<iframe>`调用父窗口的window对象
        var father = parent;
        ```
    2. 与`window.open()`的新窗口通信：

        ```javascript
        // 父窗口调用新打开窗口的window对象
        var newWin = window.open('某URL');


        // 新打开窗口调用父窗口的window对象
        var father = window.opener;
        ```
4. `postMessage`文档间通信

    >ie8、ie9仅支持与`<iframe>`，ie10+支持与`<iframe>`、`window.open()`的新窗口。不实行同源政策。

    ```javascript
    // 发送方
    目标window对象.postMessage(message, '目标源地址或*');


    // 监听的文档
    window.addEventListener('message', function(e) {
      console.log(e);
    },false);
    ```
5. 其他方式

    1. 父窗口改变`<iframe>`的hash，`<iframe>`通过监听hash变化的`hashchange`事件获取父窗口信息

        >ie8+支持。若只改变hash值，页面不会重新刷新。

        ```javascript
        // 父窗口改变`<iframe>`的hash值
        document.getElementById('new-iframe').src = '除了hash值，url不变（父级与`<iframe>`不需要同源）';


        // `<iframe>`窗口监听hash变化，以hash变化当做信息的传递
        window.onhashchange = function(){
            var message = window.location.hash;
            // ...
        };
        ```
    2. 通过监听`window.name`传递信息

        >同会话（tab窗口）前后跳转的页面都可以读取、设置同一个`window.name`值。

        1. 父窗口打开一个子窗口，载入一个不同源的网页，该网页将信息写入`window.name`属性。
        2. 子窗口跳回一个与主窗口同域的网址（文档间访问`window.name`遵循同源策略）。
        3. 主窗口可以读取子窗口的`window.name`值作为信息的传递。
    3. 图片地址

        只能发送GET请求，无法访问服务器的响应文本。只能浏览器向服务器单向通信。

        >常用来[统计](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js用请求图片作log统计)。

### Web Storage && cookie
>1. 因为HTTP请求都会携带cookie，因此cookie最好仅用于服务端判定状态。
>2. 浏览器数据存储方式：cookie、Web Storage、IndexedDB、Web SQL、Manifest、Service Workers。

1. Web Storage（`localStorage`、`sessionStorage`）

    1. 客户端保存，不参与服务器通信。
    2. 对象形式，键-值的值都会转换为字符串（若不是字符串则它的`toString`方法）。
    3. ie8+支持（ie及FF需在web服务器里运行）。

        >ie6/7可以用它们独有的`UserData`代替使用。
    4. 单个对象数据大小5M+。
    5. 拥有方便的api

        调用`localStorage`、`sessionStorage`对象会为每个源（每个tab）创建独立的`Storage`对象，每个对象都拥有：`setItem`、`getItem`、`removeItem`、`clear`、`key`方法，`length`属性。
    6. 区别

        1. `localStorage`

            1. 同源共享。
            2. 持久化本地存储（关闭浏览器后继续保存；除非被清除，否则永久保存）。
            3. 应用场景：所有需要长期本地存储的数据。
        2. `sessionStorage`

            1. 同源且同会话（tab窗口）共享。
            2. 会话级别存储。跳转页面为同源后仍旧有效（不同tab不共通），关闭浏览器后被清除（重新加载或关闭后恢复，任然存在）。
            3. 应用场景：需要拆分成多个子页面分别存储的数据。
2. cookie：

    1. 客户端保存（JS添加或响应头设置），始终在HTTP请求中携带（同源同路径），明文传递，服务端接收、操作客户端cookie。

        >1. cookie中的`domain`（默认：当前域名），可设置为父域名或当前域名，不能设置为其他域名（设置失效）。
        >2. 当前域名可以访问`domain`为当前域名或父域名的cookie；浏览器发起HTTP请求时会向请求地址发送与请求域名相同或是其父域名的cookie。
    2. 字符串形式：`名1=值1[; 名2=值2]`。不能包含任何`,`、`;`、` `（使用`encodeURIComponent/decodeURIComponent`）。
    3. 所有浏览器都支持。
    4. 单域名内，cookie保存的数据不超过4k，数量（最少）20个。
    5. 源生的cookie接口不友好，需要自己[封装操作cookie](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/废弃代码/README.md#原生js操作cookie)。

        - JS的`document.cookie`：

            1. 新建或更新cookie等同于服务端`Set-Cookie`响应头：一次设置一条cookie的`名=值[; expires=绝对时间][; max-age=相对时间][; domain=域名][; path=路径][; secure]`。

                >`Set-Cookie`额外可以设置`[; HttpOnly]`属性。
            2. 读取cookie等同于客户端`Cookie`请求头：展示所有cookie的`名1=值1[; 名2=值2]`（无法查看其他信息）。
    6. 同源且同路径共享。
    7. 默认：关闭浏览器后失效（存储在内存）；设置失效时间则到期后失效（存储在硬盘）。
    8. 应用场景：服务端确定请求是否来自于同一个客户端（cookie与服务端session配合），以确认、保持用户状态。

    ><details>
    ><summary>僵尸cookie（<a href="https://en.wikipedia.org/wiki/Zombie_cookie">zombie cookie</a>）</summary>
    >是指那些删不掉的，删掉会自动重建的cookie。僵尸cookie是依赖于其他的本地存储方法（如：flash的share object、HTML5的local storages等），当用户删除cookie后，自动从其他本地存储里读取出cookie的备份，并重新种植。
    ></details>

>隐身模式策略：存储API仍然可用，并且看起来功能齐全，只是无法真正储存（如：分配储存空间为0）。

### 错误处理机制
>1. 当JS出现错误时，JS引擎会根据JS调用栈逐级寻找对应的`catch`，如果**没有找到相应的catch handler**或**catch handler本身又有error**或**又抛出新的error**，就会把这个error交给浏览器，浏览器会用各自不同的方式显示错误信息，可以用`window.onerror`进行自定义操作。
>2. 在某个**JS block**（`<script>`或`try-catch`的`try`语句块）内，第一个错误触发后，当前JS block后面的代码会被自动忽略，不再执行，其他的JS block内代码不被影响。

1. 原生错误类型

    >来自：[MDN:Error](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error)。
2. 自定义错误

    ```javascript
    // ES5
    function MyError(message) {
        this.stack = (Error.call(this, message)).stack;
        this.message = message || '默认信息';
        this.name = 'MyError';
    }
    MyError.prototype = Object.create(Error.prototype, {constructor: {value: MyError}});


    // ES6的class-extends
    class MyError extends Error{}
    ```
3. 手动抛出错误

    ```javascript
    throw 'Error';                  // 抛出字符串
    throw 100;                      // 抛出数值
    throw true;                     // 抛出布尔值
    throw {message: 'An Error'};    // 抛出对象
    throw new Error('An Error');    // 抛出Error类型错误
    ```
4. 处理代码中抛出的错误

    1. `try-catch-finally`

        1. 必须`try-catch`或`try-finally`或`try-catch-finally`同时出现。
        2. 如果有`catch`，一旦`try`中抛出错误以后就先执行`catch`中的代码，然后执行`finally`中的代码。
        3. 如果没有`catch`，`try`中的代码抛出错误后，先执行`finally`中的语句，然后将`try`中抛出的错误往上抛。
        4. 如果`try`中代码是以`return`、`continue`或`break`终止的，必须先执行完`finally`中的语句后再执行相应的`try`中的返回语句。
        5. 在`catch`中接收的错误，不会再向上提交给浏览器。

        >`try`内的作用域不为内部异步操作保留：`try {setTimeout(() => {错误语法}, 0)} catch (e) {}`不会捕获异步操作中的错误（同理，在`Promise`或`async-await`等语法中的异步错误也无法被捕获）。可以在异步回调内部再包一层`try-catch`。
    2. `window.onerror`

        >jQuery不建议`on`等方式绑定`window`的`error`事件，只通过`window.onerror`定义。

        1. 没有经过`try-catch`处理的错误都会触发`window`的`error`事件。
        2. 用方法赋值给`window.onerror`后，但凡这个window中有JS错误出现，则会调用此方法。
        3. `window.onerror`方法会传入多个参数：`message`、`fileName`、`lineNumber`、`columnNumber`、`errorObject`。
        4. 若方法返回`true`，浏览器不再显示错误信息；若返回`false`，浏览器还是会提示错误信息。

        ```javascript
        /**
         * window错误处理
         * @param {String} msg - 错误信息提示
         * @param {String} url - 错误出现url
         * @param {Number} line - 错误出现行数字
         * @param {Number} column - 错误出现列数字
         * @param {Object} error - 错误对象
         * @returns {Boolean} - true：不显示错误信息|false：显示
         */
        window.onerror = function (msg, url, line, column, error) {
            /* code */

            return true;    // 浏览器不再显示错误信息
        };


        // window.addEventListener('error', (event) => {})  // 错误信息都在event中；无法设置：浏览器不再显示错误信息
        ```

        >未捕获的Promise的失败，不会触发 ~~`window`的`error`事件~~，仅会触发`window`的`unhandledrejection`事件。
    3. 图像的`onerror`事件

        >1. 只要图像的src属性中的URL不能返回能被识别的图像格式，就会触发图像的`error`事件。
        >2. 错误不会提交到~~window.onerror~~。
        >3. `Image`实例或`<img>`的`error`事件没有任何参数。

        1. `<img>`的`error`事件

            ```html
            <img src="错误地址" onerror="func();">
            ```
        2. `Image`实例的属性

            ```javascript
            var img = new Image();  // 或document.createElement('img');

            img.onerror = function () {
                /* code */
            };

            img.src = '错误地址';
            ```
5. 运用策略

    1. 非客户端页面

        仅需在加载JS之前配置好`window.onerror`。
    2. 客户端内嵌页面

        1. 在加载JS之前配置好`window.onerror`。
        2. 客户端回调函数嵌套一层`try-catch`，提示**哪个方法发生错误等额外信息**。

            >因为Native调用WebView的方法是直接通过函数运行JS代码，抛出错误时`window.onerror`传入的参数仅有第一个`message`参数。
        3. （可选）为了避免**JS代码还未加载完毕客户端就调用回调函数**，需在Native调用JS代码时嵌套一层`try-catch`（服务端代码中添加），提示**哪个方法发生错误等额外信息**。

    >捕获错误的目的在于避免浏览器以默认方式处理它们；而抛出错误的目的在于提供错误发生具体原因的消息。

    - 对于打包压缩的JS，可以用sourcemap进行还原定位错误位置，并且可以把sourcemap放在仅允许特殊IP访问的地方以限制外网人员查看。

### 预加载
1. JS预加载图片

    ```javascript
    var img = new Image();  // 或document.createElement('img');

    img.src = '图片地址';

    img.onerror = function () {
        console.log('加载失败');
    };

    if (img.complete) {
        console.log('缓存');
    } else {
        img.onload = function () {
            console.log('新加载');
        };
    }
    ```

    >vue的某个懒加载库：[vue-lazyload](https://github.com/hilongjw/vue-lazyload)。
2. `<link>`预加载

    1. `<link rel="dns-prefetch" href="域名">`

        解析DNS。
    2. `<link rel="preconnect" href="域名">`

        解析DNS，建立TCP握手连接、TLS协议。
    3. `<link rel="prefetch" href="资源">`

        （低优先级）请求、下载、缓存资源。
    4. `<link rel="subresource" href="资源">`

        （高优先级）请求、下载、缓存资源。
    5. `<link rel="prerender"  href="域名">`

        就像在后台打开了一个隐藏的tab，下载域名的所有资源、创建DOM、渲染页面、执行JS等等。
    6. `<link rel="preload" href="资源">`

        请求、下载、缓存资源。
3. CSS背景图片预加载。

### 循环遍历
><details>
><summary>约定</summary>
>
>`obj`为对象实例，`arr`为数组实例。
></details>

>1. `continue`应用在循环（`while`、`do-while`、`for`、`for-in`、`for-of`），表示跳过当次循环；`break`应用在循环、`switch`，表示跳出整个循环。
>2. `forEach`、`map`、`filter`、`some`、`every`无法中止循环（`return`只结束回调函数）。
>3. `$.each/$dom.each`跳出循环用`return true`（功能等价于：`continue`）、`return false`（功能等价于：`break`）。

1. 原生JS

    1. <details>

        <summary><code>while</code>、<code>do-while</code></summary>

        ```javascript
        while (跳出判断) {

        }
        ```

        ```javascript
        do {

        } while (跳出判断);
        ```
        </details>
    2. <details>

        <summary><code>for</code></summary>

        ```javascript
        for (执行一次; 跳出判断; 每执行一次后执行) {

        }
        ```
        </details>
    3. <details>

        <summary><code>for-in</code></summary>

        遍历对象自身和继承的可枚举属性。

        ```javascript
        /* i为数组当前项的索引或对象当前项的属性名 */
        for (var i in obj或arr) {

        }
        ```
        </details>
    4. <details>

        <summary><code>for-of</code></summary>

        遍历可迭代对象的每个元素。

        ```javascript
        /* i为迭代对象的属性值 */
        for (let i of 可迭代对象) {

        }
        ```
        </details>

    ><details>
    ><summary>若在<code>for-in/for-of</code>中改变了原对象/原数组，不会影响遍历的项和顺序，但直接使用原对象/原数组会展示修改后的值。</summary>
    >
    >e.g.
    >
    >```javascript
    >let originObj = { a: 'aa', b: 'bb', c: 'cc' }
    >for (let key in originObj) {
    >  originObj = 1
    >  console.log(key, originObj)  // 输出：`'a' 1`；`'b' 1`；`'c' 1`
    >}
    >// originObj 等于 1
    >
    >
    >let originArr = ['a', 'b', 'c']
    >for (let item of originArr) {
    >  originArr = [1]
    >  console.log(item, originArr) // 输出：`'a' [1]`；`'b' [1]`；`'c' [1]`
    >}
    >// originArr 等于 [1]
    >```
    ></details>

    5. Array方法

        ><details>
        ><summary>若在Array遍历的回调函数中改变了原数组，不会影响遍历函数中的<code>当前值, 索引, 数组整体</code>和原本遍历顺序，但直接使用原数组（不是回调函数内的参数）会展示修改后的数组。</summary>
        >
        >```javascript
        >// e.g.
        >let originArr = ['a', 'b', 'c']
        >originArr.forEach((item, index, arr) => {   // 或其他所有Array.prototype.遍历方法
        >  originArr = [item]
        >  console.log(arr, originArr)   // 输出：`['a', 'b', 'c'] ['a']`；`['a', 'b', 'c'] ['b']`；`['a', 'b', 'c'] ['c']`
        >})
        >// originArr 等于 ['c']
        >```
        ></details>

        参数均为：`回调函数(当前值, 索引, 数组整体)[, this替代]`。

        1. `Array.prototype.forEach()`

            对数组的每个元素执行一次提供的函数。
        2. `Array.prototype.map()`

            数组中的每个元素调用提供的函数，组成新的数组。
        3. `Array.prototype.filter()`

            使用提供的函数测试所有元素，并创建包含所有通过测试的元素的新数组。
        4. `Array.prototype.every()`

            测试数组中是否所有元素都通过提供的函数。
        5. `Array.prototype.some()`

            测试数组中是否有一个元素通过提供的函数。
        6. `Array.prototype.find()`

            查找数组中通过提供的函数的第一个元素。
        7. `Array.prototype.findIndex()`

            查找数组中通过提供的函数的第一个元素的索引。

        >- 向后/向前对数组应用提供的函数，累计处理返回最后一个结果
        >
        >    1. `Array.prototype.reduce(回调函数(上一次调用返回的值, 当前值, 索引, 数组整体)[, 第一次调用回调函数的第一个参数])`
        >    2. `Array.prototype.reduceRight(回调函数(上一次调用返回的值, 当前值, 索引, 数组整体)[, 第一次调用回调函数的第一个参数])`
2. jQuery

    1. <details>

        <summary><code>$.each</code></summary>

        ```javascript
        /* index为数组当前项的索引或对象当前项的属性名或jQuery对象的索引，item为当前项的值（不是jQuery对象，是DOM对象，与this相同） */
        $.each(obj或arr或$dom, function (index, item) {

        });
        ```
        </details>
    2. <details>

        <summary><code>$dom.each</code></summary>

        ```javascript
        /* index为jQuery对象的索引，item为当前项的值（不是jQuery对象，是DOM对象，与this相同） */
        $dom.each(function (index, item) {

        });
        ```
    3. `$.grep`

        类似`Array.prototype.filter`

### 判断对象、方法是否定义
1. 判断对象方法是否可以执行

    ```javascript
    /* 对象已经定义 && 对象不等于null && 对象方法存在 */
    if (typeof obj !== 'undefined' && obj !== null && typeof obj.func === 'function') {
        /* 对象方法已定义 可执行 */
    }
    ```
2. 判断全局对象方法是否可以执行

    ```javascript
    /* window的子对象存在 && 对象方法存在 */
    if (window.obj && typeof window.obj.func === 'function') {
        /* 对象方法已定义 可执行 */
    }
    ```
3. 判断是否需要重新定义

    ```javascript
    /* 对象不存在 || 对象等于null || 对象方法不存在 */
    if (typeof obj === 'undefined' || obj === null || typeof obj.func !== 'function') {
        /* 对象或对象方法没有定义 需重新定义 */
    }
    ```
4. 变量已定义

    ```javascript
    /* 变量已定义 && 变量不等于null */
    if (typeof a !== 'undefined' && a !== null) {
        /* 对象已定义 可操作 */
    }
    ```

### javascript伪协议
>伪协议（自定义协议）：操作系统提供支持的、为关联应用程序而使用的、在标准协议（`http`、`https`、`ftp`等）之外的，一种协议（`mailto`、`tel`、`file`、`data`、`自定义URL Scheme`等）。

1. 由JS解释器运行，若最后一个执行结果（`;`分割执行语句）是`String`类型，则返回给当前页面替换原页面内容（允许任何HTML标签）
2. 所有直接修改URL的地方都可使用，如：`<a>`、`<iframe>`、`<img>`的`src`属性，`window.location.href`，`window.open`
3. 为了JS与HTML解耦合，尽量不要使用其进行JS逻辑

---
## 性能原理

### JS的预编译
>参考：[JavaScript - 预编译](http://www.jianshu.com/p/a91cddc5c705)。

1. JS是一门脚本语言，不经过~~编译~~而直接运行，但运行前先进行预编译。
2. JS的预编译是以代码块`<script></script>`为范围，即每遇到一个代码块都会进行：**预编译 -> 执行**。
3. 预编译：在内存中开辟一块空间，用来存放**变量**和**函数**。

    为使用`var`声明的变量、使用`function`声明的函数在内存中开辟一块空间，用来存放两者声明（不会赋值，所有变量的值都是`undefined`、函数内容会被预编译）；

    >`const/let`不允许同名声明。

    - 在预编译时，`function`的优先级比`var`高：

        1. 在预编译阶段，同时声明同一名称的函数和变量（顺序不限），会被声明为函数。
        2. 在执行阶段，如果变量有赋值，则这个名称会重新赋值给变量。

        ><details>
        ><summary>e.g.</summary>
        >
        >```javascript
        >// 预编译阶段a1/b2为函数，运行时a1/b2赋值成为变量
        >console.log(a1);        // function a1
        >var a1 = 1;
        >function a1() {}
        >console.log(a1);        // 1
        >
        >console.log(b2);        // function b2
        >function b2() {}
        >var b2 = 1;
        >console.log(b2);        // 1
        >
        >
        >// 预编译阶段c3/d4为函数，运行时没有赋值
        >console.log(c3);        // function c3
        >var c3;
        >function c3() {}
        >console.log(c3);        // function c3
        >
        >console.log(d4);        // function d4
        >function d4() {}
        >var d4;
        >console.log(d4);        // function d4
        >
        >
        >// 预编译阶段e5为变量，运行时被赋值给匿名函数
        >console.log(e5);        // undefined
        >var e5 = function () {};
        >console.log(e5);        // function 匿名
        >```
        ></details>
4. 变量赋值是在JS执行阶段（运行时）进行的。

### 函数
>函数是唯一拥有自身作用域的结构。

1. 每个函数都是一个`Function`对象，像普通对象一样拥有**属性**和**方法**。

    1. 函数拥有

        1. `length`：希望接收的命名参数个数（计数到`默认参数`或`剩余参数`之前的参数）
        2. `name`：函数名
        3. `prototype`：（函数独有）指向函数的原型对象
    2. ES6不建议使用（部分情况下导致报错）：

        1. 函数体内的`arguments.callee`是一个指针：其指向拥有`arguments`对象的函数（函数自身）。
        2. `函数对象.caller`：保存调用当前函数的函数（嵌套的外一层函数）的引用。
        3. 函数体内的`arguments.caller`（值为`undefined`，仅为分清`arguments.caller`和`函数对象.caller`）。
2. 函数总有返回值。

    1. 执行函数：默认返回`undefined`。
    2. 实例化（`new`）：默认返回`this`。
3. 创建函数的方式：

    1. 构造函数

        `var 名字 = new Function([多个参数, ]函数体字符串);`

        >直接调用`Function`（不使用`new`操作符）的效果与调用构造函数一样，区别是`this`指向`window`。
    2. 函数声明（函数语句）

        `function 名字(多个参数) {/* 函数体 */};`
    3. 函数表达式（function expression）

        `var 名字 = function(多个参数) {/* 函数体 */};`（变量赋值为`匿名函数`或`箭头函数`）

    >1. 通过**函数声明**、**函数表达式**创建的函数，在加载脚本时和其他代码一起解析；通过**构造函数**定义的函数，在构造函数被执行时才解析函数体字符串。
    >2. 不建议通过~~构造函数~~创建函数，因为作为字符串的函数体可能会阻止一些JS引擎优化，也会引起其他问题。
4. 匿名函数、[箭头函数](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/标准库文档.md#箭头函数)

    只能提供给其他变量引用、或自执行。

    ><details>
    ><summary>匿名函数：可以添加仅在匿名函数内部才能使用的函数名字，主要用于在执行栈中标记匿名函数的函数名（主要针对：自执行匿名函数），而不只是显示<code>anonymous</code></summary>
    >
    >e.g.
    >
    > ```javascript
    > var func1 = function func2() { // 其中函数名`func2`只能在函数体内部使用。
    >    console.log(typeof func1);  // function
    >    console.log(typeof func2);  // function
    > };
    >
    > func1();
    >
    > console.log(typeof func1);     // function
    > console.log(typeof func2);     // undefined
    > ```
    ></details>
5. 实例化（`new`）一个构造函数

    `new`得到的实例对象，拥有构造函数体内使用`this`定义的属性和方法，且拥有构造函数的原型对象上的属性和方法（因为实例的`[[Prototype]]`指向`构造函数.prototype`）；在构造函数体内`var`的变量和`function`无法被这个对象使用，只能在构造函数里使用（类似私有变量）。

    >相对于单全局变量，构造函数更加灵活，可以生成多个对象进行互相独立的操作。

    - <details>

        <summary><code>new</code>一个构造函数执行的步骤</summary>

        e.g. `var newObj = new Func(para);`

        1. 创建一个空对象（假设为obj）：

            `var obj = {};`
        2. 设置obj的`[[Prototype]]`指向构造函数的原型对象：

            `obj.__proto__ = Func.prototype;`或`Object.setPrototypeOf(obj, Func.prototype);`

        >第一、二步骤也可以用`var obj = Object.create(Func.prototype);`代替。

        3. 使用obj作为上下文调用构造函数，并传入参数：

            `Func.call(obj, para);`
        4. newObj赋值

            1. 若Func返回**引用数据类型**，则这个引用数据类型的值赋值给newObj。
            2. 若Func返回基本数据类型或返回this或无返回，则obj赋值给newObj。
        </details>

    >1. `new Func`等价于：`new Func()`。
    >2. `new Obj().func()`等价于：`(new Obj()).func()`（先新建实例，再调用实例的原型链）。
    >3. `new Obj.func()`等价于：`new (Obj.func)()`、`new (Obj.func)`、`new Obj.func`（新建实例）。
6. 函数调用类型

    1. 直接函数调用（如：`alert();`）、立即调用的函数表达式（如：`(function () {}());`）

        `this`：全局对象`window`（与在什么作用域无关）
    2. 对象的方法调用（如：`obj.func();`）

        `this`：上级对象（调用的`obj`）
    3. 构造函数实例化（如：`new RegExp();`）

        `this`：新实例对象
    4. 间接调用（`alert.call(传入的对象);`或`apply`）

        `this`：传入的对象

    - 总结：`this`——调用函数的那个对象

        <details>
        <summary>e.g.</summary>

        ```javascript
        var x = 'global';

        function test() {
            console.log(this.x + '|' + _test() + '|' + (function () {return this.x;}()));

            function _test() {

                return this.x;
            }
        }

        /* window：方法没有对象调用（直接函数调用、立即调用的函数表达式，且与作用域无关） */
        test();                 // global|global|global

        var obj1 = {
            x: 1,
            test: function () {
                var that = this;

                return function () {

                    console.log(this.x + '|' + that.x);
                };
            }
        };
        (obj1.test()());        // global|1


        /* 上级对象：函数作为某个对象的方法调用 */
        var obj2 = {};
        obj2.x = 2;
        obj2.func = test;
        obj2.func();            // 2|global|global


        /* 新实例对象：构造函数 */
        function Test() {
            this.x = 3;
            console.log(this.x + '|' + _test() + '|' + (function () {return this.x;}()));

            function _test() {

                return this.x;
            }
        }
        var obj3 = new Test();  // 3|global|global


        /* 传入的指定对象：apply或call调用 */
        var obj4 = {x: 4};
        obj2.func.call(obj4);   // 4|global|global
        ```
        </details>
7. <a name="函数-参数"></a>参数

    1. 参数变量在函数体内是默认声明的（传递进函数体），所以不能在函数体内用`let`或`const`再次声明同名参数（`var`可以）。
    2. 使用**参数默认值**时的特殊情况：

        1. 调用函数时，根据传参为`undefined`或不传，才进行参数默认值的表达式值计算（惰性求值），默认值是运行时执行而不是~~定义时执行~~（若默认值是调用其他函数，则当且仅当传参为`undefined`或不传参时才执行其他函数）。
        2. 调用函数时，所有参数会形成一个单独作用域（context）进行初始化，初始化结束则作用域消失。此作用域中的参数进行类似`let`定义，因此函数不能有同名参数。

            ><details>
            ><summary>e.g.</summary>
            >
            >```javascript
            >function f1(y1 = x1) {     // 形成短暂的单独作用域，x1没有定义，向父级作用域取值，取不到则报错
            >  let x1 = 'x1'
            >  console.log(y1)
            >}
            >f1()                       // ReferenceError: x1 is not defined
            >
            >
            >let x2 = 'outer x2'
            >function f2(y2 = x2) {     // 形成短暂的单独作用域，x2没有定义，向父级作用域取值
            >  let x2 = 'x2'
            >  console.log(y2)
            >}
            >f2()                       // 'outer x2'
            >
            >
            >let x3 = 'outer x3'
            >function f3(x3, y3 = x3) { // 形成短暂的单独作用域，x3是传参定义的值，不向父级作用域取值
            >  console.log(y3)
            >}
            >f3()                       // undefined
            >f3(3)                      // 3
            >
            >
            >let x4 = 'outer x4'
            >function f4(x4 = x4) {     // 形成短暂的单独作用域，实际执行类似let x = x，暂时性死区导致报错
            >
            >}
            >f4()                       // ReferenceError: x is not defined
            >```
            >></details>
        3. 不能~~在参数默认值中调用函数体内的方法~~（参数默认值总是被首先执行，而函数体内的函数声明之后生效）。
    3. 建议参数都用对象形式传递，且形参设置为解构赋值+默认参数。

        >e.g. `function func ({ para1 = 'default', para2 } = {}) {}`
    4. 参数的数量有限制，如：有些JS引擎限制在`Math.pow(2, 16)`。

### 闭包（closure）
1. 当函数体内定义了其他函数时，就创建了闭包。内部函数总是可以访问其所在的外部函数中声明的内容（链式作用域），即使外部函数执行完毕（寿命终结）之后。
2. 闭包：能够读取其他函数体内变量的函数。由两部分构成：**函数**、**上下文环境**（链式作用域）。
3. 闭包通常用来创建私有变量或方法，使得这些内容不被外部访问，同时又可以通过指定的闭包函数访问。

- 产生效果：

    1. 可以操作函数体内的私有内容（特权方法）。
    2. 让被操作的私有内容始终保持在内存中不被垃圾回收。
    3. 占用较多的内存。

### 原型
1. 构造函数、原型对象、实例、原型链

    1. 只有函数有`prototype`属性，指向函数的原型对象。

        互相连接：函数拥有`prototype`属性指向其原型对象，原型对象拥有`constructor`属性指向函数。

        >构造函数通过`prototype`为实例存储要共享的属性和方法，可设置`prototype`指向其他对象来继承其他对象。
    2. 当构造函数实例化（`new`），该实例拥有`[[Prototype]]`属性，指向**构造函数的原型对象**。

        >访问对象的`[[Prototype]]`属性：`对象.__proto__`（非标准）、`Object.getPrototypeOf/setPrototypeOf(对象)`。

        1. 连接存在于**实例**与**构造函数的原型对象**之间，而不直接存在于~~实例与构造函数~~之间。
        2. 内置构造函数的原型上有各种方法和属性，实例对象通过原型链进行调用。
    3. 每个引用数据类型都有`[[Prototype]]`属性，指向`自己的构造函数.prototype`（原型对象）。

        >每个引用数据类型都显式或隐式由某个构造函数创建。
    4. 不断向上的`[[Prototype]]`属性，构成了原型链。

        >访问一个引用数据类型的属性：若这个属性在对象自身中不存在，则向上查找其`[[Prototype]]`指向的对象；若依然找不到，则继续向上查找（其`[[Prototype]]`指向的对象的）`[[Prototype]]`指向的对象，直到原型终点。

        原型链终点是`null`，倒数第二是`Object.prototype`。

    <details>
    <summary>e.g.</summary>

    ```javascript
    var A = function () {};
    var a = new A();

    console.log('原型与构造函数：', A.prototype.constructor === A)
    console.log('实例与原型：', a.__proto__ === A.prototype)
    console.log('实例与构造函数:', a.__proto__.constructor === A)

    /*
     若a.constructor无定义，则向上查找a.__proto__.constructor；
     若依然没有定义，则继续向上查找a.__proto__.__proto__.constructor；
     ...
     直到原型链终点。
    */

    console.log(a.__proto__.__proto__ === Object.prototype)
    console.log(a.__proto__.__proto__.__proto__ === null)
    ```
    </details>
2. 如果重写原型的值（不是添加），可以给原型添加`constructor`属性并指向**构造函数**

    ```Javascript
    var A = function () {};

    A.prototype = {
        other: '...'
    };

    if (typeof Object.defineProperty === 'function') {

        // 使属性：不可以改变描述符、不可以删除、不可以枚举、不可以被赋值运算符改变
        Object.defineProperty(A.prototype, 'constructor', {
            value: A
        });
    } else {
        A.prototype.constructor = A;
    }
    ```
3. 通过**原型链**实现**继承**

- 纯粹的空对象（没有继承`Object.prototype`的空对象，原子空对象）：

    `Object.create(null)`或`Object.setPrototypeOf({}, null)`

    >`{}`等价于：`Object.create(Object.prototype)`

### 继承
1. 继承原理

    1. 子类继承父类属性：在子类构造函数体内调用父类构造函数。
    2. 子类继承父类原型链 ：

        1. 将父类构造函数的实例赋值给子类构造函数的原型，或ES6`Son.prototype = Object.create(Father.prototype)`
        2. 使用ES6的`class-extends`则自动实现
2. 继承方式

    1. ES6：`class-extends`

        **能够继承原生构造函数**：先新建父类的实例对象`this`，然后再用子类的构造函数修饰`this`，使得父类的所有行为都可以继承。

        ```javascript
        class Father {
          constructor (...args) {   // 可省略
            // this.
          }

           父类方法 () {}
        }

        class Son extends Father {
          constructor (...args) {   // 可省略
            super(...args)
            // this.
          }

          子类方法 () {}
        }


        /* 使用测试 */
        Son.prototype.__proto__ === Father.prototype    // true
        Son.__proto__  === Father                       // true


        var instance1 = new Father('父para');
        var instance2 = new Son('子para1', '子para2');
        console.log(instance1, instance2);
        ```
    2. ES5模拟：寄生组合式继承

        **无法继承原生构造函数**：先新建子类的实例对象`this`，再将父类的属性添加到子类上，导致父类的内部属性无法获取。

        ```javascript
        /* 父类定义： */
        function Father(fatherPara) {
            // 私有属性用let；静态私有属性用const

            /* 父类属性 */
            this.父类属性 = fatherPara;
        }

        /* 父类原型链 */
        Father.prototype.父类原型链方法 = function () {};


        /* 子类定义： */
        function Son(sonPara1, sonPara2) {
            /* 子类继承父类属性 */
            Father.call(this, sonPara1);

            /* 子类属性 */
            this.子类属性 = sonPara2;
        }

        /* 子类继承父类原型链 */
        Son.prototype = new Father();
        Son.prototype.constructor = Son;
        // 或ES6：Son.prototype = Object.create(Father.prototype, {constructor: {value: Son}});

        Son.__proto__  = Father;    // 同步class的实现

        /* 子类原型链 */
        Son.prototype.子类原型链方法 = function () {};


        /* 使用测试 */
        Son.prototype.__proto__ === Father.prototype    // true
        Son.__proto__  === Father                       // true


        var instance1 = new Father('父para');
        var instance2 = new Son('子para1', '子para2');
        console.log(instance1, instance2);
        ```

        ><details>
        ><summary>“子类继承父类原型链”可改为的不使用<code>Object.create</code>方式</summary>
        >
        >```javascript
        >(function (subType, superType) {
        >    function _object(o) {
        >        function F() {}
        >        F.prototype = o;
        >        return new F();
        >    }
        >
        >    var prototype = _object(superType.prototype);
        >    prototype.constructor = subType;
        >    subType.prototype = prototype;
        >}(Son, Father));
        >```
        ></details>

### 内存机制
1. JS自动完成内存分配、[回收](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/README.md#垃圾回收)。
2. [变量](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/基础知识.md#js数据类型)在内存中的存储

    1. 栈内存（stack）：

        >先进后出，寄存速度快，栈数据可共享，系统自动分配，数据固定不灵活，空间大小有限制，超出则栈溢出。

        存储内容：变量标识（指向基本数据类型、引用数据类型的地址）、基本数据类型、引用数据类型的地址。
    2. 堆内存（heap）：

        >顺序随意，寄存速度慢，由程序申请，操作简单，存储空间较大（取决于系统有效虚拟内存）。

        存储内容：引用数据类型。
3. 变量的值传递

    变量（包括函数的参数）都是**值传递**（变量指向的值复制给另一个变量去指向）。

    1. 引用数据类型的浅复制

        1. 复制对象A时，对象B将复制A的所有字段。若字段是引用数据类型（内存地址），B将复制地址；若字段是基本数据类型，B将复制其值。
        2. 缺点：如果改变了对象B（或A）所指向的内存地址所存储的值，同时也改变了对象A（或B）指向这个地址所存储的值。
    2. 引用数据类型的深复制

        1. 新开辟一个内存空间，完全复制所有数据至新的空间，新对象指向这个新空间的地址（原对象不变化）。
        2. 优点：B与A不会相互依赖（A，B完全脱离关联）；缺点：复制的速度更慢，代价更大。

    - 数组（对象）的值传递

        >对于数组`arr`或对象`obj`。

        1. 清空数组（对象）

            1. 不改变原始数组（对象）

                `arr = []   // （新赋值一个空数组）`

                >对象：`obj = {}   // （新赋值一个空对象）`
            2. 改变原始数组（对象）

                `arr.length = 0`或`arr.splice(0, arr.length)`

                >对象：遍历属性并`delete`
        2. 改变传入函数的数组（对象），但不改变实参

            >不考虑原型链。

            1. 浅复制：

                1. `arr = [...arr]`（ES6的展开元素）

                    >对象：`obj = {...obj}`
                2. `[...arr] = arr`（ES6的解构赋值的剩余参数）

                    >对象：`({...obj} = obj)`
                3. `arr = arr.slice()`或`arr = arr.concat()`

                    >对象：`obj = Object.assign({}, obj)`（不建议用 ~~`obj = Object.create(obj)`~~）
                4. 一层[循环遍历](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#循环遍历)赋值
            2. [深复制](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#深复制拷贝实现思路)。
4. <details>

    <summary>存储、值传递步骤举例</summary>

    ```javascript
    // e.g.
    var a = 'test1';            // i
    var b = {'key': 'test1'};   // ii
    var c = a;                  // iii
    c = 'test2';                // iv
    var d = b;                  // v
    d['key'] = 'test2';         // vi
    ```

    1. `var a = 'test1';`步骤：

        1. 声明a：查找栈内存中是否存在a，不存在则创建，不管是已存在还是新创建的a，都指向undefined。
        2. 为a赋值：在栈内存中查找'test1'，无则栈内存中创建'test1'，然后让a指向'test1'。
    2. `var b = {'key': 'test1'};`步骤：

        1. 声明b（同声明a）。
        2. 为b赋值：堆内存中创建{'key': 'test1'}，栈内存中创建其堆地址url_b，让b指向url_b。
    3. `var c = a;`步骤：

        1. 声明c（同声明a）。
        2. 为c赋值：在栈内存中查找a，找不到则抛出错误，找到a则让c指向a所指向的'test1'。
    4. `c = 'test2';`步骤：

        1. 在栈内存中查找c，未找到则声明一个全局变量c。
        2. 为c赋新值：在栈内存中查找'test2'，无则栈内存中创建'test2'，然后让c指向'test2'。
    5. `var d = b;`步骤：

        1. 声明d（同声明a）。
        2. 为d赋值：在栈内存中查找b，找不到则抛出错误，找到b则让d指向b所指向的url_b。
    6. `d['key'] = 'test2'`步骤：

        1. 在栈内存中查找d，找不到则抛出错误，找到d则通过其所指向url_b找到堆内存中的{'key': 'test1'}。
        2. 修改堆内存中的{'key': 'test1'}为{'key': 'test2'}。
    </details>

### 深复制（拷贝）实现思路
>参考：[深入剖析JavaScript的深复制](http://jerryzou.com/posts/dive-into-deep-clone-in-javascript/)。

1. [递归赋值](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/废弃代码/README.md#原生js深复制)（最全面方式）

    >深复制要处理的坑：循环引用、各种引用数据类型。
2. 针对**仅能够被json直接表示的数据结构（对象、数组、数值、字符串、布尔值、null）**：

    `JSON.parse(JSON.stringify(obj));`

>不考虑原型链。

### 内存泄漏
> 内存泄露：计算机内存逐渐丢失。当某个程序总是无法释放内存时，出现内存泄露。

- 不是内存泄漏，只是不会被垃圾回收：

    1. 全局变量不会被垃圾回收：合理创建全局变量。
    2. 被闭包引用的变量不会被垃圾回收：合理使用闭包。
    3. 被遗忘的计数器或回调函数：不使用时及时清除。

1. DOM清空或删除时事件绑定未清除，引起的内存泄漏：删除DOM前，先移除事件绑定。

    >jQuery的`empty`和`remove`会移除元素内部的一切，包括绑定的事件及与该元素相关的jQuery数据（data、promise等所有数据）；`detach`则保留所有jQuery数据。
2. <details>

    <summary>元素引用，引起的内存泄漏：指向DOM（包括后代）的变量，删除DOM后要设为<code>null</code>。</summary>

    ![内存泄漏图](./images/memory-leak-1.gif)

    ```javascript
    var refA = document.getElementById('refA');
    var refB = document.getElementById('refB');
    document.body.removeChild(refA);  // 尽管删除了，但DOM#refA不能GC回收，因为存在变量refA对它的引用

    refA = null;  // 将变量refA对DOM#refA引用释放，但因为子元素的间接引用，还是无法回收DOM#refA

    // 变量refB对DOM#refA的间接引用(变量refB引用了DOM#refB，而DOM#refB属于DOM#refA)

    refB = null;  // 将变量refB对DOM#refB的引用释放，DOM#refA和DOM#refB就可以被GC回收
    ```

    1. 黄色是指直接被JS变量所引用，在内存里。
    2. 红色是指间接被JS变量所引用，DOM#refA被DOM#refB间接引用，因此即使变量refA被清空，也没DOM被回收。
    3. DOM#refB由于属于parentNode，只要引用它的变量不释放，它所有的父元素（图中红色部分）都不会被删除。
    </details>

>随着JS引擎的更新，原来会导致内存泄漏的bug已经慢慢被修复，因此写代码时不太需要注意内存泄漏问题（误）。

### 数据类型转换
>参考：[阮一峰：数据类型转换](http://javascript.ruanyifeng.com/grammar/conversion.html)、[ecma-262等于比较](https://www.ecma-international.org/ecma-262/#sec-abstract-equality-comparison)。

1. 强制转换

    1. `Number(参数)`

        1. 基本数据类型：

            e.g.

            ```javascript
            Number('123');      // 123
            Number('123a');     // NaN
            Number('');         // 0

            Number(true);       // 1
            Number(false);      // 0

            Number();           // 0

            Number(undefined);  // NaN

            Number(null);       // 0

            Number(Symbol());   // 抛出TypeError错误
            ```

            >`parseInt`与`Number`均忽略字符串前后的不可见字符。`parseInt`从前向后逐个解析字符，只要开头有数字则返回数值；`Number`判断只要有一个字符无法转成数值，则返回`NaN`。
        2. 引用数据类型：

            若参数是**单个数值的数组**、**空数组**、**单个数值为undefined的数组**，则返回`数值`、`0`、`0`；否则返回`NaN`。

            e.g.

            ```javascript
            Number([5]);            // 5
            Number([]);             // 0
            Number([undefined]);    // 0

            Number([1, 2, 3]);      // NaN
            Number({});             // NaN
            ```

            - `Number(对象)`具体规则：

                1. 调用原对象自身的`valueOf`，若返回值是基本数据类型，则再使用`Number`，不再进行后续步骤；
                2. 调用原对象自身的`toString`，若返回值是基本数据类型，则再使用`Number`，不再进行后续步骤；
                3. 若以上返回都还是对象，报错。
    2. `String(参数)`

        1. 基本数据类型：

            1. 数值：转为相应的字符串。
            2. 字符串：原来的值。
            3. 布尔值：`true`转为`'true'`，`false`转为`'false'`。
            4. `undefined`：转为`'undefined'`。
            5. `null`：转为`'null'`。
        2. 引用数据类型：

            若是数组，则返回该数组的字符串形式；否则返回一个类型字符串。

            ```javascript
            // e.g.
            String([1, 2, 3]);  // '1,2,3'
            String({a: 1});     // '[object Object]''
            ```

            - `String(对象)`具体规则：

                1. 调用原对象自身的`toString`，若返回值是基本数据类型，则再使用`String`，不再进行后续步骤；
                2. 调用原对象自身的`valueOf`，若返回值是基本数据类型，则再使用`String`，不再进行后续步骤；
                3. 若以上返回都还是对象，报错。
    3. `Boolean(参数)`

        | 数据类型 | 转换为`true`的值 | 转换为`false`的值 |
        | :--- | :--- | :--- |
        | Boolean | `true` | `false` |
        | String | 任何非空字符串 | `''` |
        | Number | 任何非零数值（包括无穷大） | `0`、`-0`、`+0`、`NaN` |
        | Symbol | 任何Symbol类型值 | 无 |
        | Object | 任何对象 | `null` |
        | undefined |  | `undefined` |
2. 自动转换

    1. 触发情况：

        1. **运算数的数据类型**与**运算符的预期**不符。
        2. 不同类型的数据互相运算。
        3. 对非布尔值类型的数据求布尔值。
        4. 对非数值类型的数据使用一元运算符（`+`、`-`）

            <details>
            <summary>e.g.</summary>

            ```javascript
            'a' + + 'a'         // 'a' + (+ 'a') -> 'a' + NaN -> 'aNaN'
            + '123';            // 123
            - [123];            // -123
            1 + undefined       // NaN
            '1' + undefined     // '1undefined'
            ```
            </details>
    2. 行为：

        预期什么类型的值，就调用该类型的转换函数。

        1. 自动转换为`Boolean`：

            1. `if`、`while`、`for`等条件语句。
            2. `条件运算 ? 表达式1 : 表达式2`。
            3. `!!条件运算`。
        2. 自动转换为`String`：

            主要发生在加法运算时：当一个值为字符串，另一个值为非字符串，则后者转为字符串。
        3. 自动转换为`Number`：

            除了~~加法运算符~~有可能把运算数转为字符串，其他运算符都会把运算数自动转成数值（包括一元运算符）。

        - `+`加法运算：

            1. 若运算数有对象，先`ToPrimitive(对象)`转换为的基本数据类型，再按照下面方式继续自动转换或运算出结果；
            2. 若运算数有字符串，则都转换为字符串（`String(基本数据类型)`）进行；
            3. 若运算数是数值与布尔值，则布尔值转换为数值（`true` -> 1、`false` -> 0）进行。
3. `==`与`!=`进行的强制类型转换步骤

    1. 运算数若存在`NaN`，则返回`false`；

        >除了`!=`和`!==`，只要对比（`==`、`===`、`>`、`>=`、`<`、`<=`）的操作数有一个是`NaN`，则返回`false`。
    2. 运算数若存在`布尔值`，将布尔转换为数字（`true` -> 1、`false` -> 0）；
    3. 运算数若存在`字符串`, 有三种情况：

        1. 对方是`对象`，则进行`ToPrimitive(对象, 'string')`后进行对比；
        2. 对方是`数字`，字符串转数字；
        3. 对方是`字符串`，直接比较；
        4. 其他返回`false`。
    4. 若运算数是`数字`与`对象`，则对象进行`ToPrimitive(对象, 'number')`，再比较；
    5. 若运算数都是`对象`，则比较它们的`引用值`（如果两个运算数指向同一对象，那么返回`true`，否则`false`）；
    6. `null`与`undefined`不会进行类型转换, 但相等。

>1. `ToPrimitive`：依次调用对象的`valueOf`、`toString`，将对象转化了基本数据类型。
>2. `{ toString: () => {console.log('toString');return {}}, valueOf: () => {console.log('valueOf');return {}} }`对象来判断先调用哪个属性。

### `||`和`&&`
1. `expr1 || expr2`：

    1. 赋值操作：如果expr1能转换成true（`Boolean(expr1)`）则返回expr1，否则返回expr2。
    2. 在Boolean环境（如：if的条件判断）中使用：两个操作结果中只要有一个为true，返回true；二者操作结果都为false时返回false。
2. `expr1 && expr2`：

    1. 赋值操作：如果expr1能转换成false（`Boolean(expr1)`）则返回expr1，否则返回expr2。
    2. 在Boolean环境（如：if的条件判断）中使用：两个操作结果都为true时返回true，否则返回false。

### 事件循环（event loop）
>参考：[阮一峰：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)、[Help, I’m stuck in an event-loop.](https://vimeo.com/96425312)、[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)。

>不是在ECMAScript没有定义，而是在[HTML Standard](https://html.spec.whatwg.org/#event-loops)中定义。

1. JS的主线程是单线程

    1. 原因：

        1. JS设计初衷是为了与用户互动、操作DOM等简单操作。
        2. 单线程提高效率，多线程会带来复杂的同步问题。
    2. 结果：

        1. 程序在执行时必须排队，且一个程序不能中断另一个程序的执行。
        2. 没有任何代码是立即执行的，但一旦进程空闲则尽快执行。
    3. 弥补单线程计算量太大、事件耗时太久影响浏览器体验：

        1. 新增**Web Worker**标准，但不能~~操作DOM~~，完全受主线程控制。

            >在浏览器tab没有被激活时（inactive），计时器间隔的最小值会提升、进程执行会变慢。用Web Worker不会受浏览器是否激活的影响。
        2. 多个异步线程分别处理：**网络请求**、**定时器**、**读写文件**、**I/O设备事件**、**页面渲染**等。

            >DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。
2. 任务类型

    1. 同步任务（synchronous）：

        在主线程上排队执行的任务。
    2. 异步任务（asynchronous）：

        1. 先挂起到（对应种类的）工作线程等待结果，主线程不会因此阻塞；有结果后，发起通知进入（对应种类的）“任务队列”（task queue或“消息队列”）；“执行栈”（execution context stack）为空后会读取并执行“任务队列”的通知对应的回调函数。

            >相同类型的异步工作线程是串行工作；不同类型的异步工作线程互不影响执行。
        2. 异步任务分为两种类型：macrotask（task）、microtask（job）

            1. macrotask一般包括:

                1. `I/O`

                    监听的事件。
                2. `requestAnimationFrame`
                3. `新的<script>`
                4. `setTimeout`、`setInterval`、`setImmediate`

                    在当前“任务队列”的尾部，添加事件。
                5. `AJAX`
            2. microtask一般包括:

                1. `process.nextTick`

                    在当前“执行栈”的尾部——读取"任务队列"之前，添加事件。
                2. `async-await`（只有`await`是异步）

                    >`await`后若是方法则同步执行该方法，执行结果交给`await`后才是microtask（无论结果如何）。
                3. `Promise`（`Promise.then/catch/all/race`）

                    >`new Promise(回调)`的回调和`Prmise.resolve()/reject()`都是直接执行的同步任务。
                4. `MutationObserver`
            >- macrotask和microtast选择
            >
            >    如果想让一个任务立即执行，就把它设置为microtask，除此之外都用macrotask。因为虽然JS是异步非阻塞，但在一个事件循环中，microtask的执行方式基本上是用同步的。

            - macrotask、microtask的事件循环运行机制：

                1. 检查macrotask队列

                    1. 选择最早加入的任务X，设置为“目前运行的任务”并进入“执行栈”；如果macrotask队列为空，跳到第4步；

                        >最初时刻：“执行栈”为空，`<script>`作为第一个macrotask被运行。
                    2. “执行栈”运行任务X（运行对应的回调函数）；
                    3. 设置“目前运行的任务”为`null`，从macrotask队列中移除任务X；
                    4. 跳出macrotask队列、进行浏览器渲染。
                2. 浏览器渲染；
                3. 检查microtask队列：

                    1. 选择最早加入的任务a，设置为“目前运行的任务”并进入“执行栈”；如果microtask队列为空，跳到第5步；
                    2. “执行栈”运行任务a（运行对应的回调函数）；
                    3. 设置“目前运行的任务”为`null`，从microtask队列中移除任务a；
                    4. 跳到第1步（检查下一个最早加入的microtask任务）；
                    5. 跳出microtask队列、进行检查macrotask队列。
3. JS的事件循环运行机制：

    1. “执行栈”进行：

        1. 所有同步任务都在主线程上执行，形成一个“执行栈”，串行执行直到“执行栈”为空（只有前一个任务执行完毕，才能执行后一个任务）。
        2. 主线程之外，还存在“任务队列”。“执行栈”遇到异步任务则把其挂起到异步线程，只要异步线程有了运行结果，就在“任务队列”之中放置通知。
    2. 一旦“执行栈”中的所有同步任务执行完毕，系统就会（按照macrotask、microtask的事件循环运行机制）读取“任务队列”，把**一个**通知对应的回调函数加入执行栈。跳回步骤1（“执行栈”又有内容可以执行）。

    ![事件循环图](./images/event-loop-1.png)
4. 由于异步函数是立刻返回，异步事务中发生的错误是无法通过`try-catch`来捕捉。
5. JS的异步编程方式：

    1. 回调函数
    2. 事件监听（观察者模式）
    3. Promise
    4. Generator
    5. async-await

### 定时器 && 重绘函数
1. 定时器（`setInterval`、`setTimeout`）

    >不适合制作动画。

    定时器触发后，会把**定时器处理程序（回调函数）**插入至等待执行的**任务队列**最后面。`setInterval`和`setTimeout`的内部运行机制完全一致。

    1. `setInterval`、`clearInterval`：

        1. 同一个被setInterval执行的函数只能插入一个**定时器处理程序**到**任务队列**。
        2. setInterval是间隔时间去尝试执行函数，不关注上一次是何时执行。
        3. 若setInterval触发时已有它的**定时器处理程序**在**任务队列**中，则忽略此次触发。直到没有它的**定时器处理程序**在**任务队列**后才可以再次插入（正在执行的不算在**任务队列**中）。
        4. 相邻的2次**定时器处理程序**可能小于或大于（或等于）设定的间隔时间。无法确定**定时器处理程序**何时执行。
    2. `setTimeout`、`clearTimeout`:

        [用setTimeout模拟setInterval](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生js用settimeout模拟setinterval)，可以提高性能（上一次执行完毕间隔时间后再执行下一次，而不是固定间隔时间都尝试执行），并且可以确保每次**定时器处理程序**执行间隔一定大于（或等于）设置的间隔时间。

    - `setImmediate`、`clearImmediate`：

        >仅ie10支持。

        等价于：`setTimeout(func, 0)`。
2. 重绘函数（`requestAnimationFrame`）

    >[递归调用](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#原生jsrequestanimationframe的递归)。

    1. 浏览器重绘之前，进行一次：发起通知进入“任务队列”，等待“执行栈”调用。

        大部分浏览器是1秒钟60帧，也就是16.67ms进行一帧重绘。
    2. 替代执行时机无法保证的`setTimeout`、`setInterval`进行动画操作，提升渲染性能：

        1. 把每一帧中的所有DOM操作集中起来，在一次重绘或重排中完成动画，且时间间隔紧随浏览器的刷新频率。
        2. 仅仅绘制用户可见的动画。这意味着没把CPU或电池寿命浪费在绘制处于背景标签，最小化窗口，或页面隐藏区域的动画上。
        3. 当浏览器准备好绘制时（空闲时），才绘制一帧，此时没有等待中的帧。意味着其绘制动画不可能出现多个排队的回调函数，或阻塞浏览器。因此动画更平滑，CPU和电池使用被进一步优化。

- 空闲函数（`requestIdleCallback`、`cancelIdleCallback`）

    在浏览器空闲时期依次调用函数。

    >1. 只有当前帧的运行时间小于16.66ms时，回调函数才会执行。否则，就推迟到下一帧，如果下一帧也没有空闲时间，就推迟到下下一帧，以此类推。
    >2. 第二个参数表示指定的毫秒数。若在指定的这段时间之内，每一帧都没有空闲时间，那么回调函数将会强制执行。

### 数组的空位（hole）
>来自：[阮一峰：数组的空位](http://javascript.ruanyifeng.com/grammar/array.html#toc6)、[阮一峰：数组的空位（ES6）](http://es6.ruanyifeng.com/#docs/array#数组的空位)。

1. 数组的空位：数组的某一个位置没有任何值

    1. 空位是可以读取的，返回`undefined`。
    2. 空位不是~~undefined~~，空位没有任何值。一个位置的值等于`undefined`，依然有值。
    3. 使用`delete`删除一个数组成员，会形成空位，并且不会影响`length`属性。
    4. 给一个数组的`length`属性赋予大于其长度的值，新创建的项都是空位。

    <details>
    <summary>e.g.</summary>

    ```javascript
    [, , ,][0];                             // undefined
    0 in [undefined, undefined, undefined]; // true
    0 in Array.apply(null, new Array(3));   // true（密集数组：没有空位的数组）
    0 in new Array(3);                      // false（稀疏数组：有空位的数组）
    0 in [, , ,];                           // false
    ```
    </details>

    >1. `new Array(数量)`（或`Array(数量)`）返回的是有空位的稀疏数组。
    >2. `Array.apply(null, new Array(数量));`返回的是没有空位的密集数组。
    >3. 若数组最后一个元素后面有逗号，并不会产生空位，而是忽略这个逗号：`[1, ].length === 1`。
3. ES5大多数情况下会忽略空位：

    1. `forEach`、`filter`、`every`、`some`、`find`、`findIndex`、`reduce`、`reduceRight`等遍历方法的回调函数会跳过空位；`map`的回调函数会跳过空位，但返回值保留空位。
    2. `join`、`toString`将`空位`、`undefined`、`null`处理成空字符串`''`。
4. ES6明确将空位转为`undefined`。
