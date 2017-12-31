# Read me!

This is just a stupid little static site generator. It does one thing and it does it well enough. All of the existing Node.js static site generators are more complicated than they need to be to solve my problem.

This stupid little thing uses Gulp. Nothing too fancy.

## Main task

### serve

Run BrowserSync locally and watch for changes to images, favicons, js, styles, markdown, and templates

## Other tasks

### s3

Set your environment and deploy to S3.

### clean

Clear out the `dist` and `zipped` directories

### gzip

Compress files for deploying to S3

### images

Compress and move common image formats.

### favicons

Basic moving and cleanup for favorite icons. Basically the same as for images.

### render-pages

Render markdown with frontmatter into pages using Nunjucks templates. Nunjucks is pretty easily swappable for something else.

### js

Basic concatenating, uglifying, and moving for JS.

### styles

Compiles Sass and passes results through a few useful PostCSS plugins.
