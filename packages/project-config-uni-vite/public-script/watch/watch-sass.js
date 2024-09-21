const gulp = require('gulp');
const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config({ path: '.env.local' });
dotenvExpand.expand(myEnv);

const { readFileSync, writeFileSync } = require('t-comm');

function debounce(fn, delay) {
  let timeout;
  const newFn = function (...args) {
    clearTimeout(timeout);
    const timerFn = () => fn.apply(this, args);
    timeout = setTimeout(timerFn, delay);
  };
  newFn.cancel = function () {
    clearTimeout(timeout);
  };
  return newFn;
}


function changeMainTS() {
  const { UNI_INPUT_DIR } = process.env;

  const entrance = path.resolve(UNI_INPUT_DIR, 'main.ts');
  writeFileSync(entrance, readFileSync(entrance));

  console.log('[Y]');
}


function watchSass(watch = './src/**/*.scss') {
  const realChangeMainTS = debounce(changeMainTS, 100);

  gulp.watch(watch, (cb) => {
    realChangeMainTS();
    cb();
  });
}

module.exports = watchSass;
