'use strict';

const gulp =           require('gulp'),
      sass =           require('gulp-sass'),
      postcss =        require('gulp-postcss'),
      cssnext =        require('postcss-cssnext'),
      sourcemaps =     require('gulp-sourcemaps'),
      browserSync =    require('browser-sync').create(),
      concat =         require('gulp-concat'),
      uglify =         require('gulp-uglifyes'),
      pump =           require('pump'),
      imagemin =       require('gulp-imagemin'),
      changed =        require('gulp-changed'),
      htmlmin =        require('gulp-htmlmin'),
      size =           require('gulp-size'),
      wrap =           require('gulp-wrap'),
      frontMatter =    require('gulp-front-matter'),
      markdown =       require('gulp-markdown'),
      prettyUrl =      require('gulp-pretty-url'),
      fs =             require('fs'),
      gzip =           require('gulp-gzip'),
      clean =          require('gulp-clean'),
      s3 =             require('gulp-s3'),
      dotenv =         require('dotenv').config(),
      reload =         browserSync.reload;

const files = {
  "src": {
    "html": 'src/html/*.html',
    "markdown" : 'src/markdown/**/*.md',
    "templatesDir": 'src/templates/',
    "templates": 'src/templates/*.njk',
    "styles": 'src/styles/**/*.scss',
    "images": 'src/img/**/*.{png,gif,jpg,svg}',
    "favicons": 'src/favicons/*.{png,svg,ico}',
    "js": 'src/js/script.js',
    "ffo" : 'node_modules/fontfaceobserver/fontfaceobserver.js',
    "compiled" : 'dist/**/*.*',
  },
  "dist": {
    "zipped" : 'compiled',
    "html": 'dist',
    "styles": 'dist/css',
    "images": 'dist/img',
    "js": 'dist/js'
  }
}

gulp.task('s3', () => {
  const aws = {
    "key":    process.env.AWS_KEY,
    "secret": process.env.AWS_SECRET,
    "bucket": process.env.AWS_BUCKET,
    "region": process.env.AWS_REGION
  }
  gulp.src('compiled/**/*.*')
    .pipe(s3(aws,
      {
        gzippedOnly: false,
        read: false
      }
    ));
});

gulp.task('clean', () => {
  return gulp.src([files.dist.zipped, files.dist.html], { read: false })
    .pipe(clean());
});

gulp.task('gzip', ['images', 'styles', 'js', 'favicons', 'render-pages', 'clean'], () =>{
  return gulp.src(files.src.compiled)
    .pipe(size({
      title: "Gzip :",
      gzip: true,
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(files.dist.zipped))
    .pipe(gzip())
    .pipe(gulp.dest(files.dist.zipped))
});


gulp.task('serve', ['images', 'styles', 'js', 'favicons', 'render-pages'], () => {
  browserSync.init({
    server: "./dist"
  });
  gulp.watch(files.src.images, ['images']);
  gulp.watch(files.src.favicons, ['favicons']);
  gulp.watch(files.src.js, ['js']);
  gulp.watch(files.src.styles, ['styles']);
  gulp.watch(files.src.markdown, ['render-pages']);
  gulp.watch(files.src.templates, ['render-pages']);
});

gulp.task('favicons', () => {
  return gulp.src(files.src.favicons)
    .pipe(changed(files.dist.html))
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {cleanupIDs: false},
          {removeViewBox: false},
          {cleanupAttrs: true},
          {convertShapeToPath: true},
          {removeDesc: true}
        ]
      })
    ]))
    .pipe(size({
      title: "Favicons :",
      gzip: true,
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(files.dist.html))
    .pipe(reload({stream: true}));
})


gulp.task('images', () => {
  return gulp.src(files.src.images)
    .pipe(changed(files.dist.images))
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {cleanupIDs: false},
          {removeViewBox: false},
          {cleanupAttrs: true},
          {convertShapeToPath: true},
          {removeDesc: true}
        ]
      })
    ]))
    .pipe(size({
      title: "Images:",
      gzip: true,
      showFiles: true,
      pretty: true
    }))
    .pipe(gulp.dest(files.dist.images))
    .pipe(reload({stream: true}));
});

gulp.task('render-pages', ["images"], () => {
  gulp.src(files.src.markdown)
    .pipe(frontMatter())
    .pipe(markdown())
    .pipe(wrap(function (data) {
      return fs.readFileSync(files.src.templatesDir + data.file.frontMatter.layout).toString()
    }, null, { engine: 'nunjucks' }))
    .pipe(prettyUrl())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(files.dist.html))
    .pipe(reload({stream: true}));
});


gulp.task('js', (cb) => {
  pump([
    gulp.src([files.src.ffo, files.src.js]),
    sourcemaps.init(),
    concat('script.js'),
    uglify(),
    size({
      title: "JS final:",
      gzip: true,
      showFiles: true,
      pretty: true
    }),
    sourcemaps.write('.'),
    gulp.dest(files.dist.js),
    reload({stream: true})
  ],
  cb
  );
});


gulp.task('styles', () => {
  return gulp.src(files.src.styles)
    .pipe(size({
      title: "CSS inital:",
      showFiles: true,
      pretty: true
    }))
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      require("postcss-bem-linter")(),
      require("postcss-simple-vars")(),
      require("postcss-url")(),
      require("postcss-cssnext")(
        {features: {
          customProperties: false
        }}),
      require("cssnano")({ autoprefixer: false }),
      // require("postcss-browser-reporter")({ html: [files.src.html] }),
      require("postcss-reporter")()
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(size({showFiles: true}))
    .pipe(gulp.dest(files.dist.styles))
    .pipe(size({
      title: "CSS final:",
      gzip: true,
      showFiles: true,
      pretty: true
    }))
    .pipe(reload({stream: true}));
});


gulp.task('default', ['serve']);
