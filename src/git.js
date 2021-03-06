const { exec } = require('child_process')
const conf = require('../lib/config')
const fs = require('fs')

const getRepoPath = (repoName) => {
    const workdir = conf.getBaseWorkdir()
    return `${workdir}/${repoName}`
}

const getProjectBuildOption = (repoPath) => {
    const repoDir = getRepoPath(repoPath)

    const packageJson = require(`${repoDir}/package.json`)
    return packageJson.scripts['build'] ? 'npm' : 'lerna'
};

module.exports = {
    checkBuild: (repoPath, cb) => {
        const repoDir = getRepoPath(repoPath)
        
        if (getProjectBuildOption(repoPath) === 'lerna') {
            process.chdir(repoDir)
            buildCmd = 'npm run lerna:clean; npm run lerna:bootstrap; npm run lerna:build;'
            exec(buildCmd, { encoding: 'utf-8'}, (err, stdout, stderr) => {
                process.chdir(conf.getBaseWorkdir())
                cb(err, stdout, stderr)
            })
        } else {
            process.chdir(repoDir)
            const buildCmd = 'npm run build'
            exec('rm -rf dist', {}, () => {
                exec(buildCmd, { encoding: 'utf-8' }, (err, stdout, stderr) => {
                    process.chdir(conf.getBaseWorkdir()) 
                    cb(err, stdout, stderr)
                })
            })
        }
    },

    getCurrentBranch: (repoPath) => {
        const repoDir = getRepoPath(repoPath)
        const content = fs.readFileSync(`${repoDir}/.git/HEAD`)
        const path = content.toString().split(': ')[1]
        const parts = path.split('/')

        return parts[parts.length - 1].trim()
    },

    getCommitMessage: (repoPath) => {
        const repoDir = getRepoPath(repoPath)
        const content = fs.readFileSync(`${repoDir}/.git/COMMIT_EDITMSG`)

        return content.toString().trim()
    }
}