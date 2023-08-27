const { src, dest, series, parallel, watch } = require('gulp');
const clean = require('gulp-clean');
const cleanCss = require('gulp-clean-css');
const cleanJs = require('gulp-minify');
const fileInclude = require('gulp-file-include');
const rename = require('gulp-rename');
const replace = require('gulp-string-replace');
const server = require('gulp-webserver');
const browserify = require('gulp-browserify');

const CSS_FILE_NAME = 'styles.css';
const JS_FILE_NAME = 'scripts.js';

const SRC_FOLDER_PATH = 'src';
const SRC_CSS_FOLDER_PATH = `${SRC_FOLDER_PATH}/css`;
const SRC_JS_FOLDER_PATH = `${SRC_FOLDER_PATH}/js`;
const SRC_CSS_FILE_PATH = `${SRC_CSS_FOLDER_PATH}/${CSS_FILE_NAME}`;
const SRC_JS_FILE_PATH = `${SRC_JS_FOLDER_PATH}/${JS_FILE_NAME}`;
const SRC_HTML_FILE_PATH = `${SRC_FOLDER_PATH}/index.html`;

const TEMP_FOLDER_PATH = 'temp/';
const OUTPUT_FOLDER_PATH = 'output/';
const CLEAN_OPTIONS = { read: false, allowEmpty: true };

/** Clear out and remove /output folder. */
const cleanOutput = () => src(OUTPUT_FOLDER_PATH, CLEAN_OPTIONS).pipe(clean());

/** Clear out and remove /temp folder. */
const cleanTemp = () => src(TEMP_FOLDER_PATH, CLEAN_OPTIONS).pipe(clean());

/** Minify CSS and save to temp folder. */
function minifyCss() {
  return src(SRC_CSS_FILE_PATH)
    .pipe(cleanCss({ debug: true }))
    .pipe(rename(CSS_FILE_NAME))
    .pipe(dest(TEMP_FOLDER_PATH));
}

/** Minify JS and save to temp folder. */
function minifyJs() {
  return (
    src(SRC_JS_FILE_PATH)
      .pipe(browserify({ debug: true }))
      // .pipe(cleanJs({ noSource: true, mangle: fa }))
      .pipe(rename(JS_FILE_NAME))
      .pipe(dest(TEMP_FOLDER_PATH))
  );
}

/** Embed minified CSS and JS files into HTML and minify HTML file. */
function combineAndMinifyHtml() {
  const headEndTag = '</head>';
  const cssFileInclude = `<style>@@include('${CSS_FILE_NAME}')</style>`;

  const bodyEndTag = '</body>';
  const jsFileInclude = `<script>@@include('${JS_FILE_NAME}')</script>`;

  return src(SRC_HTML_FILE_PATH)
    .pipe(replace(headEndTag, cssFileInclude + headEndTag))
    .pipe(replace(bodyEndTag, jsFileInclude + bodyEndTag))
    .pipe(fileInclude({ prefix: '@@', basepath: TEMP_FOLDER_PATH }))
    .pipe(dest(OUTPUT_FOLDER_PATH));
}

/** Start a dev server. */
function startDevServer() {
  return src(OUTPUT_FOLDER_PATH).pipe(
    server({ livereload: true, open: true, port: 1334 })
  );
}

/** Watch all files in the src folder and update the output index.html. */
function watchFiles() {
  watch(SRC_HTML_FILE_PATH, { events: 'all' }, combineAndMinifyHtml);
  watch(
    SRC_CSS_FOLDER_PATH,
    { events: 'all' },
    series(minifyCss, combineAndMinifyHtml)
  );
  watch(
    SRC_JS_FOLDER_PATH,
    { events: 'all' },
    series(minifyJs, combineAndMinifyHtml)
  );
}

exports.build = series(
  parallel(cleanOutput, cleanTemp),
  parallel(minifyCss, minifyJs),
  combineAndMinifyHtml,
  cleanTemp
);

exports.dev = series(
  parallel(cleanOutput, cleanTemp),
  parallel(minifyCss, minifyJs),
  combineAndMinifyHtml,
  parallel(startDevServer, watchFiles)
);
