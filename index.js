'use strict';
const log = require('bestikk-log');
const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const javaVersionText = function () {
  const result = child_process.execSync('java -version 2>&1', {encoding: 'utf8'});
  const lines = result.split('\n');
  let javaVersionLine;
  for (let line of lines) {
    if (line.startsWith('java version')) {
      javaVersionLine = line;
    }
  }
  if (javaVersionLine) {
    var javaVersion = javaVersionLine.match(/"(.*?)"/i)[1];
    return javaVersion.replace(/\./g, '').replace(/_/g, '');
  }
  throw 'Unable to find the java version in: ' + lines; 
};

const checkRequirements = function () {
  // Java7 or higher is available in PATH
  try {
    if (javaVersionText() < '170') {
      log.error('Closure Compiler requires Java7 or higher');
      return false;
    }
  } catch (e) {
    log.error('e' + e);
    log.error('\'java\' binary is not available in PATH');
    return false;
  }
  return true;
};

const Uglify = function() {
  this.requirementSatisfied = checkRequirements();
}

Uglify.prototype.minify = function (source, destination, callback) {
  if (this.requirementSatisfied) {
    return child_process.exec('java -jar ' + __dirname + '/compiler.jar --warning_level=QUIET --js_output_file=' + destination + ' ' + source, callback);
  }
  log.warn('Requirements are not satisfied (see previous errors), skipping minify task');
  typeof callback === 'function' && callback();
}

module.exports = new Uglify();
