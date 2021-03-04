const fs = require('fs')
const path = require('path')

module.exports = {
    getCurrDirBase: () => {
        return path.basename(process.cwd())
    },
    dirExists: (dirPath) => {
        return fs.existsSync(dirPath)
    }
}