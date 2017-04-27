var imagemin = require('gulp-imagemin'), //imagemin
    svgo = require('imagemin-svgo'), //svg压缩
    gifsicle = require('imagemin-gifsicle'), //gif压缩
    jpegtran = require('imagemin-jpegtran'), //jpg压缩
    pngquant = require('imagemin-pngquant'), //png压缩
    optipng = require('imagemin-optipng'), //png压缩
    sourcemaps = require('gulp-sourcemaps'), //source map
    concat = require('gulp-concat'), //合并文件
    nano = require('gulp-cssnano'), //css压缩
    postcss = require('gulp-postcss'), //css工具
    autoprefixer = require('autoprefixer'), //添加css厂家前缀
    px2rem = require('postcss-px2rem'), //px转rem
    rename = require('gulp-rename'), //重命名
    makeUrlVer = require('gulp-make-css-url-version'), //css添加时间戳
    sass = require('gulp-sass'), //编译sass
    spritesmith = require('gulp.spritesmith'), //生成雪碧图&样式表
    fontmin = require('gulp-fontmin'), //字体子集化
    uglify = require('gulp-uglify'), //js压缩
    babel = require('gulp-babel'), //转换编译
    browserSync = require('browser-sync').create(), //浏览器同步测试工具
    gulp = require('gulp');

/* 图片压缩*/
gulp.task('runImage', function () {
    gulp.src(['../images/dev/**'])
        .pipe(
            imagemin([
                svgo(),
                gifsicle({optimizationLevel: 3}),
                jpegtran({progressive: true}),
                pngquant({speed: 1}),
                optipng({optimizationLevel: 7})
            ]))
        .pipe(gulp.dest('../images/release/'));
});


/* css：[合并]、压缩、添加厂商前缀、重命名、添加timestamp、source map*/
gulp.task('runCss', function () {
    gulp.src(['../css/dev/**/*.css'])
        .pipe(sourcemaps.init())
        //.pipe(concat('all.css'))
        .pipe(nano({
            discardUnused: false,
            zindex: false,
            reduceIdents: false,
            mergeIdents: false
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(rename({suffix: '.min'}))
        .pipe(makeUrlVer({useDate: true}))  //不被gulp-sourcemaps支持
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../css/release/'));
});

/* scss：转译压缩css、添加厂商前缀、添加timestamp、source map*/
gulp.task('runScss', function () {
    gulp.src(['../scss/dev/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                outputStyle: 'compressed' //输出方式：compressed、expanded
            }).on('error', sass.logError)
        )
        .pipe(postcss([autoprefixer()]))
        .pipe(makeUrlVer({useDate: true}))  //不被gulp-sourcemaps支持
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../scss/release/'));
});

/*
 * px -> rem
 * 对所有没有注释的px转换为rem
 * 对结尾带有“px”的注释，转化为[data-dpr="1~3"] 对象{px值}
 * 对结尾带有“no”的注释，不进行转换
 */
gulp.task('runPx2rem', function () {
    gulp.src(['../px2rem/dev/**/*.css'])
        .pipe(postcss([px2rem({
            remUnit: 20,    //px->rem除以的数
            baseDpr: 1,  ///*px*/转换前值的DPR
            remPrecision: 6  //小数精确位数
        })]))
        .pipe(gulp.dest('../px2rem/release/'));
});

/* 多图 -> 雪碧图 + 样式表*/
gulp.task('runSprites', function () {
    /* PC端*/
    gulp.src('../sprites/dev/*')
        .pipe(spritesmith({
            padding: 2, //合并图间距
            algorithm: 'top-down', //排列方式 ['binary-tree' | 'top-down' | 'left-right' | 'diagonal' | 'alt-diagonal']
            imgName: 'sprites.png', //输出合并后图片
            cssTemplate: 'pc.handlebars', //渲染输出css的模板文件
            cssName: 'sprites_pc.css' //输出合并后样式（后缀为[.css | .sass | .scss | .less | .styl/.stylus | .json]）
        }))
        .pipe(gulp.dest('../sprites/release/'));

    /* WAP端（rem+%）*/
    gulp.src('../sprites/dev/*')
        .pipe(spritesmith({
            padding: 2,
            algorithm: 'top-down',
            imgName: 'sprites.png',
            cssTemplate: 'wap.handlebars',
            cssName: 'sprites_wap.scss'
        }))
        .pipe(gulp.dest('../sprites/release/'));
});

/* ttf -> 多个兼容字体 + 样式表*/
gulp.task('runFont', function (cb) {
    var buffers = [];

    gulp.src(['../font/dev/*.html'])    /* 传入需要提取字体的页面，没有页面则所有字*/
        .on('data', function (file) {
            buffers.push(file.contents);
        })
        .on('end', function () {
            var text = Buffer.concat(buffers).toString('utf-8');
            gulp.src(['../font/dev/*.ttf']) //只能传入ttf类型
                .pipe(fontmin({text: text}))
                .pipe(gulp.dest('../font/release/'))
                .on('end', cb);
        });
});


/* js：[合并]、压缩、重命名、source map*/
gulp.task('runJs', function () {
    gulp.src(['../js/dev/**/*.js'])
        .pipe(sourcemaps.init())
        //.pipe(concat('all.js'))
        .pipe(uglify({
            mangle: true, //是否混淆变量名
            compress: true  //是否完全压缩
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../js/release/'));
});

/* ES6 -> ES5*/
gulp.task('runBabel', function () {
    gulp.src(['../babel/dev/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['../../tools/node_modules/babel-preset-es2015'] //打包了ES6的特性
        }))
        //.pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('../babel/release/'));
});


/* default*/
gulp.task('default', ['runImage', 'runCss', 'runScss', 'runPx2rem', 'runSprites', 'runFont', 'runJs', 'runBabel']);


/* 监视文件，自动执行*/
gulp.task('watch', function () {
    gulp.watch(['../images/dev/**'], ['runImage']);
    gulp.watch(['../css/dev/**/*.css'], ['runCss']);
    gulp.watch(['../scss/dev/**/*.scss'], ['runScss']);
    gulp.watch(['../px2rem/dev/**/*.css'], ['runPx2rem']);
    gulp.watch(['../sprites/dev/**'], ['runSprites']);
    gulp.watch(['../font/dev/**'], ['runFont']);
    gulp.watch(['../js/dev/**/*.js'], ['runJs']);
    gulp.watch(['../babel/dev/**/*.js'], ['runBabel']);
});


/* 监听代理服务器*/
gulp.task('browserSync', function () {
    browserSync.init({
        //proxy: 'localhost'  //服务器
        server: '../../www/' //相对地址
    });
    gulp.watch([
        '../../www/**/*.html',
        '../../www/**/js/**/*.js',
        '../../www/**/css/**/*.css',
        '../../www/**/images/**'
    ]).on('change', browserSync.reload);    //刷新浏览器
});