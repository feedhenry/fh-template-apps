#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

import org.feedhenry.Utils

fhBuildNode(['label': 'nodejs']) {

    def utils = new Utils()

    stage('Install Dependencies') {
        npmInstall {}
    }

    stage('Test') {
        gruntCmd {
            cmd = 'format'
        }
        if (utils.gitRepoIsDirty()) {
            error "Please make sure you run 'grunt format' when committing changes to config files e.g. global.json"
        }
    }

    stage('Build') {
        gruntBuild {
            name = 'fh-template-apps'
            distCmd = 'default'
        }
    }
}
