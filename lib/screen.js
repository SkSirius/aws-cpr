const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')

module.exports = {
    init: () => {
        clear()
        console.log(
            chalk.yellow(
                figlet.textSync('PR CREATOR', { horizontalLayout: 'fitted', width: 70, verticalLayout: 'full' })
            )
        )
    }
}