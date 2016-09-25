var log = require('bestikk-log');
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');

var javaVersionText = function() {
  var result = child_process.execSync('java -version 2>&1', {encoding: 'utf8'});
  var firstLine = result.split('\n')[0];
  var javaVersion = firstLine.match(/"(.*?)"/i)[1];
  return javaVersion.replace(/\./g, '').replace(/_/g, '');
};

var checkRequirements = function() {
  // Java7 or higher is available in PATH
  try {
    if (javaVersionText() < '170') {
      log.error('Closure Compiler requires Java7 or higher');
      return false;
    }
  } catch (e) {
    log.error('\'java\' binary is not available in PATH');
    return false;
  }
  return true;
};

var Uglify = function() {
  this.requirementSatisfied = checkRequirements();
}

Uglify.prototype.minify = function(source, destination, callback) {
  if (requirementSatisfied) { 
    return child_process.exec('java -jar ' + __dirname + '/compiler.jar --warning_level=QUIET --js_output_file=' + destination + ' ' + source, callback);
  }
  log.warn('Requirements are not satisfied (see previous errors), skipping minify task');
  typeof callback === 'function' && callback();
}

module.exports = new Uglify();
