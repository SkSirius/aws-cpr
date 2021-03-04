#!/usr/bin/env node

const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('./lib/inquirer')
const config = require('./lib/config')
const awsSdk = require('aws-sdk')
const open = require('open')
const CLI = require('clui')
const Spinner = CLI.Spinner


clear()
console.log(
    chalk.yellow(
        figlet.textSync('PR CREATOR', { horizontalLayout: 'fitted', width: 70, verticalLayout: 'full' })
    )
)

const run = async () => {
    if (!config.getAwsCreds()) {
        const awsCreds = await inquirer.askAWSCreds()
        config.setAwsCreds(awsCreds)
    }    

    const repositories = config.getRepos() || []
    let isNewSetup = !repositories.length
    while (isNewSetup) {
        const data = await inquirer.askRepositoryPath()
        if (data.repository) {
            console.log(chalk.greenBright(`Repository added: ${data.repository}`))
            repositories.push({name: data.repository, value: data})
        } else {
            isNewSetup = false    
        }
    }
    config.setRepos(repositories)

    const repos = config.getRepos()
    const selected = await inquirer.askForPRs(repos)
    const prRepos = selected.prRepos

    const creds = config.getAwsCreds()
    for (let i = 0; i < prRepos.length; i++) {
        console.log(chalk.greenBright(`${i + 1} / ${prRepos.length}. Creating PR for ${prRepos[i].repository}`))
        const data = await inquirer.askForBranches()
        const codeCommit = new awsSdk.CodeCommit({
            accessKeyId: creds.awsAccessKeyId,
            secretAccessKey: creds.awsSecretAccessKey,
            region: creds.awsRegion
        })

        const status = new Spinner('Making PR request, please wait...')
        status.start()
        const prData = await new Promise((resolve, reject) => {
            codeCommit.createPullRequest({
                title: data.prTitle,
                targets: [{
                    destinationReference: data.destination,
                    sourceReference: data.source,
                    repositoryName: prRepos[i].repository
                }]
            }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
        status.stop()

        const url = `https://console.aws.amazon.com/codesuite/codecommit/repositories/${prRepos[i].repository}/pull-requests/${prData.pullRequest.pullRequestId}?region=${creds.awsRegion}`
        open(url)
    }
}

run()
