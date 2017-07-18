var gulp = require('gulp'),
    server = require('gulp-develop-server');

var env_var = {
    NODE_ENV: 'development',
    SPARK_TOKEN: 'NzY5YjU4NjUtYzRhNi00ODE0LThjMjAtZWNlMjJmYzM5OWNlMjRhMjA4NWUtYTJi',
    PUBLIC_URL: 'https://3c4c9080.ngrok.io',
    APPD_ACCOUNT: 'asteroids2017070703100120'
}

// run server 
gulp.task('server:start', function() {
    server.listen({ path: './bot.js', env: env_var });
});

// restart server if app.js changed 
gulp.task('server:restart', function() {
    gulp.watch(['./*', './lib/*', './skills/*'], server.restart);
});

gulp.task('default', ['server:start', 'server:restart']);