const { series, src, dest, watch, parallel } = require('gulp');
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const browsersync = require('browser-sync').create()
const hb = require('gulp-hb');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat')
/**
 * First task for minifying html
 */
const minifyTask = () => {
    return src('dist/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest('dist'))
}

/**
 * Task for  css
 */

const cssTask = () => {
    return src('src/assets/css/*.css')
        .pipe(postcss([
            require('tailwindcss')
        ]))
        .pipe(dest('dist/assets/css'))
}

/**
 * Server
 */
const serveTask = () => {
    browsersync.init({
        server: {
            baseDir: './dist'
        }
    })
}
/**
 * Reload function
 */
const reload = (done) => {
    browsersync.reload();
    done()
}
/**
 * Watch tasks
 */
const watchTask = () => {
    watch(['src/html/*.html','src/assets/partials/*.hbs'], series(templatingTask,minifyTask, reload))
    watch(['src/assets/css/*.css'], series(cssTask, reload))

}

const templatingTask = () => {
    return src('src/html/*.html')
        .pipe(
            hb()
                .partials('src/assets/partials/*.hbs'))
        .pipe(dest('dist'))
}

const jsTask = () =>{
    return src('src/assets/js/*.js')
    .pipe(concat('index.js'))
    .pipe(uglify({"ecma":5}))
    .pipe(dest('dist/assets/js/index.js'))
}
exports.minify = minifyTask;
exports.css = cssTask;
exports.default = series(templatingTask,minifyTask,jsTask, cssTask, parallel(watchTask, serveTask));
