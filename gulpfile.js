var gulp = require('gulp');
gulp.task('server', ['styles', 'scripts'], function() {
  express.run(['./bin/www']); //启动
 
  gulp.watch('src/scss/**/*.scss', ['styles']); //监视样式表
  gulp.watch('src/js/**/*.js', ['scripts']); //监视js文件
  gulp.watch('views/**/*.jade', express.notify); //监视模板文件
  gulp.watch(['app.js', 'routes/**/*.js'], express.run);
  gulp.watch('public/**/*.css', express.notify);
  gulp.watch('public/**/*.js', express.notify);
});
 
gulp.task('default', ['server']);