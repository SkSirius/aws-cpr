const Configstore = require('configstore')
const pkg = require('../package.json')

const conf = new Configstore(pkg.name);

module.exports = {
    getAwsCreds: () => {
        return conf.get('aws.credentials')
    },
    setAwsCreds: (creds) => {
        conf.set('aws.credentials', creds)
    },
    getRepos: () => {
        return conf.get('dev.repositories')
    },
    setRepos: (repos) => {
        conf.set('dev.repositories', repos)
    },
    getBaseWorkdir: () => {
        return conf.get('dev.workdir')
    },
    setBaseWorkdir: (baseWorkdir) => {
        conf.set('dev.workdir', baseWorkdir)
    }
}