const { series, src, dest, watch, parallel } = require('gulp');
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const browsersync = require('browser-sync').create()

/**
 * First task for minifying html
 */
const minifyTask = () => {
    return src('src/html/*.html')
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
        server:{
            baseDir:'./dist'
        }
    })
}
/**
 * Reload function
 */
const reload = (done)=>{
    browsersync.reload();
    done()
}
/**
 * Watch tasks
 */
const watchTask = ()=>{
    watch(['src/html/*.html'],series(minifyTask,reload))
    watch(['src/assets/css/*.css'],series(cssTask,reload))
   
}
exports.minify = minifyTask;
exports.css = cssTask;
exports.default = series(minifyTask, cssTask, parallel( watchTask,serveTask));
