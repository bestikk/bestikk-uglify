'use strict'
const log = require('bestikk-log')
const childProcess = require('child_process')

const javaVersionText = function () {
  const result = childProcess.execSync('java -version 2>&1', { encoding: 'utf8' })
  const lines = result.split('\n')
  let javaVersionLine
  for (let line of lines) {
    if (line.startsWith('java version') || line.startsWith('openjdk version')) {
      javaVersionLine = line
    }
  }
  if (javaVersionLine) {
    const javaVersion = javaVersionLine.match(/"(.*?)"/i)[1]
    return javaVersion.replace(/\./g, '').replace(/_/g, '')
  }
  throw new Error('Unable to find the java version in: ' + lines)
}

const checkRequirements = function () {
  // Java7 or higher is available in PATH
  try {
    if (javaVersionText() < '170') {
      log.error('Closure Compiler requires Java7 or higher')
      return false
    }
  } catch (e) {
    log.error('error: ' + e)
    log.error('\'java\' binary is not available in PATH')
    return false
  }
  return true
}

const Uglify = function () {
  this.requirementSatisfied = checkRequirements()
}

Uglify.prototype.minify = function (source, destination) {
  if (this.requirementSatisfied) {
    return new Promise((resolve, reject) => {
      childProcess.exec(`java -jar ${__dirname}/compiler.jar --warning_level=QUIET --js_output_file=${destination} ${source}`, error => {
        if (error) {
          log.error('error: ' + error)
          return reject(error)
        }
        return resolve({})
      })
    })
  }
  log.warn('Requirements are not satisfied (see previous errors), skipping minify task')
  return Promise.resolve({})
}

module.exports = new Uglify()
