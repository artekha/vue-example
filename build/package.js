/**
 * Created by reini on 1/30/2017.
 */

require('shelljs/global')

var path = require('path')
var ora = require('ora')

console.log(
  "Packaging for npm"
)

var spinner = ora('packacing to npm...')
spinner.start()

var destination = path.resolve(__dirname, '../packaged')

cp('-R', 'src/assets/*', destination)

spinner.stop()
