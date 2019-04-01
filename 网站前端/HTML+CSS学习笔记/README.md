# HTML+CSS学习笔记

## 目录
1. [CSS](#css)

    1. [CSS选择器](#css选择器)
    1. [层叠上下文（stacking context）](#层叠上下文stacking-context)
    1. [几个类似的换行属性](#几个类似的换行属性)
    1. [清除浮动](#清除浮动)
    1. [`table-layout`](#table-layout)
    1. [块级元素的`width`](#块级元素的width)
    1. [使元素强制表现为`block`的CSS设置](#使元素强制表现为block的css设置)
    1. [`margin`合并](#margin合并)
    1. [BFC（Block Formatting Context）块级格式上下文](#bfcblock-formatting-context块级格式上下文)
    1. [CSS的小数、百分比](#css的小数百分比)
    1. [WAP端半像素](#wap端半像素)
    1. [`em`、`%`](#em)
    1. [`line-height`](#line-height)
    1. [`<img>`的`src`属性](#img的src属性)
    1. [`<img>`的圆角、边框](#img的圆角边框)
    1. [WAP端页面自适应图片](#wap端页面自适应图片)
    1. [横竖屏切换](#横竖屏切换)
    1. [滚动条](#滚动条)
    1. [滚动条样式](#滚动条样式)
    1. [`@font-face`加入了字体后的使用方式](#font-face加入了字体后的使用方式)
    1. [帧动画（逐帧动画、序列帧、序列帧动画）](#帧动画逐帧动画序列帧序列帧动画)
1. [HTML + CSS](#html--css)

    1. [等宽文字](#等宽文字)
    1. [禁用`<a>`的鼠标、键盘事件](#禁用a的鼠标键盘事件)
    1. [插件避免被其他样式污染方式](#插件避免被其他样式污染方式)
    1. [网页图标favicon的兼容写法](#网页图标favicon的兼容写法)
    1. [富文本编辑器](#富文本编辑器)
1. [经验总结](#经验总结)

    1. [水平居中、垂直居中](#水平居中垂直居中)
    1. [自适应宽度布局](#自适应宽度布局)
    1. [`flex`优雅解决布局、自适应问题](#flex优雅解决布局自适应问题)
    1. [渲染性能（rendering performance）](#渲染性能rendering-performance)
    1. [经验技巧](#经验技巧)
    1. [Tips](#tips)

---
## CSS

### CSS选择器
1. 权重

    1. 优先级（从低到高）：

        >低等级的权重值叠加再多，也无法大于高等级的权重值（一个[反例](http://www.zhangxinxu.com/wordpress/2012/08/256-class-selector-beat-id-selector/)）。

        1. **1级**：

            元素选择器（type selectors）、伪元素选择器（pseudo-elements）。
        2. **2级**：

            类选择器（class selectors）、伪类选择器（pseudo-classes）、属性选择器（attribute selectors）。
        3. **3级**：

            ID选择器（ID selectors）。
        4. **4级**

            内嵌样式（标签的`style`属性值）。
        5. **5级**

            `!important`。

        - 不改变权重：

            `*`、关系符号（`,`、` `、`>`、`+`、`~`）、`:not()`。
    2. 原则：

        1. 元素应用属性值规则：

            1. 应用**权重大的**。
            2. 权重相等，应用**文档顺序最后的**（外联与内联之间也按文档顺序排列）。

            - 不影响应用：

                1. ~~元素在文档的位置、选择器间的距离。~~

                    ><details>
                    ><summary>e.g.</summary>
                    >
                    >```html
                    ><style>
                    >    /* 权重相同，仅取决于样式的文档顺序 */
                    >    .a p {color: red;}
                    >    .b p {color: blue;}
                    >
                    >    /* `body h1`与`html h1`权重相同，仅取决于样式的文档顺序 */
                    ></style>
                    >
                    ><div class="a">
                    >    <div class="b">
                    >        <p>.a -> .b -> p(blue)</p>
                    >    </div>
                    ></div>
                    ><div class="b">
                    >    <div class="a">
                    >        <p>.b -> .a -> p(blue)</p>
                    >    </div>
                    ></div>
                    >```
                    ></details>
                2. ~~样式相对于元素的位置。~~

                    >无视样式距离元素的相对位置（外联与内联），仅取决于样式与样式之间的文档顺序。
        2. 优先级基于形式，而不是结果。

            >e.g. `[id=foo]`依然是属性选择器优先级（2级），而不是~~ID选择器优先级（3级）~~。
        3. 继承祖先元素的样式，优先级永远低于目标元素。

            ><details>
            ><summary>e.g.</summary>
            >
            >```html
            ><style>
            >  #parent {
            >    color: red !important;
            >  }
            >  .son {
            >    color: blue
            >  }
            ></style>
            >
            ><div id="parent">
            >  parent(red)
            >  <div class="son">
            >    son(blue)
            >  </div>
            ></div>
            >```
            ></details>
2. 性能

    >CSS选择器对性能的影响源于**浏览器匹配选择器和文档元素时所消耗的时间**。

    1. 样式系统**从右向左**进行规则匹配

        1. 只要当前选择符的左边还有其他选择符，样式系统就会继续向左移动，直到找到和规则匹配的元素或因为不匹配而退出。
        2. 选择器最右边的选择符是决定效率的**关键选择器**，越具体的关键选择器，其性能越高。

        >从右向左解析的[原因](https://stackoverflow.com/questions/5797014/why-do-browsers-match-css-selectors-from-right-to-left)：更快地判断出某选择器不匹配某DOM，从而更高效匹配完所有内容。
    2. 效率（从高到低）

        1. ID选择器
        2. 类选择器
        3. 元素选择器
        4. 相邻兄弟选择器（`+`）
        5. 子元素选择器（`>`）
        6. 后代元素选择器（` `）
        7. 通配符选择器（`*`）
        8. 属性选择器
        9. 伪类选择器、伪元素选择器
    3. 避免使用 ~~@import~~，只用`<link>`；避免使用~~CSS表达式（CSS expression）~~。
    4. 移除空CSS规则、合理使用`display`、不滥用`float`、不滥用Web字体。
3. [类型](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/标准库文档.md#选择器类型)

### 层叠上下文（stacking context）
>参考：[张鑫旭：深入理解CSS中的层叠上下文和层叠顺序](http://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)。

1. 满足以下任意条件则形成层叠上下文：

    1. 根元素`<html>`。
    2. `z-index`属性值不为~~auto~~的`position: relative/absolute;`定位元素。
    3. `position: fixed;`（仅限Chrome，其他浏览器遵循需要`z-index`为数值）。
    4. `z-index`属性值不为~~auto~~的`flex`子项（父元素`display: flex/inline-flex;`）。
    5. `opacity`属性值`< 1`的元素。
    6. `transform`属性值不为~~none~~的元素。
    7. `mix-blend-mode`属性值不为~~normal~~的元素。
    8. `filter`属性值不为~~none~~的元素。
    9. `perspective`属性值不为~~none~~的元素。
    10. `isolation`属性值为`isolate`的元素。
    11. `will-change`属性值指定任意CSS属性（即便没有直接指定这些属性的值）。
    12. `-webkit-overflow-scrolling`属性值为`touch`的元素。
2. 层叠顺序（stacking order）

    >`z-index: auto;`不形成层叠上下文。

    1. 比较2个元素的层叠顺序，由各自上溯至（可以是元素自身）拥有共同**层叠上下文父级**的元素的层叠顺序决定。
    2. 层叠上下文独立于兄弟元素，当处理层叠时只考虑后代元素（`z-index`值只在祖先元素的层叠上下文中有意义）。
3. `z-index`使用注意

    1. 应该只给堆叠在一起的节点设置此属性。
    2. 尽量在页面中不要使`z-index`的数值`> 4`，否则就要考虑是否过度使用此属性。

### 几个类似的换行属性
1. 单词内断字

    >默认效果：若此行放不下则整个单词换行，若下行也放不下则溢出（保持单词不断字）。

    1. `word-break`

        1. `normal`（默认）

            默认效果。
        2. `break-all`

            若此行放不下则直接断字。
    2. `word-wrap`或`overflow-wrap`

        1. `normal`（默认）

            默认效果。
        2. `break-word`

            若此行放不下则整个单词先换行，若下行也放不下才断字。

    >1. 对于用户输入或不确定长度的内容，建议都加上`word-wrap: break-word;`，避免内容宽度溢出。
    >2. 或直接在`<body>`上设置，让所有内容继承（ie10-使用`word-wrap: break-word;`会导致无法出现`text-overflow`的溢出效果，因此ie10-不要在body上全局添加）。
2. `white-space`

    处理空白和内容换行。

    | 值 | 空格和制表符 | 换行符和`<br>` | 到达宽度极限 |
    | :--- | :--- | :--- | :--- |
    | `normal`（默认） | 连续的合并为一个 | 当做空格 | 换行 |
    | `nowrap` | 连续的合并为一个 | 当做空格 | 不换行 |
    | `pre` | 保留 | 换行 | 不换行 |
    | `pre-wrap` | 保留 | 换行 | 换行 |
    | `pre-line` | 连续的合并为一个 | 换行 | 换行 |
3. `text-overflow`

    溢出的样式。

    1. `clip`（默认）

        截断文本。
    2. `ellipsis`

        省略号。

    >需要和`overflow: hidden;`、`white-space: nowrap;`配合产生溢出。
4. `word-spacing`

    空白字符包裹的非空白字符的间距。
5. `letter-spacing`

    字符的间距。

### 清除浮动
1. 在父级添加

    ```scss
    @mixin clearfix {
        *zoom: 1;

        &:after {
            content: "";
            display: table;
            clear: both;
        }
    }
    ```
2. 触发父级BFC

    1. 截断不影响时

        ```css
        .father {
            overflow: hidden;
            _width: 100%;
        }
        ```
    2. 父级设置`float: left/right;`
    3. 父级设置`position: absolute/fixed;`

### `table-layout`
1. `auto`（默认）

    在`<td>`或`<th>`上设置宽度无效，各项宽度取决于内容宽度。
2. `fixed`

    >整个表格在首行被下载后就被解析和渲染。更快完成渲染，性能更优。

    1. 可以设置`<td>`或`<th>`宽度，没有设置宽度的所有项平分父级余下的宽度。
    2. 第一行宽度决定所有行宽度。

>`<table>`（`display: table;`）各`<td>`或`<td>`项（`display: table-cell;`）默认内容垂直居中，用`vertical-align`调节垂直对齐。

### 块级元素的`width`
1. `auto`（默认）：

    换算具体值为：**本元素width = 父级width - 本元素（margin + padding + border）水平值**。

    >当块级width为默认的auto时，设置负的水平margin会使width增加。
2. `100%`：

    父级的px为自己的px。

### 使元素强制表现为`block`的CSS设置
1. `float: left/right;`
2. `position: absolute/fixed;`

>意味着有以上CSS属性的行内标签可以当做块级标签使用。

### `margin`合并
1. W3C定义：在CSS中，两个或多个毗邻（父子元素或兄弟元素）的普通流中的块元素垂直方向上的margin会发生叠加。这种方式形成的外边距即可称为外边距叠加（collapsed margin）。

    1. 毗邻：是指没有被**非空内容**、**padding**、**border**或**clear**分隔开。
    2. 普通流：除了`float: left/right`、`positon: absolute/fixed`之外的内容。
2. 产生独立的BFC结构可避免margin合并

>ie6、7触发[haslayout](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/兼容至ie6/README.md#haslayout)会影响margin合并的发生。

### BFC（Block Formatting Context）块级格式上下文

- <details>

    <summary>W3C定义</summary>

    1. 浮动元素、绝对定位元素、非块级盒子的块级容器（如：`inline-blocks`、`table-cells`、`table-captions`）、`overflow`值不为“visiable”的块级盒子，都会为它们的内容创建新的块级格式化上下文。
    2. 在一个块级格式化上下文里，盒子从包含块的顶端开始垂直地一个接一个地排列，两个盒子之间的垂直的间隙是由它们的margin 值所决定的。两个相邻的块级盒子的垂直外边距会发生叠加。
    3. 在块级格式化上下文中，每一个盒子的左外边缘（margin-left）会触碰到容器的左边缘（border-left）（对于从右到左的格式来说，则触碰到右边缘），即使存在浮动也是如此，除非这个盒子创建一个新的块级格式化上下文。
    </details>

1. BFC是一个独立的布局环境，可以理解为一个箱子，箱子里物品的摆放不受外界影响，且每个BFC都遵守同一套布局规则。
2. 对容器添加以下CSS属性使其成为独立的BFC

    1. `float: left / right;`
    2. `overflow: hidden / auto / scroll;`
    3. `display: inline-block / table-cell / table-caption / flex / inline-flex;`
    4. `position: absolute / fixed;`

>ie6、7不支持BFC，但是有[haslayout](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/兼容至ie6/README.md#haslayout)。

### CSS的小数、百分比
1. 浏览器会把小数以及百分比换算成整数的单位（px）

    1. 四舍五入：ie8、ie9、Chrome、Firefox。
    2. 直接向下取整：ie7、safari。
2. 多个子节点浮动的总宽度接近100%会表现成100%

    <details>
    <summary>设置百分比宽度时，用百分比小数点后<strong>六位</strong>的四舍五入值可以兼容大多数浏览器</summary>

    ```css
    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12 {
        float: left;
    }
    .col-1 {width: 8.333333%;}
    .col-2 {width: 16.666667%;}
    .col-3 {width: 25%;}
    .col-4 {width: 33.333333%;}
    .col-5 {width: 41.666667%;}
    .col-6 {width: 50%;}
    .col-7 {width: 58.333333%;}
    .col-8 {width: 66.666667%;}
    .col-9 {width: 75%;}
    .col-10 {width: 83.333333%;}
    .col-11 {width: 91.666667%;}
    .col-12 {width: 100%;}
    ```
    </details>
3. 使用`rem`，因为换算成`px`而四舍五入或向下取整可能导致切图问题的解决方案：

    1. 切图四周多给2px透明距离（切图宽度/最小宽度*1px，多少倍就多少px）。
    2. 内容填色的图片用`width: 100%;`。
    3. 内容的间隙多设置一些`padding`，再用`负margin`中和。

### WAP端半像素
不要使用`border: 0.5px`，因为浏览器会把数值换算成`0`或`1`。

1. `scale`缩小一半

    1. 整个边框0.5px

        ```scss
        div {
            width: 宽度;
            position: relative;

            &:before {
                position: absolute;
                top: 0;
                left: 0;
                content: "";
                width: 200%;
                height: 200%;
                border: 1px solid 颜色;
                transform: scale(.5);
                transform-origin: 0 0;
                box-sizing: border-box;
            }
        }
        ```
    2. 某一边0.5px

        ```scss
        div {
            width: 100px;
            position: relative;

            &:before {
                position: absolute;
                top: 0;
                left: 0;
                content: "";
                width: 100%;
                height: 1px;
                border-top: 1px solid 颜色;
                transform: scaleY(.5);
                transform-origin: 0 0;
                box-sizing: border-box;
            }
        }
        ```

    [JSFiddle demo](https://jsfiddle.net/realgeoffrey/3wbf62xj/)
2. `<meta>的viewport`缩放为`1/DPR`，切图用DPR倍大小（CSS媒体查询方案或JS方案）。

    >仅适用于iOS。Android机型太复杂，bug永无止境。
3. `border-image/background-image`2像素图片，一半透明、一半目标颜色。
4. `box-shadow`。
5. PostCSS的[postcss-write-svg](https://github.com/jonathantneal/postcss-write-svg)。

### `em`、`%`
1. `em`单位：

    相对于节点自己的font-size的倍数（先计算出自己的font-size最终值）。

    ><details>
    ><summary>若font-size的单位为<code>em</code>，用从父级继承的font-size值乘以倍数</summary>
    >
    >e.g.
    >```css
    >.father {
    >    font-size: 10px;
    >}
    >.son {
    >    font-size: 2em; /* 20px：继承的font-size * 2 */
    >    padding: 2em;   /* 40px：自己的font-size * 2 */
    >}
    >```
    ></details>
2. `%`单位：

    ><details>
    ><summary>包含块（containing block）</summary>
    >
    >不能简单地理解成是父元素。若是`position: static/relative;`元素，包含块是其父元素；若是`position: absolute;`元素，包含块是离它最近的`position: relative/absolute/fixed;`的祖先元素；若是`position: fixed;`元素，包含块是视口（viewport）。
    ></details>

    1. 乘以包含块的`width`：

        `margin`、`padding`、`left`、`right`、`width`、`max-width`、`min-width`、`text-indent`
    2. 乘以包含块的`height`：

        `top`、`bottom`、`height`、`max-height`、`min-height`
    3. 乘以元素的`font-size`：

        `line-height`
    4. 乘以继承的`font-size`：

        `font-size`
    5. 乘以元素的`line-height`：

        `vertical-align`
    6. 乘以自身的`width/height`：

        `border-radius`、`background-size`、`translate`、`transform-origin`、`zoom`、`clip-path`
    7. `background-position`：

        百分比值会同时应用于元素和图像。

        ><details>
        ><summary>e.g.</summary>
        >
        >1. `50% 50%`会把图片的（50%, 50%）这一点与框的（50%, 50%）处对齐，相当于设置了`center center`。
        >2. `0% 0%`相当于`left top`。
        >3. `100% 100%`相当于`right bottom`。
        ></details>
    8. 自身是`position: absolute;`：

        离它最近的`positon: relative/absolute/fixed;`的祖先元素；若没有，则相对于视口。
    9. 自身是`position: fixed;`：

        相对于视口。

    >如果某个元素设置了百分比的属性，则后代元素继承的是计算后的具体px值。

### `line-height`
- 值的不同情况：无单位数字、带单位值、百分比、`normal`

    其中的`em`、`%`、`无单位数字`，都是相对于元素自身最终的font-size值的倍数。

    1. `em`和`%`是计算出具体px再向后继承（子节点的line-height=父级给的px）。
    2. `无单位数字`是直接继承系数，子节点会分别计算（子节点的line-height=数字，再继续和自身font-size相乘）。

1. 单行文本情况下：

    1. 行内元素的高度由`line-height`决定。
    2. 块级元素的高度先由`height`决定，若没有设置`height`再由`line-height`决定（ie6是`line-height`优先决定）。
2. 元素高度表现为：

    **内容区域（content area） + 行间距（vertical spacing） = 行高（line-height）**

    >1. 内容区域（鼠标选中后的高度）：只与`font-size`、`font-family`有关。
    >2. 行间距：摇摆不定，可以为负值，仅为达成以上等式而变化。

>ie6以及部分浏览器不能用line-height控制图片与文字的对齐位置，使用其他垂直居中方式。

### `<img>`的`src`属性
>当`<img>`的地址为空或错误时，会出现浏览器默认灰色边框，无法去除。

1. 不要用**空的`<img>`加上背景来用作默认图**，必须用其他标签来代替。
2. 要谨慎给`<img>`设置背景（如：内容图片或头像的初始图，不要使用背景，应该使用[JS延时加载](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#jquery图片延时加载lazyload)前的默认图），因为当图片是透明图的时候，会出现背景。
3. `<img>`没有`src`属性或`src`属性为空隐藏

    ```css
    img[src=""] {   /* ie8+ */
        visibility: hidden; /* 属性为空隐藏 */
    }
    img:not([src]) {    /* ie9+ */
        visibility: hidden; /* 属性不存在隐藏 */
    }
    ```
4. 设置`<img>`中[可替换元素](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Replaced_element)的位置、拉升：`object-position`、`object-fit`。

    >类似于针对背景图的位置、拉升：`background-position`、`background-size`（`background-repeat: no-repeat`）。

### `<img>`的圆角、边框
1. 圆角+边框

    1. PC端

        直接在`<img>`上设置`border-radius`、`border`。
    2. WAP端

        在`<img>`上设置`border-radius`，并嵌套一层父级标签设置`border-radius`、`border`。
2. 圆角

    - PC端、WAP端

        直接在`<img>`上设置`border-radius`。

### WAP端页面自适应图片
>要求：图片根据浏览器窗口变化而宽高同时等比例变化，不使用`<img>`（只有内容图片才使用`<img>`）。

1. 宽高都用rem且雪碧图且`background-position`用百分比（最佳方式）：

    ```css
    自适应图片 {
        width: 宽rem;
        height: 高rem;
        background-size: 雪碧图宽rem;
        background: url(雪碧图) 计算出x轴的百分比 计算出y轴的百分比 no-repeat;
    }
    ```

    ><details>
    ><summary>技术细节</summary>
    >
    >1. 百分比公式：
    >
    >    1. `background-position-x = 小图横坐标px / ( 大图宽度px - 小图宽度px ) * 100%`
    >    2. `background-position-y = 小图纵坐标px / ( 大图高度px - 小图高度px ) * 100%`
    >2. 可以用预处理语言计算：
    >
    >    ```scss
    >    @function rem($px, $base-font-size: 20px) {
    >        @if unitless($px) {
    >            @return rem($px + 0px);
    >        }
    >        @if unit($px) != "px" {
    >            @error "rem()的参数单位必须是px或不带单位";
    >        }
    >
    >        // $base-font-size：切图时设计稿宽度对应的媒体查询中html的font-size
    >        @return $px / $base-font-size + rem;
    >    }
    >    @function position-one($positon, $singleSize, $spritesSize) {
    >        @if $positon == 0 {
    >            @return 0;
    >        } @else {
    >            @return percentage($positon / ($spritesSize - $singleSize));
    >        }
    >    }
    >    /* x轴排列雪碧图*/
    >    @mixin sprites-x($x: 0, $width: 单图固定宽度或0, $fullWidth: 合并图宽度) {
    >        background-image: url(图片);
    >        background-position: position-one($x, $width, $fullWidth) 0;
    >        background-size: rem($fullWidth) auto;
    >        background-repeat: no-repeat;
    >    }
    >    /*/x轴排列雪碧图*/
    >    /* y轴排列雪碧图*/
    >    @mixin sprites-y($y: 0, $height: 单图固定高度或0, $fullHeight: 合并图高度) {
    >        background-image: url(图片);
    >        background-position: 0 position-one($y, $height, $fullHeight);
    >        background-size: auto rem($fullHeight);
    >        background-repeat: no-repeat;
    >    }
    >    /*/y轴排列雪碧图*/
    >    /* x+y轴排列且等大雪碧图（参数：单图宽、高、x轴图片数量、y轴图片数量、图片间距）*/
    >    @mixin sprites-xy($width, $height, $x, $y, $gap: 2) {
    >        width: rem($width);
    >        height: rem($height);
    >        background-image: url(图片前缀#{$width}x#{$height}.png);
    >        background-size: rem(($width + $gap)*$x - $gap) rem(($height + $gap)*$y - $gap);
    >        background-repeat: no-repeat;
    >
    >        // $i：横轴；$j：纵轴
    >        @for $j from 1 through $y {
    >            @for $i from 1 through $x {
    >                &.i-#{$j}-#{$i} {
    >                    background-position: position-one(($width + $gap)*($i - 1), $width, ($width + $gap)*$x - $gap) position-one(($height + $gap)*($j - 1), $height, ($height + $gap)*$y - $gap);
    >                }
    >            }
    >        }
    >    }
    >    /*/x+y轴排列且等大雪碧图*/
    >    ```
    ></details>
2. 其他方式：

    1. 横向、纵向百分比的`padding`值都是以父元素的`width`为基础，`height`是以父元素的`height`为基础

        ```css
        自适应图片 {
            height: 0;
            width: 宽%;
            padding-bottom: 高%;
            background-size: 100%;
            background: url(单图) 0 0 no-repeat;
        }
        ```

        >缺点：只能用于空标签。
    2. 宽高都用rem

        1. 单图

            ```css
            自适应图片 {
                width: 宽rem;
                height: 高rem;
                background-size: 100%;
                background: url(单图) center center no-repeat;
            }
            ```
        2. 雪碧图

            ```css
            自适应图片 {
                width: 宽rem;
                height: 高rem;
                background-size: 雪碧图宽rem;
                background: url(雪碧图) 0 -纵轴rem no-repeat;
            }
            ```

            >`background-position`用`rem`会出现换算小数导致定位偏离问题，改用以下百分比可以解决偏离问题。
    3. 百分比宽高且雪碧图且`background-position`用百分比

        ```css
        自适应图片 {
            height: 0;
            width: 宽%;
            padding-bottom: 高%;
            background-size: 雪碧图宽/单图宽度*100%;
            background: url(雪碧图) 计算出x轴的百分比 计算出y轴的百分比 no-repeat;
        }
        ```

### 横竖屏切换
>1. 翻转效果的节点，如果要增加内嵌滚动条，不能在此节点上增加`border-radius`，否者滚动条横竖轴颠倒。
>2. 部分Android系统（或低端机）对内嵌的滚动条（`overflow: hidden/auto;`）支持不佳，尤其增加了翻转效果后，设置的滚动条（甚至`overflow: hidden;`）会导致更多样式问题。除了去除内嵌滚动条的`border-radius`，还可以尝试给兄弟节点设置`z-index`。部分硬件较差的WebView对CSS3支持非常有限，无法做到**翻转+内嵌滚动条**（内嵌滚动条横竖轴颠倒）。
>
>- 其他解决方案：使用按钮（控制翻页或JS滚动）代替内嵌滚动条；使用`touchmove`实现滑动页面。

1. 媒体查询控制横竖屏添加翻转类

    ```css
    @media (orientation: portrait) {
        .dom {
            transform: rotate(90deg);
        }
    }
    @media (orientation: landscape) {
        .dom {

        }
    }
    ```
2. 翻转使用的媒体查询：

    >要求：页面没有滚动条，内容都在一屏视口内；设计稿只有一份，但要适应各种分辨率机型。

    1. 因为浏览器都有头尾栏，所以要额外扩展横竖屏的媒体查询范围（大、小两方面都要扩展）。
    2. 竖屏（`orientation: portrait`）根据`width`，横屏（`orientation: landscape`）根据`height`。
3. 用JS方法控制：[模拟手机翻转](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS方法积累/实用方法/README.md#jquery模拟手机翻转使页面都以横屏展示)。

### 滚动条
1. 若`overflow-x`和`overflow-y`相同，则等同于`overflow`；若不同，且其中一个值为`visible`，另一个为`hidden/scroll/auto`，则`visible`重置为`auto`。
2. 默认滚动条均来自`<html>`（而不是`<body>`）

    因此，除去默认滚动条应在`<html>`上设置`overflow`值。
3. JS获取文档滚动高度为：

    1. `document.body.scrollTop || document.documentElement.scrollTop`
    2. jQuery：`$(window).scrollTop()`或`$(document).scrollTop()`；Zepto：`$(window).scrollTop()`
4. 滚动条会占用容器的可用高度或宽度。

### 滚动条样式
>参考：[CSS自定义浏览器滚动条样式](http://alfred-sun.github.io/blog/2014/12/24/scrollbar-customized-with-css-style/)。

1. `WebKit`：

    1. `::-webkit-scrollbar`：滚动条整体部分，可以设置`宽度`。
    2. `::-webkit-scrollbar-track`：滚动条轨道，可以设置`背景`、`圆角`。
    3. `::-webkit-scrollbar-thumb`：滑块，可以设置`背景`、`圆角`、`阴影`。
    4. `::-webkit-scrollbar-track-piece`：滚动条轨道上覆盖的一层轨道，可以设置`背景`、`圆角`。
    5. `::-webkit-scrollbar-thumb:window-inactive`：浏览器未被选中时的滑块（也可以用于其他伪类）。
    6. `::-webkit-scrollbar-button`：滚动条两端按钮，可以设置`背景`、`圆角`、`阴影`。
    7. `::-webkit-scrollbar-corner`：横竖滚动条相交的边角，可以设置`背景`、`圆角`。
    8. `::-webkit-resizer`：定义右下角拖动缩放节点高宽的内容。

    - 一般只需要设置：

        ```scss
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-track {
            border-radius: 3px;
            background-color: #dac3a2;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            background-color: #ffe7c6;
            box-shadow: inset 0 0 0 1px #dac3a2;
        }
        ```
2. `ie`：

    1. `scrollbar-arrow-color: 颜色;`：三角箭头的颜色。
    2. `scrollbar-face-color: 颜色;`：立体滚动条的颜色（包括箭头部分的背景色）。
    3. `scrollbar-3dlight-color: 颜色;`：立体滚动条亮边的颜色。
    4. `scrollbar-highlight-color: 颜色;`：滚动条的高亮颜色（左阴影？）。
    5. `scrollbar-shadow-color: 颜色;`：立体滚动条阴影的颜色。
    6. `scrollbar-darkshadow-color: 颜色;`：立体滚动条外阴影的颜色。
    7. `scrollbar-track-color: 颜色;`：立体滚动条背景颜色。
    8. `scrollbar-base-color: 颜色;`：滚动条的基色。

>设置`<input>`或`<textarea>`的`placeholder`的样式：`选择器::placeholder {}`（厂商前缀：`::-webkit-input-placeholder`、`::-ms-input-placeholder`）。

### `@font-face`加入了字体后的使用方式
>使用[www.iconfont.cn](https://www.iconfont.cn/)方便生成字体图标，每个字体图标对应一个Unicode。

1. CSS：

    `content: "\16进制数";`
2. HTML：

    `&#x16进制数;`或`&#10进制数;`

    >HTML的字符实体（character entity）：`&名字;`或`&#序号;`（序号：`x16进制数`或`10进制数`）。
3. JS：

    `dom.innerHTML =`

    1. `'&#x16进制数;'`或`'&#10进制数;'`（都可省去`;`）；
    2. `'\u4位16进制数'`或`'\u{16进制数}'`或`'\x2位16进制数'`或`'\3位8进制数'`。

        >数字数量有限制：[Unicode](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/前端内容/基础知识.md#unicode)。

### 帧动画（逐帧动画、序列帧、序列帧动画）
`animation-timing-function`的`steps`（[缓动函数](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)）配合`@keyframes`改变雪碧图的`background-position/transform`。

<details>
<summary>e.g.</summary>

```html
<style>
.sprite {
  width: 300px;
  height: 300px;
  background-repeat: no-repeat;
  background-image: url(spr.png);
  animation: frame 333ms steps(20) both infinite;
}
@keyframes frame {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -6000px 0;
  }
}
</style>

<div class="sprite"></div>
```

```html
<style>
.sprite-wp {
  width: 300px;
  height: 300px;
  overflow: hidden;
}
.sprite {
  width: 6000px;
  height: 300px;
  will-change: transform;
  background: url(spr.png) no-repeat center;
  animation: frame 333ms steps(20) both infinite;
}
@keyframes frame {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-6000px);
  }
}
</style>

<div class="sprite-wp">
  <div class="sprite"></div>
</div>
```
</details>

---
## HTML + CSS

### 等宽文字
>不同字数的一行文字等宽。

1. 用`inline-block`的元素填补间隙

    ```html
    <style type="text/css">
        i {
            display: inline-block;
            *display: inline;
            *zoom: 1;
            width: 1em;
        }
    </style>

    <p>文字文字</p>
    <p>文<i></i><i></i>字</p>
    ```
2. 用`&ensp;`（字体宽度1/2em）、`&emsp;`（字体宽度1em）填补间隙。

    ```html
    <p>三个字</p>
    <p>两&emsp;个</p>

    <p>四个字的</p>
    <p>三&ensp;个&ensp;字</p>
    ```

[JSFiddle demo](https://jsfiddle.net/realgeoffrey/zdh8oxrt/)

### 禁用`<a>`的鼠标、键盘事件
1. `pointer-events: none;`穿透`<a>`的鼠标事件（包括点击和hover等，因为点击不到所以JS事件也不会触发）。
2. 不设置`href`属性，可以忽略键盘索引（tab键无法切换到）。

```html
<a style="pointer-events: none;">禁用鼠标和键盘的链接</a>
```

### 插件避免被其他样式污染方式
1. 与原页面不同的命名方式
2. shadow DOM
3. `<iframe>`

### 网页图标favicon的兼容写法
```html
<link rel="apple-touch-icon" sizes="180x180" href="favicon-180x180.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="mask-icon" href="favicon.svg" color="#fff">

<!--<link rel="manifest" href="/images/manifest.json">-->
<!--<meta name="msapplication-config" content="/images/browserconfig.xml">-->
```

### 富文本编辑器
>富文本编辑器（rich text editor）：一种可内嵌于浏览器，所见即所得（what you see is what you get，WYSIWYG）的文本编辑器。

1. 标签、样式注意

    1. 除了要检测用户输入标签的闭合性之外，还要注意富文本编辑器的祖先元素不要用`<li>`嵌套。

        因为代码中如果有单独的`<li>`（没有嵌套`<ol>`或`<ul>`），就会“越级”到跟祖先级`<li>`同级的内容。
    2. 大部分富文本会用`<em>`、`<ol>`、`<ul>`等标签来表示**斜体**、**有序序列**、**无序序列**，因此如果用CSS重置了以上标签的样式后，要在[富文本内重载开启它们的默认效果](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/初始化模板/cssReset.scss#L61-L77)（或定制效果）。
    3. 大部分富文本会在`<table>`上使用`cellspacing`、`border`、`bordercolor`属性设置表格，又因为设置了`border: 0;`的表格无法重载开启以上属性作用，所以CSS重置时[不要重置`table,tbody,tfoot,thead,tr,th,td`的`border`属性](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/初始化模板/cssReset.scss#L26-L27)。
2. 实现方式：

    1. 使用原生[`document.execCommand`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand)操作`contenteditable="true"`的DOM文本选取覆盖的内容（或`document.designMode === 'on'`的整个文档、`某iframe.contentDocument.designMode === 'on'`的整个`<iframe>`）。

        >如：[pell](https://github.com/jaredreich/pell)。

        大部分是添加`指定的几种标签`和`style`的方式进行编辑，因此只需定制富文本内指定的几种标签的样式。

        - `document.execCommand`原生支持添加的标签：

            1. `<b>`或`<strong>`
            2. `<i>`或`<em>`
            3. `<u>`
            4. `<strike>`或`<s>`
            5. `<pre>`、`<blockquote>`、`<h1>`~`<h6>`、`<p>`、等块级标签
            6. `<ul>`、`<ol>`、`<li>`
            7. `<img>`
            8. `<a>`
            9. `<hr>`
            10. `<sub>`、`<sup>`
            11. `<table>`
            12. `<font>`
            13. `<small>`、`<big>`

            >若要插入其他标签、或修改HTML属性（`style`、`class`等）、或插入整个DOM，则可以用`document.execCommand('insertHTML', false, HTML内容)`。
    2. 修改、插入DOM的方式模拟实现DOM的编辑。

        >如：[quill](https://github.com/quilljs/quill)。

        除了添加标签和`style`之外，还会额外添加`class`和DOM（需自定义样式）。

---
## 经验总结

### 水平居中、垂直居中
1. 水平居中

    1. 内容宽度确定

        ```css
        .son {
            width: 宽度;
            margin: 0 auto;
        }
        ```
    2. 内容宽度不确定

        1. 子级`display: table; margin: 0 auto;`。

            >兼容ie8+。

            ```css
            .son {
                display: table;
                margin: 0 auto;
            }
            ```
        2. 父级`position: relative;`，子级`position: absolute; left: 50%; transform: translateX(-50%);`。

            >兼容ie9+。

            ```scss
            .father {
                position: relative;

                .son {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    -ms-transform: translateX(-50%);
                }
            }
            ```
        3. 父级`display: flex; justify-content: center;`；或父级`display: flex;`，子级`margin: 0 auto;`。

            >兼容ie11+。

            ```scss
            .father {
                display: flex;
                justify-content: center;
            }
            /* 或 */
            .father {
                display: flex;

                .son {
                    margin: 0 auto;
                }
            }
            ```
        4. 父级`text-align: center;`，子级`display: inline-block;`。

            ```scss
            .father {
                text-align: center;
                font-size: 0;

                .son {
                    display: inline-block;
                    *display: inline;
                    *zoom: 1;

                    font-size: ;
                }
            }
            ```
2. 垂直居中

    1. 内容高度确定

        父级`position: relative;`，子级`position: absolute; top: 50%; margin-top: 负一半高度;`。
    2. 内容高度不确定

        1. 父级`display: table-cell; vertical-align: middle;`，子级`display: inline-block;`。

            ```scss
            .father { /* （为兼容低版本ie）不能是float或absolute，可以在外嵌套float或absolute */
                display: table-cell;
                vertical-align: middle;

                /* ie6/7需要：height/font-size = 1.14 */
                *height: 114px;
                *font-size: 100px;

                .son {  /* （为兼容低版本ie）必须是行内元素 */
                    display: inline-block;
                    *display: inline;
                    *zoom: 1;
                    /*vertical-align: middle;*/
                }
            }
            ```

            [JSFiddle demo](https://jsfiddle.net/realgeoffrey/c1pz8mow/)
        2. 父级`position: relative;`，子级`position: absolute; top: 50%; transform: translateY(-50%);`。

            >兼容ie9+。

            ```scss
            .father {
                position: relative;

                .son {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    -ms-transform: translateY(-50%);
                }
            }
            ```
        3. 父级`display: flex; align-items: center;`。

            >兼容ie11+。

            ```scss
            .father {
                display: flex;
                align-items: center;
            }
            ```
        4. 辅助参考元素`display: inline-block; vertical-align: middle; height: 100%;`，子级`display: inline-block; vertical-align: middle;`。

            1. 伪元素：

                >兼容ie8+。

                ```scss
                .father {
                    font-size: 0;

                    &:before {
                        content: "";
                        display: inline-block;
                        vertical-align: middle;
                        height: 100%;
                    }
                    .son {
                        display: inline-block;
                        vertical-align: middle;

                        font-size: ;
                    }
                }
                ```
            2. 额外元素：

                ```html
                <style>
                    .father {
                        font-size: 0;
                    }
                    span {
                        display: inline-block;
                        *display: inline;
                        *zoom: 1;
                        vertical-align: middle;
                        height: 100%;
                    }
                    .son {
                        display: inline-block;
                        *display: inline;
                        *zoom: 1;
                        vertical-align: middle;

                        font-size: ;
                    }
                </style>

                <div class="father">
                    <span></span>
                    <div class="son"></div>
                </div>
                ```
3. 水平、垂直居中

    1. 内容高度、宽度确定

        父级`position: relative;`，子级`position: absolute; top: 50%; left: 50%; margin-top: 负一半高度; margin-left: 负一半宽度;`。
    2. 内容高度、宽度不确定

        1. 父级`display: table-cell; text-align: center; vertical-align: middle;`，子级`display: inline-block;`。

            ```scss
            .father {
                display: table-cell;
                text-align: center;
                vertical-align: middle;

                /* ie6/7需要：height/font-size = 1.14 */
                *height: 114px;
                *font-size: 100px;

                .son {
                    display: inline-block;
                    *display: inline;
                    *zoom: 1;
                    /*vertical-align: middle;*/
                }
            }
            ```
        2. 父级`position: relative;`，子级`position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`。

            >兼容ie9+。

            ```scss
            .father {
                position: relative;

                .son {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    -ms-transform: translate(-50%, -50%);
                }
            }
            ```
        3. 父级`display: flex; justify-content: center; align-items: center;`。

            >兼容ie11+。

            ```css
            .father {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            ```

### 自适应宽度布局
>`float`节点：可以填补在**之后节点**的水平`margin`内（`padding`内不可以）；不可以填补在**之前节点**的水平`margin`内。

1. 中间内容自适应，两边固定（中间内容最后加载）

    ```html
    <style type="text/css">
        .float-l {
            float: left;
            _display: inline;
            width: 左边块宽度;
        }
        .float-r {
            float: right;
            _display: inline;
            width: 右边块宽度;
        }
        .middle {
            margin-left: 大于等于左边块宽度;
            margin-right: 大于等于右边块宽度;
        }
    </style>

    <div class="clearfix">
        <div class="float-l">左边内容</div>
        <div class="float-r">右边内容</div>
        <div class="middle">中间内容</div>
    </div>
    ```

    >1. DOM结构不能颠倒，需要中间结构放最后;
    >2. 节点上能设定`clear: both;`。
2. 中间内容自适应，两边固定（中间内容最先加载）

    >所谓的“双飞翼布局”。

    ```html
    <style type="text/css">
        .main-out,
        .float-l,
        .float-r {
            float: left;
            _display: inline;
        }
        .middle-out {
            width: 100%;
        }
        .middle-in {
            margin: 0 大于等于右边块宽度 0 大于等于左边块宽度;
        }
        .float-l {
            width: 左边块宽度;
            margin-left: -100%;
        }
        .float-r {
            width: 右边块宽度;
            margin-left: -左边块宽度;
        }
    </style>

    <div class="clearfix">
        <div class="middle-out">
            <div class="middle-in">
                中间内容
            </div>
        </div>
        <div class="float-l">左边内容</div>
        <div class="float-r">右边内容</div>
    </div>
    ```

    >1. DOM结构不能颠倒，需要中间结构放最前;
    >2. 节点上能设定`clear: both;`。
3. 中间与两边内容都自适应

    ```html
    <style type="text/css">
        .float-l {
            float: left;
            _display: inline;
        }
        .float-r {
            float: right;
            _display: inline;
        }
        .middle {
            display: table-cell;
            *display: inline-block;
            width: 9999px;
            *width: auto;
        }
    </style>

    <div class="clearfix">
        <div class="float-l">左边内容</div>
        <div class="float-r">右边内容（没有足够空间则整体换行）</div>
        <div class="middle">中间内容（没有足够空间则整体换行）</div>
    </div>
    ```

    >1. DOM结构不能颠倒，需要中间结构放最后;
    >2. 节点上能设定`clear: both;`;
    >3. 完全由内容决定布局；
    >4. 第一块内容要给第二块内容留下足够空间，否则第二块放不下会整个换行；第一块+第二块要给第三块留下足够空间，否则第三块放不下会整个换行。

### [`flex`](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/弹性盒子.md#flex)优雅解决布局、自适应问题
1. 不使用flex导致不方便处理的问题：

    1. 栅格系统
    2. [自适应宽度布局](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/README.md#自适应宽度布局)
    3. [水平居中、垂直居中](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/README.md#水平居中垂直居中)
    4. [粘性页脚](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/实现具体业务.md#粘性页脚)
    5. [多列等高](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/实现具体业务.md#多列等高)
2. flex具体解决方案：[solved-by-flexbox](https://hufan-akari.github.io/solved-by-flexbox/)。

### 渲染性能（rendering performance）

><details>
><summary>每一帧耗时</summary>
>
>1. 为了视觉上连贯，浏览器对每一帧画面的所有工作需要在16ms（1000ms / 60f ~= 16.66ms/f）内完成。
>2. 渲染画面时，浏览器需要进行一些流程工作：渲染队列的管理、渲染线程与其他线程之间的切换等。因此一帧中花费在像素渲染管道（JS -> Style -> render tree）的时间要控制在10至12ms内，再余出4至6ms进行流程工作。
>3. 一帧画面理想的耗时组合为：`16ms = 3~4ms的JS代码 + 7~8ms的渲染工作 + 4~6ms的流程工作`。
></details>

1. 像素渲染管道：

    `CSS/JS` -> `Style（计算样式）` >> `Render Tree（渲染树）`：`Layout（布局）` -> `Paint（绘制）` -> `Composite（渲染层合并）`

    >Render Tree：改变前一个步骤需要后一个步骤也做出处理，所以若能够仅处理越后面的步骤，对性能耗费越少。

    1. `CSS/JS`：

        使用CSS（动画：`animation-@keyframes`、`transition`）或JS或Web Animation API，实现视觉变化效果。

        >1. JS动画（命令式）比CSS动画（说明式）消耗多一些资源，浏览器会对CSS动画自动进行优化。
        >
        >    1. CSS的`animation`相关事件：
        >
        >        `animationstart`、`animationend`、`animationcancel`、`animationiteration`
        >    1. CSS的`transition`相关事件：`transitionend`
        >2. 动画其实就是按某种顺序、**平滑**地修改样式：如：颜色、大小、间距、`transform`等。
    2. `Style`：

        根据CSS选择器，生成完整的CSSOM。
    3. `Layout`：

        具体计算每个节点最终在屏幕上显示的大小和位置。
    4. `Paint`：

        >耗费性能最大的工作。

        填充像素的过程。包括绘制文字、颜色、图像、边框、阴影等，也就是DOM所有的可视效果。一般来说，这个绘制过程是在多个层（composite layers）上完成。
    5. `Composite`：

        在每个层（composite layers）上完成绘制过程后，浏览器会将所有层按照合理的顺序合并成一个图层再显示。
2. `reflow`、`repaint`：

    >CSS属性触发reflow、repaint、composite的情况：[CSS Triggers](https://csstriggers.com/)。

    1. `reflow`（重排）：

        某个元素上执行动画时，浏览器需要每一帧都检测是否有元素受到影响，并调整它们的大小、位置，通常这种调整都是联动的。

        1. 当遇到reflow问题时，考虑调整JS代码书写。
        2. 触发一个元素layout改变，几乎总是导致整个DOM都要reflow。
    2. `repaint`（重绘）：

        浏览器还需要监听元素的外观变化，通常是背景色、阴影、边框等可视元素，并进行repaint。

        1. 当遇到repaint问题时，对于仅改变composite属性的元素，考虑单独提升到一个层（composite layers）中。
        2. 浏览器不会始终repaint整个层（composite layers），而是智能地对DOM中失效的部分进行repaint。
    3. `composite`：

        每次reflow、repaint后浏览器还需要层合并再输出到屏幕上。

    >那些容易忽略的**能引起布局改变的样式修改**，它们可能不产生动画，但当浏览器需要重新进行样式的计算和布局时，依然会产生reflow和repaint。
3. 创建composite layers（层、渲染层、复合层），交由GPU处理：

    >GPU（图形处理器）是与处理和绘制图形相关的硬件，专为执行复杂的数学和几何计算而设计的，可以让CPU从图形处理的任务中解放出来，从而执行其他更多的系统任务。

    1. 强制普通元素提升到单独层的方法：

        1. `will-change: ;`（现代浏览器，最佳方式）。
        2. `transform: translateZ(0);`（hack方式）。
    2. 自带单独层的元素：

        1. 使用加速视频解码的`<video>`元素。
        2. 拥有3D（WebGL）上下文或加速的2D上下文的`<canvas>`元素。
        3. `flash`等混合插件。
    3. 其他提升至单独层的方法：

        1. `transform 3D`或`perspective`。
        2. 如果有一个元素，它的兄弟元素在层中渲染，而这个兄弟元素的`z-index`比较小，那么这个元素（不管是不是应用了硬件加速样式）也会被放到层中。
        3. 对自己的`opacity`做CSS动画或使用一个动画变换的元素。
        4. 拥有加速CSS过滤器的元素。
        5. 元素有一个包含层的后代节点（换句话说，就是一个元素拥有一个后代元素，该后代元素在自己的层里）。

    >有时，虽然提升元素，却仍需要repaint。
4. 动画性能最好、消耗最低的属性（必须自身元素已提升至单独层）：

    对于以下属性修改，若元素自身被提升至单独层，则仅触发composite，否则触发paint -> composite。

    1. 位置：`transform: translate(xpx, ypx);`
    2. 缩放：`transform: scale(x, y);`
    3. 旋转：`transform: rotate(xdeg);`
    4. 倾斜：`transform: skew(xdeg,ydeg);`
    5. 透明：`opacity: x;`
5. 渲染性能优化方法：

    >参考：[渲染性能](https://developers.google.com/web/fundamentals/performance/rendering/)。

    1. 优化JS的执行效率

        1. 把DOM元素的操作划分成多个小任务，分别在多个帧中去完成。
        2. 不在连续的动画过程中做高耗时的操作（如：大面积reflow、repaint、复杂JS计算）。
        3. 对于动画效果的实现，建议使用`requestAnimationFrame`（或[velocity动画库](https://github.com/julianshapiro/velocity)），避免使用~~setTimeout、setInterval~~。
        4. 把耗时长的JS代码放到`Web Worker`中去做。
        5. 用操作class替代~~直接操作CSS属性~~。
    2. 缩小样式计算的范围和降低复杂度

        1. 降低样式选择器的复杂度、提升[选择器性能](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/README.md#css选择器)。

            ><details>
            ><summary>可以使用基于class的方式，如：BEM</summary>
            >
            >1. `block-name__element-name--modifier-name--modifier-val`（[getbem.com](http://getbem.com/naming/)）
            >2. `block-name__element-name_modifier-name_modifier-val`（[en.bem.info](https://en.bem.info/methodology/naming-convention/)）
            ></details>
        2. 减少需要执行样式计算的元素的个数（随着元素递增而计算量线性递增）。
    3. 避免大规模、复杂的layout与reflow

        1. 避免强制同步布局

            >强制同步布局（forced synchronous layouts）：使用JS强制浏览器提前执行layout。

            实行**先读后写**原则：先批量读取元素样式属性（返回上一帧的值），再对样式属性、类名等进行写操作。

            ><details>
            ><summary>e.g.</summary>
            >
            >```javascript
            >/* bad：强制同步布局，可能产生布局抖动 */
            >dom.forEach(function (elem) {
            >    if (window.scrollY < 200) { // 计算读取layout
            >        elem.style.opacity = 0.5;   // JS写入样式
            >    }
            >});
            >
            >/* good：先读后写 */
            >if (window.scrollY < 200) { // 计算读取layout
            >    /* 批量JS写入样式 */
            >    dom.forEach(function (elem) {
            >        elem.style.opacity = 0.5;
            >    });
            >}
            >```
            ></details>
        2. 避免布局抖动

            >布局抖动（layout thrashing）：快速多次进行强制同步布局。
        3. 使用离线DOM操作样式完毕，再添加或替换到文档中；把文档中要操作的DOM设置为`display: none;`再操作样式，操作完毕后恢复复显示。
        4. `position: absollute/fixed;`的元素reflow开销较小。
        5. 使用[`flexbox`](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/HTML+CSS学习笔记/弹性盒子.md#弹性盒子)布局（对于相同数量的元素、视觉外观，flex布局的时间更少）。
    4. 简化绘制的复杂度、减小绘制区域

        合理划分层，动静分离，可避免大面积重绘。
    5. 优先使用层（composite layers）来统一操作动画，并控制层数量

        如果元素仅改变composite，那么将其提升至单独的层。

        1. 只使用`transform/opacity`来实现动画效果。
        2. 用`will-change/translateZ`属性把动画元素提升到单独的层中。
        3. 避免滥用层提升、避免创建过多层（更多的层需要更多的内存和更复杂的管理）。
        4. 使用3D硬件加速提升动画性能时，最好给元素增加一个`z-index`属性（改变层叠上下文的顺序），人为干扰层排序，可以有效减少Chrome创建不必要的层，提升渲染性能。

            >如果有一个元素，它的兄弟元素在层中渲染，而这个兄弟元素的`z-index`比较小，那么这个元素（不管是不是应用了硬件加速样式）也会被放到层中。
    6. 对用户输入、滚动事件进行[函数防抖](https://github.com/realgeoffrey/knowledge/blob/master/网站前端/JS学习笔记/README.md#函数防抖函数节流)处理

        >滚动会触发高频率重新渲染，scroll事件的处理函数也会被高频率触发。

        1. 避免使用运行时间过长的事件处理程序，它们会阻塞页面的滚动渲染。
        2. 避免在事件处理程序中修改样式属性。
        3. 对事件处理程序去抖动（debounce），存储事件对象的值，然后在`requestAnimationFrame`回调函数中修改样式属性。
6. 经验：

    1. 追查性能问题、优化动画的时候：
        1. 打开**Layer Borders**、**Paint Flashing**选项；
        2. 使用Chrome [Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)工具检查。
    2. 低性能设备（Android）优先调试。

        1. （除了**CSS3翻转属性**与**内嵌滚动条**同时出现无法解决）样式问题都可以像处理ie6问题一样通过真机试验出解决方案。
        2. 有些低版本机型会有类似ie6的CSS问题，包括**CSS3的厂商前缀（`-webkit-`等）**、**层叠关系（`z-index`）**，并且要更注意**渲染性能（层产生）**。

### 经验技巧
1. 命名间隔

    >`-`短横线隔开式（kebab-case）、小驼峰式（camelCase）、大驼峰式（PascalCase）、`_`。

    1. HTML的class和id：`-`。
    2. 图片命名：`_`。
    3. 其他文件（除了.vue组件文件）：`-`。
    4. JS相关：

        1. JS的变量和函数：小驼峰式（构造函数：大驼峰式）。
        2. .vue组件文件：大驼峰式或`-`（且需要2个以上单词）。

            >页面文件（如：nuxt的pages）：按照路由访问命名（习惯用`-`）。
2. 引号使用

    1. HTML标签的`attribute`的值、CSS样式属性的值（如：`content`、`font-family`、`quotes`）：

        >除了有空格之外，都允许不加引号。建议：HTML标签的`attribute`的值都添加，CSS样式属性的值都不添加。

        双引号`"`
    2. JS代码的字符串：

        单引号`'`
3. CSS分类命名规范

    1. BEM（以及变种）

        1. `block-name__element-name--modifier-name--modifier-val`
        2. `is-状态`

        >1. `--modifier`：仅包括多种外观的不同样式，如：size、type、color、font。
        >2. `is-状态`：仅包括JS控制状态显示的不同样式，如：active、disabled、show。
        >- `j-`：仅给JS使用的选择器，意味着不会有样式添加到这个选择器上。
    2. <details>

        <summary><del>已过时的方案</del></summary>

        1. 布局`.g-`（grid）

            将页面分割为几个大块的布局，一般来说是页面最外层的类名。
        2. 模块`.m-`（module）

            可重复使用的较大的整体。
        3. 元件`.u-`（unit）

            不可再分的较为小巧的个体，通常被重复用于各种模块中。
        4. 状态`.z-`（zhuangtai）

            为状态类样式加入前缀，统一标识，方便识别，只作为后代选择器使用（如：`.z-hover`或`.z-active`）。
        5. 样式区分`.i-`（icon）

            同一批内容的不同样式（如：仅背景不同的几个按钮），可以用`.i-1`、`.i-2`区分样式。

            >如果在模块上，可以使用**选择器扩展**而不加前缀`.i-`，如：`.m-xxx`扩展内容`.m-xxx-1`、`.m-xxx .btn`扩展内容`.m-xxx .btn-1`。
        6. JS功能`.j-`（JS）

            仅作为JS锚点使用，不添加任何CSS样式。

        >- 皮肤`.s-`（skin）
        >
        >    把皮肤型的样式抽离出来。
    </details>
4. 经验

    1. （标签）语义化：让机器可以读懂内容

        >先用纯HTML标签语义化结构，再加入CSS满足样式，最后加入交互。

        1. 去掉或丢失样式能够让页面呈现出清晰的结构。
        2. 有利于SEO（爬虫依赖于标签来确定上下文和各个关键字的权重）。
        3. 方便其他设备解析（如：屏幕阅读器、盲人阅读器、移动设备）以特殊方式渲染网页。
        4. 便于团队开发和维护，更具可读性、减少差异化。
    2. 合理减少层级嵌套，行内元素不要嵌套块级元素（如：`<a>`不嵌套`<div>`）。
    3. 用父节点的class去管理子节点。
    4. 有些WAP端（如：Android各奇葩机型）页面的点击按钮制作大一些，否者难以点击触发JS效果。
5. CSS编码规范

    绝大部分同意[fex-team:tyleguide](https://github.com/fex-team/styleguide/blob/master/css.md#css编码规范)。

    >可以设置为IDEs的**Reformat Code**的排版样式。
6. CSS注释方式

    除了普通注释之外，还可以把注释内容放在根元素的伪元素中：

    ```css
    :root:before {
      content: "author: 重构; design: 设计师; update: 更新时间;";
      display: none;
    }
    ```

### Tips
1. 限定布局宽度，让内容决定布局高度。
2. `<a>`的属性`target="_blank"`，在一些浏览器中，无论`href`值是什么内容（包括`#`和`javascript:`）都会打开新页面。
3. 在拥有`target="_blank"`的`<a>`中添加`rel="noopener"`或`rel="noreferrer"`。

    >没有`target="_blank"`属性的新打开的页面和原页面不存在关系。

    1. 没有添加额外的`rel`属性的开启新窗口：

        1. 新页面将与原页面在同一个进程上运行，若执行开销大的JS，会互相影响性能。
        2. 新页面可以通过`window.opener`访问原窗口对象，并使用`window.opener.location`改变原页面导航。

        ><details>
        ><summary>chrome任务管理器展示：<code>target="_blank"</code>但未设置<code>rel</code></summary>
        >
        >![chrome任务管理器图](./images/chrome-task-1.png)
        ></details>
    2. 添加额外的`rel`属性：

        1. `rel="noopener"`的新窗口：

            与原页面不在同一个进程、且`window.opener`返回`null`。
        2. `rel="noreferrer"`（不限于`target="_blank"`）：

            （不在一个进程、且`window.opener`返回`null`，）http请求不发送`Referer`（`document.referrer`返回`''`）。
4. （SEO）对不想宣传的链接，在`<a>`中添加`rel="nofollow"`。

    ><details>
    ><summary>告诉搜索引擎“不要跟踪此网页上的链接”或“不要跟踪此特定链接”</summary>
    >
    >1. 可以用于阻止在PR值高的网站上以留言等方式添加链接从而提高自身网站排名的行为，以改善搜索结果的质量，防止垃圾链接的蔓延。
    >2. 网站站长也可对其网页中的付费链接使用nofollow来防止该链接降低搜索排名。
    >3. 对一些重要度低的网页内容使用nofollow，还可以使搜索引擎以不同的优先级别来抓取网页内容。
    ></details>
5. 404和5xx错误需要制作页面。
6. 没有设置宽度的`float`元素，其宽度等于子节点宽度：

    1. 主流浏览器等于最外层子节点宽度。
    2. ie6等于所有子节点中最大的宽度。
7. `inline`、`inline-block`的元素前可能有空隙（其实是行内标签前面的空白符，若拥有`font-size`之后便会有高宽），通过以下办法解决：

    1. 把`inline`、`inline-block`节点设置为`block`。
    2. 给父级节点设置`font-size: 0;`（可用此方法排查是否是空格造成的）。
8. 页面是按照顺序加载资源，当且仅当有使用需求时才会去加载外部资源。

    已加载完成的CSS文件内有多个url请求（`background`），但仅在页面节点要引用某个url请求时（无论节点是否隐藏），才会去请求这个资源，而不是在加载CSS文件时就加载外部资源。可以用于监控用户行为（当用户某些操作导致展示背景时加载外部资源——外部资源可以是上报接口）。
9. 使用动态DOM加载，代替内容的`display: none;`（免去构建复杂的DOM）：

    1. `<script type="text/template"></script>`
    2. `<template></template>`
    3. `<textarea style="display:none;"></textarea>`
10. WAP端页面或支持伪类的浏览器，能用`:before/after`的就不要添加标签。
11. 单选`<input type="radio">`、多选`<input type="checkbox">`按钮开关自定义样式：

    用`input:checked + 兄弟节点`操作选项选中与否的不同样式；可以隐藏`<input>`，点击在`<label>`上改变`<input>`的`:checked`状态（`<label>`的`for`绑定`<input>`的`id`），用自定义样式来制作单选框、复选框。避免使用JS。
12. 输入框仅输入数字的：

    1. `<input type="number" pattern="[0-9]*" onchange="处理函数">`
    2. <details>

        <summary>处理函数（jQuery）</summary>

        ```javascript
        $(输入框).on('change', function () {
            const $this = $(this);
            let val = $this.val();

            val = parseFloat(val.split('.').slice(0, 2).join('.'));  // 去除多余的小数点（type="text"才有用）

            if (Number.isNaN(val)) {    // 去除无效输入
                val = 默认值;
            } else {    // 处理最小最大值
                val = Math.max(Math.min(val, 最大值), 最小值);
            }

            if (val.toString().split('.')[1] && val.toString().split('.')[1].length > 小数位数) {  // 保留小数位数
                val = val.toFixed(小数位数);
            }

            $this.val(val);
        });
        ```
        </details>
13. `<datalist>`为`<input>`的输入值添加建议（`<input>`的`list`绑定`<datalist>`的`id`）

    <details>
    <summary>e.g.</summary>

    ```html
    <input list="标记"/>
    <datalist id="标记">
      <option value="建议值1">
      <option value="建议值2">
    </datalist>
    ```
    </details>
14. Android2.3出现渲染问题可以在渲染错误的节点上添加`position: relative;`（类似ie6的haslayout）。
15. 避免：

    1. 避免~~放大、缩小图片~~，使用原始大小展现。
    2. 避免使用不可缓存且增加额外HTTP请求的 ~~<iframe>~~。
16. 超出内容区域的内容：

    1. 用绝对定位把内容设置在外部

        不要把超出内容区域的绝对定位设置在`<body>`直接子级，而是设置在`<body>`下拥有`overflow: hidden;`的父级下。
    2. ~~大背景模式~~
17. `CSS.supports(CSS语句)`或`CSS.supports(CSS属性, 值)`判断浏览器是否支持一个给定CSS语句。
18. 切图时`<img>`外嵌套一层标签，好应对可能要在图片上添加东西的需求。
19. 没有 **背景内容（透明背景无效、局部背景只能在有背景处有效）、或文本、或其他内容（如：`<img>`、`<iframe>`等）** 承载的节点无法触发鼠标事件。

    可以在全区域添加背景使鼠标事件有效。

    1. 加透明背景：`background: rgba(0, 0, 0, .002)`（小于`0.002`的透明度无效）。
    2. 加1x1像素的透明图：`background: url(1x1像素透明图地址) repeat;`。
