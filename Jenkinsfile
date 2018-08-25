#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

stage('Trust') {
    enforceTrustedApproval()
}

import org.feedhenry.Utils

fhBuildNode(['label': 'nodejs6-ubuntu']) {

    final String COMPONENT = 'fh-template-apps'
    final String VERSION = getBaseVersionFromPackageJson()
    final String BUILD = env.BUILD_NUMBER
    final String CHANGE_URL = env.CHANGE_URL

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
            name = COMPONENT
            distCmd = 'default'
        }
        s3PublishArtifacts([
            bucket: "fh-wendy-builds/${COMPONENT}/${BUILD}",
            directory: "./dist"
        ])
    }

    stage('Platform Update') {
        final Map updateParams = [
                componentName: COMPONENT,
                componentVersion: VERSION,
                componentBuild: BUILD,
                changeUrl: CHANGE_URL
        ]
        feedhenrySdksContainerComponentUpdate(updateParams)
    }

}
