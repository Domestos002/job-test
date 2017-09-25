/* DEV PLUGINS------------------------------------------------------------------
 ---------------------------------------------------------------------------- */
const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    twig = require('gulp-twig'),
    babel = require('gulp-babel'),
    sass = require("gulp-sass"),
    prefix = require("gulp-autoprefixer"),
    gcmq = require('gulp-group-css-media-queries'),
    uglify = require('gulp-uglify'),
    sourcemaps = require("gulp-sourcemaps"),
    callback = require('gulp-callback'),
    clean = require('gulp-clean'),
    spritesmith = require("gulp.spritesmith"),
    browserSync = require('browser-sync'),
    purify = require('gulp-purifycss'),
    cssnano =  require('gulp-cssnano'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace');
    less = require('gulp-less');
/* PRODUCTION PLUGINS ----------------------------------------------------------
 ---------------------------------------------------------------------------- */
const useref = require('gulp-useref'),
    wiredep = require('wiredep').stream,
    gulpif = require('gulp-if');

/* SOURCES --------------------------------------------------------------------
 ---------------------------------------------------------------------------- */
const sources = {
    html: {
        src: 'app/*.html',
        dist: 'app/'
    },
    css: {
        src: 'app/css/*.css',
        dist: 'app/css'
    },
    js: {
        dist: 'app/js',
        watch: 'app/js/*.js',
        es6_watch: 'app/js/es6/*.js'
    },
    pug: {
        src: 'app/pug/*.pug',
        watch: 'app/pug/**/*.pug',
        dist: 'app/'
    },
    twig: {
        src: 'app/twig/*.twig',
        watch: 'app/**/*.twig',
        temp_dist: 'app/.twig-temp/',
        temp_dist_html: 'app/.twig-temp/*.html',
        dist: 'app/'
    },

    less: {
        src: 'app/less/main.less',
        watch: 'app/**/*.less',
        dist: 'app/less'
    },

    bower: {src: 'app/bower_components'},

    images: {
        icons: {
            default: 'app/images/icons/*.png',
            retina: 'app/images/icons/*@2x.png'
        },
        dist: 'app/images'
    }
};

/* DEVELOPMENT GULP TASKS ------------------------------------------------------

 ---------------------------------------------------------------------------- */
gulp.task('svgstore', function () {
    return gulp
        .src('app/images/svg-icons/*.svg')
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            };
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('app/images/'));
});



/* Error Handler ---------------------------------------------------------------
 ---------------------------------------------------------------------------- */

const onError = function (err) {
    console.log(err);
    this.emit('end');
};

/* TWIG --------------------------------------------------------------------- */
gulp.task('twig', function () {
    gulp.src(sources.twig.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(twig({
            data: {
                benefits: [
                    'Fast',
                    'Flexible',
                    'Secure'
                ]
            }
        }))
        .pipe(gulp.dest(sources.twig.dist))
        .pipe(browserSync.reload({stream: true}));

    return null;
});

gulp.task('less', function () {
    return gulp.src(sources.less.src)
        // .pipe(watchLess(sources.less.watch))
        .pipe(less())
        .pipe(prefix({
            browsers: ['>0%'],
            cascade: false
        }))
        .pipe(gulp.dest(sources.css.dist))
        .pipe(browserSync.reload({stream: true}));
});

/* Combine media queries ----------------------------------------------------- */
gulp.task('gcmq', ['less'], function () {
    gulp.src(sources.css.src)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(gcmq())
        .pipe(gulp.dest(sources.css.dist))
        .pipe(browserSync.reload({stream: true}));
});

/* Sprites ------------------------------------------------------------------- */
gulp.task('sprite', function () {
    const spriteData = gulp.src(sources.images.icons.default)
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../images/sprite.png',
            cssName: '_sprite.sass'
        }));

    spriteData.css.pipe(gulp.dest(sources.sass.dist));
    spriteData.img.pipe(gulp.dest(sources.images.dist));
});

/* CSSNANO --------------------------------------------------------------------- */
gulp.task('cssnano', function() {
    return gulp.src('dist/css/common.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css/'));
});

/* PURIFY --------------------------------------------------------------------- */
gulp.task('purify', function() {
    return gulp.src('dist/css/common.css')
        .pipe(purify(['dist/js/*.js', 'dist/*.html']))
        .pipe(gulp.dest('dist/css/'));
});

/* ES6 to ES5 ---------------------------------------------------------------- */
gulp.task('es6', function () {
    return gulp.src(sources.js.es6_watch)
        .pipe(plumber())
        .pipe(babel({
            "presets": ["es2015"]
        }))
        .pipe(gulp.dest(sources.js.dist));
});

/* BOWER --------------------------------------------------------------------- */
gulp.task('bower', function () {
    gulp.src(sources.html.src)
        .pipe(wiredep({
            directory: sources.bower.src
        }))
        .pipe(gulp.dest('app'));
});

/* BROWSER SYNC -------------------------------------------------------------- */
gulp.task('browser-sync', function () {
    browserSync.init({
        server: "./app"
    });
});

/* PRODUCTION GULP TASKS ------------------------------------------------------
 ---------------------------------------------------------------------------- */

/* SFTP --------------------------------------------------------------------- */
gulp.task('sftp', function () {
    gulp.src("dist/**/*")
        .pipe(sftp({
            host: "",
            user: "",
            pass: "",
            remotePath: ""
        }));
});

/* CLEAN -------------------------------------------------------------------- */
gulp.task('clean', function () {
    gulp.src('dist', {read: false})
        .pipe(clean());
});

/* BUILD -------------------------------------------------------------------- */
gulp.task('build', ["clean"], function () {
    setTimeout(function () {
        gulp.start('build_dist');
        gulp.start('fonts');
        gulp.start('images');
    }, 500);
});

gulp.task('build_dist', function () {
    gulp.src(sources.html.src)
        .pipe(useref())
        //.pipe(gulpif('*.js', uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function () {
    gulp.src([
        'app/bower_components/uikit/fonts/**',
        'app/fonts/**'
    ])
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function () {
    gulp.src([
        'app/images/**',
        '!app/images/icons',
        '!app/images/icons-2x',
        '!app/images/icons/**',
        '!app/images/icons-2x/**'
    ])
        .pipe(gulp.dest('dist/images'));
});

/* DEFAULT AND GULP WATCHER ----------------------------------------------------
 ---------------------------------------------------------------------------- */
gulp.task('watch', function () {
    // gulp.watch('bower.json', ["bower"]);
    gulp.watch(sources.less.watch, ['less'], ['gcmq']);
    gulp.watch(sources.twig.watch, ["twig"]);
    gulp.watch(sources.js.es6_watch, ['es6']);
    gulp.watch(sources.js.watch).on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'es6', 'twig', 'gcmq', 'watch', 'less']);