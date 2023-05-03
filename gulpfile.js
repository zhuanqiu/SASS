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
    done();
}


exports.default = browser




