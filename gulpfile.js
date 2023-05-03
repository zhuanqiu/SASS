const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');


function defaultTask(cb){
    console.log("gulp OK");
    cb();
}

exports.ok = defaultTask


//任務 A
function TaskA(cb){
    console.log("taskA");
    cb();
}

//任務 B
function TaskB(cb){
    console.log("taskB");
    cb();
}

exports.s = series(TaskA, TaskB); // 不同步執行
exports.p = parallel(TaskA, TaskB); //同步執行

// =========================== src / dest ====================== //

const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

function sassstyle(){
    return src("./sass/style.scss")
    .pipe(sourcemaps.init())//編譯 sass前
    //編譯 sass
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(cleanCSS()) //壓縮css
    .pipe(autoprefixer({
        cascade: false
    }))//跨瀏覽器
    .pipe(dest("./dist/css"));
}

exports.style = sassstyle


//html打包
const fileinclude = require('gulp-file-include');

function html(){
    return src('./*.html')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
        })
    )
    .pipe(dest('./dist/'))
}

exports.t = html;

function watchTask() {
    watch(['./sass/*.scss','./sass/**/*.scss'],sassstyle);
    watch(['./*.html' , './layout/*.html'] , html);
}
exports.w = watchTask;





exports.default = browser

//壓縮圖片


const imagemin = require('gulp-imagemin');

function img(){
    return src('./images/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 30, progressive: true}) // 壓縮品質 quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('./dist/images/'))
}


exports.p = img;

//不壓縮圖片
function img_origin(){
    return src(['image/*.*','images/**/*.*']).pipe(dest('./dist/images/'))
}

const clean = require('gulp-clean');

function clear() {
  return src('dist' ,{ read: false ,allowEmpty: true })//不去讀檔案結構，增加刪除效率  / allowEmpty : 允許刪除空的檔案
  .pipe(clean({force: true})); //強制刪除檔案 
}



// js min
const uglify = require('gulp-uglify');

function ugjs() {
    return src('./js/*.js')
        .pipe(uglify())
        .pipe(dest('./dist/js'))
}

exports.jsmin = ugjs


// js es5
const babel = require('gulp-babel');

function babel5() {
    return src('./js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(dest('dist/js'));
}

exports.js = babel5

//瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;


function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['./sass/*.scss','./sass/**/*.scss'],sassstyle).on('change' , reload);
    watch(['./*.html' , './layout/*.html'] , html).on('change' , reload);
    watch(['./*.images' , './images/**/*.*'] , img_origin).on('change' , reload);
    watch(['./js/*.js' , './js/**/*.js'] , ugjs).on('change' , reload);
    done();
}

//開發用

exports.dev = series(parallel(html , sassstyle , img_origin , uglify) , browser)

//上限用
exports.online = series(clear , parallel(html , sassstyle , img , babel5))



