#!groovy

// https://github.com/feedhenry/fh-pipeline-library
@Library('fh-pipeline-library') _

stage('Trust') {
    enforceTrustedApproval()
}

import org.feedhenry.Utils

fhBuildNode(['label': 'nodejs-ubuntu']) {

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

    stage('Build Image') {
        final String version = getBaseVersionFromPackageJson()
        final String tag = "${version}-${env.BUILD_NUMBER}"
        final Map params = [
                fromDir: './docker',
                buildConfigName: 'fh-template-apps',
                imageRepoSecret: 'dockerhub',
                outputImage: "docker.io/rhmap/feedhenry-sdks:${tag}"
        ]
        sh 'cp dist/fh-template-apps-*.tar.gz docker/'
        buildWithDockerStrategy params
    }

}
