'use strict'
const log = require('bestikk-log')
const childProcess = require('child_process')

const javaSemanticVersion = function () {
  const result = childProcess.execSync('java -version 2>&1', {encoding: 'utf8'})
  return extractJavaSemanticVersion(result)
}

const extractJavaSemanticVersion = function (input) {
  const lines = input.split('\n')
  let javaVersionLine
  for (let line of lines) {
    if (line.startsWith('java version') || line.startsWith('openjdk version')) {
      javaVersionLine = line
    }
  }
  if (javaVersionLine) {
    const javaVersion = javaVersionLine.match(/"(.*?)"/i)[1]
    const semanticVersion = javaVersion.match(/([0-9]+)\.([0-9]+)\.([0-9]+)(_.*)?/i)
    const major = parseInt(semanticVersion[1])
    const minor = parseInt(semanticVersion[2])
    const patch = parseInt(semanticVersion[3])
    const meta = semanticVersion[4]
    if (major === 1) {
      return {
        major: minor,
        minor: patch,
        patch: parseInt(meta.replace(/_/g, ''))
      }
    } else {
      return {
        major,
        minor,
        patch
      }
    }
  }
  throw new Error('Unable to find the java version in: ' + lines)
}

const checkRequirements = function () {
  // Java 8 or higher must be available in PATH
  try {
    let semanticVersion = javaSemanticVersion()
    if (semanticVersion.major < 8) {
      log.error('Closure Compiler requires Java 8 or higher')
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
  this.compilerJar = 'closure-compiler-v20181125.jar'
}

Uglify.prototype.minify = function (source, destination) {
  if (this.requirementSatisfied) {
    return new Promise((resolve, reject) => {
      childProcess.exec(`java -jar ${__dirname}/${this.compilerJar} --warning_level=QUIET --js_output_file=${destination} ${source}`, error => {
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
module.exports._extractJavaSemanticVersion = extractJavaSemanticVersion

