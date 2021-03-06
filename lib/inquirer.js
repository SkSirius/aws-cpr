const inquirer = require('inquirer')
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
const git = require('../src/git')
const fuzzy = require('fuzzy')
const codeCommit = require('./code-commit')

module.exports = {
    askAWSCreds: async () => {
        const questions = [
            {
                name: 'awsAccessKeyId',
                type: 'input',
                message: 'Enter your AWS access key id:',
                validate: (value) => {
                    if (value.length) return true
                    else
                        return 'Please enter your AWS access key id.'
                }
            },
            {
                name: 'awsSecretAccessKey',
                type: 'input',
                message: 'Enter your AWS secret access key:',
                validate: (value) => {
                    if (value.length) return true
                    else
                        return 'Please enter your AWS secret access key.'
                }
            },
            {
                name: 'awsRegion',
                type: 'input',
                message: 'Enter AWS region you are working in:',
                default: 'us-east-1',
            },
            {
                name: 'baseWorkdir',
                type: 'input',
                message: 'Enter absolute path to root folder with repositories:',
                default: process.cwd(),
            }
        ]

        return inquirer.prompt(questions)
    },

    askRepositoryPath: async () => {
        const questions = [
            {
                name: 'repository',
                type: 'input',
                message: 'Please specify AWS repository name (leave empty to finish this step):',
            }
        ]

        return inquirer.prompt(questions)
    },

    askForBuild: async (repo) => {
        const questions = [
            { 
                name: 'skipConfirmed',
                type: 'confirm',
                message: `Do you want to skip ${repo} build (defaults to No)?`,
                default: false
            }
        ]

        return inquirer.prompt(questions)
    },

    askForPRs: async (repoList) => {
        const questions = [
            {
                name: 'prRepos',
                type: 'checkbox',
                message: 'Select repositories you want to create PRs for:',
                choices: repoList || [],
                default: []
            }
        ];
        return inquirer.prompt(questions);
    },

    askForBranches: async (repository) => {
        const currBranch = git.getCurrentBranch(repository)
        const prTitle = git.getCommitMessage(repository)
        const remotes = await codeCommit.getRemoteBranches(repository)
        const defaultIsRemote = remotes.branches.includes(currBranch)
        const defaultValue = defaultIsRemote ? currBranch : ''

        const repoData = await codeCommit.getRepository(repository)
        const defaultRepoBranch = repoData.repositoryMetadata.defaultBranch

        const questions = [
            {
                type: 'autocomplete',
                name: 'source',
                message: 'Specify remote branch you would like to merge: ',
                source: (_answersSoFar, input) => {
                    const fuzzyResult = fuzzy.filter(input || defaultValue, remotes.branches)
                    return fuzzyResult.map(el => el.original)
                },
                default: defaultValue || null
            },
            {
                type: 'autocomplete',
                name: 'destination',
                message: 'Specify remote branch you would like to merge into: ',
                source: (_answersSoFar, input) => {
                    const fuzzyResult = fuzzy.filter(input || '', remotes.branches)
                    return fuzzyResult.map(el => el.original)
                },
                default: defaultRepoBranch || null
            },
            {
                type: 'input',
                name: 'prTitle',
                message: 'Please specify PR title:',
                default: prTitle,
                validate: (value) => {
                    if (value.length) return true
                    else
                        return 'Please enter PR title.'
                }
            }
        ]

        return inquirer.prompt(questions)
    }
}