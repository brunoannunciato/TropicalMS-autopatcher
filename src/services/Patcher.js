class Patcher {
    getRemoteUpdater = async () => {
        const response = await fetch('http://145.14.134.159/files/updater.json')
        const updater = await response.json()

        return updater
    }

    getDeprecatedFiles = async localUpdaterFiles => {
        
        const remoteUpdater = await this.getRemoteUpdater()

        const deprecated = localUpdaterFiles.filter(file => {
            return file.version < remoteUpdater[file.name].version
        })

        return deprecated
    }
}

module.exports = new Patcher()