#!/usr/bin/env node

const inquirer = require('./lib/inquirer')
const config = require('./lib/config')
const screen = require('./lib/screen')
const setup = require('./src/setup')
const processor = require('./src/processor')
const chalk = require('chalk')

screen.init()
const run = async () => {
    await setup.start(process.argv.slice(2))

    const repos = config.getRepos()
    const selected = await inquirer.askForPRs(repos)
    const prRepositories = selected.prRepos

    try {
        await processor.buildRepositories(prRepositories)
        const prUrls = await processor.createPRs(prRepositories)
        processor.createMessage(prUrls)
        
    } catch (err) {
        console.log(err)
        handleError(err)
    }
}

const handleError = (err) => {
    console.error(err.stdout)
    console.error(err.stderr)
    if (err.currRepo) console.error(chalk.redBright(`${err.currRepo.repository} build failed.`))
    process.exit(1)
}

run()
