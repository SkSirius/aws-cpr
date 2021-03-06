const config = require('../lib/config')
const inquirer = require('../lib/inquirer')
const chalk = require('chalk')

module.exports = {
    start: async (optionalCommands) => {
        if (optionalCommands.includes('--reset'))
            config.setAwsCreds(null)
        
        if (config.getAwsCreds()) return
        
        const awsCreds = await inquirer.askAWSCreds()
        config.setAwsCreds({ 
            awsAccessKeyId: awsCreds.awsAccessKeyId,
            awsSecretAccessKey: awsCreds.awsSecretAccessKey,
            awsRegion: awsCreds.awsRegion
        })
        config.setBaseWorkdir(awsCreds.baseWorkdir)

        const repositories = config.getRepos() || []
        let isNewSetup = !repositories.length
        while (isNewSetup) {
            const data = await inquirer.askRepositoryPath()
            if (data.repository) {
                console.log(chalk.greenBright(`Repository added: ${data.repository}`))
                repositories.push({name: data.repository, value: data })
            } else {
                isNewSetup = false    
            }
        }
        config.setRepos(repositories)
    }
}