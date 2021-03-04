const inquirer = require('inquirer')

module.exports = {
    askAWSCreds: () => {
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
                default: 'us-east-1'
            }
        ]

        return inquirer.prompt(questions)
    },

    askRepositoryPath: () => {
        const questions = [
            {
                name: 'repository',
                type: 'input',
                message: 'Please specify AWS repository name (leave empty to finish this step):',
            }
        ]

        return inquirer.prompt(questions)
    },

    askForPRs: (repoList) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'prRepos',
                message: 'Select repositories you want to create PRs for:',
                choices: repoList,
                default: []
            }
        ];
        return inquirer.prompt(questions);
    },

    askForBranches: () => {
        const questions = [
            {
                type: 'input',
                name: 'source',
                message: 'Specify branch you would like to merge: ',
                validate: (value) => {
                    if (value.length) return true
                    else
                        return 'Please enter source branch name.'
                }
            },
            {
                type: 'input',
                name: 'destination',
                message: 'Specify branch you would like to merge into origin: ',
                default: 'master'
            },
            {
                type: 'input',
                name: 'prTitle',
                message: 'Please specify PR title:',
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