const gulp = require('gulp');
const browserSync = require('browser-sync');
const Sass = require('gulp-sass');
const concatCss = require('gulp-concat-css');
const clearCss = require('gulp-clean-css');
const unCss = require('gulp-uncss');
const imagemin = require('gulp-imagemin');

// Compile SASS
gulp.task('sass', gulp.parallel(() => {
    return gulp.src([
        'node_modules/bulma/bulma.sass',
        'src/scss/*.scss'
    ])
    .pipe(Sass())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}));
// Concat and move generated CSS file
gulp.task('concat', gulp.series(() => {
    return gulp.src('src/css/*.css')
               .pipe(concatCss('dashboard.css'))
               .pipe(clearCss({compatibility: 'ie8'}))
               /*
               .pipe(unCss({
                   html: ['src/*.html']
               }))
               */
               .pipe(gulp.dest('dist/css/'));
}));
// Move JS files
gulp.task('js', gulp.parallel(() => {
    return gulp.src([
        'src/js/*.js'
    ])
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}));
// Move HTML files
gulp.task('html', gulp.parallel(() => {
    return gulp.src(['src/*.html']).pipe(gulp.dest(['dist']));
}));
// Minify images
gulp.task('img', gulp.parallel(() => {
    return gulp.src(['src/img/*']).pipe(imagemin()).pipe(gulp.dest(['dist/img']));
}));
// FontAwesome
gulp.task('fa', gulp.parallel(() => {
    return gulp.src(['node_modules/@fortawesome/fontawesome-free/css/all.min.css']).pipe(gulp.dest(['src/css']));
}));

gulp.task('fa-fonts', gulp.parallel(() => {
    return gulp.src(['node_modules/@fortawesome/fontawesome-free/webfonts/*']).pipe(gulp.dest(['dist/webfonts']));
}));
// Server watch
gulp.task('serve', gulp.parallel( () => {
    browserSync.init({
        server: './dist'
    });

    gulp.watch([
        'src/scss/**/*.scss'
    ], gulp.series(['sass', gulp.parallel('concat')]));
    
    gulp.watch([
        'src/**/*.html'
    ], gulp.series('html'));
    
    gulp.watch('src/**/*.html').on('change', browserSync.reload);
    gulp.watch('src/scss/**/*.scss').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('sass', gulp.parallel('concat', 'js', 'html', 'img', 'fa', 'fa-fonts', 'serve')));