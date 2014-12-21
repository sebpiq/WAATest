var path = require('path')
  , tasks = require('../lib/tasks')

if (process.argv.length < 3) {
  console.error('usage : node' + process.argv[1] + '  <dir>')
  process.exit(1)
}

var scaffoldDir = path.resolve(process.argv[2])

tasks.scaffold(scaffoldDir, function(err) {
  if (err) throw err
  console.log('OK scaffolded tests in ' + scaffoldDir)
  process.exit(0)
})