const awsSdk = require('aws-sdk')
const config = require('./config')

const creds = config.getAwsCreds()
const codeCommit = new awsSdk.CodeCommit({
    accessKeyId: creds.awsAccessKeyId,
    secretAccessKey: creds.awsSecretAccessKey,
    region: creds.awsRegion
})

module.exports = {
    createPr: async (data, repository) => {
        return new Promise((resolve, reject) => {
            codeCommit.createPullRequest({
                title: data.prTitle,
                targets: [{
                    destinationReference: data.destination,
                    sourceReference: data.source,
                    repositoryName: repository
                }]
            }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    },

    getRemoteBranches: async (repository) => {
        return new Promise((resolve, reject) => {
            codeCommit.listBranches({ repositoryName: repository}, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    },

    getRepository: async (repository) => {
        return new Promise((resolve, reject) => {
            codeCommit.getRepository({ repositoryName: repository }, (err, data) => {
                if (err) return reject(err)
                resolve(data)
            })
        })
    }
}