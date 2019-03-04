const assert = require('assert')
const Uglify = require('../index.js')
const fs = require('fs')

;(async function () {
  try {
    const defaultUglify = new Uglify()
    await defaultUglify.minify('index.js', './build/index.min.js')
    assert(fs.existsSync('./build/index.min.js'))

    const advancedUglify = new Uglify(['--jscomp_off=undefinedVars', '--compilation_level=ADVANCED'])
    await advancedUglify.minify('index.js', './build/index-advanced.min.js')
    assert(fs.existsSync('./build/index-advanced.min.js'))

    const indexStat = fs.statSync('./build/index.min.js')
    const advancedStat = fs.statSync('./build/index-advanced.min.js')
    assert(indexStat.size >= advancedStat.size)
  } catch (e) {
    console.log(e)
    process.exit(1)
  } finally {
    fs.unlinkSync('./build/index.min.js')
    fs.unlinkSync('./build/index-advanced.min.js')
  }
})()
