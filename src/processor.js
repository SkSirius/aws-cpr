const chalk = require('chalk')
const CLI = require('clui')
const Spinner = CLI.Spinner
const open = require('open')
const inquirer = require('../lib/inquirer')
const clipboard = require('clipboardy')
const git = require('./git')
const codeCommit = require('../lib/code-commit')
const config = require('../lib/config')
const creds = config.getAwsCreds()

module.exports = {
    buildRepositories: async (prRepositories) => {
        if (prRepositories.length) console.log(chalk.greenBright('Selected project(s) should be built before proceeding...'))
        for (let i = 0; i < prRepositories.length; i++) {
            const currRepo = prRepositories[i]
            const { skipConfirmed } = await inquirer.askForBuild(currRepo.repository)
            if (skipConfirmed) {
                console.log(
                    chalk.yellowBright(`WARNING: You skipped build step for ${currRepo.repository}`)
                )
                continue;
            }
            spinner = new Spinner(`Building project ${currRepo.repository} before making pr...`)
            spinner.start()
            try {
                console.log(
                    chalk.green(`----------${currRepo.repository}-----------`)
                )
                const data = await new Promise((resolve, reject) => {
                    git.checkBuild(currRepo.repository, ((err, stdout, stderr) => {
                        if (err) { 
                            return reject({ stdout, stderr, currRepo })
                        }
                        resolve(stdout)
                    }))
                })

                spinner.stop()
                console.log(data)
            } catch (error) {
                spinner.stop()
                throw error;
            }
        }
    },

    createPRs: async (prRepositories) => {
        const cCommit = codeCommit()
        const urls = []
        for (let i = 0; i < prRepositories.length; i++) {
            console.log(chalk.greenBright(`${i + 1} / ${prRepositories.length}. Creating PR for ${prRepositories[i].repository}`))
            const data = await inquirer.askForBranches(prRepositories[i].repository)
            spinner = new Spinner('Making PR request, please wait...')
            spinner.start()
            try {
                const prData = await cCommit.createPr(data, prRepositories[i].repository)
                spinner.stop()

                const url = `https://console.aws.amazon.com/codesuite/codecommit/repositories/${prRepositories[i].repository}/pull-requests/${prData.pullRequest.pullRequestId}?region=${creds.awsRegion}`
            urls.push({url, repository: prRepositories[i].repository })
            open(url)
            } catch (error) {
                spinner.stop()
                throw error
            }
        }

        return urls
    },

    createMessage: (prUrls) => {
        let message = ''
        prUrls.forEach(pr => message += `${pr.repository} \n ${pr.url} \n\n`)
        clipboard.writeSync(message)
        if (message) console.log(chalk.cyanBright('Copied PR URLs to clipboard!'))
    }
}