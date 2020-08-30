class Patcher {
    status = document.querySelector('.status')
    button = document.querySelector('#play')

    getRemoteUpdater = async () => {
        const response = await fetch('http://145.14.134.159/files/updater.json')
        const updater = await response.json()

        return updater
    }

    getDeprecatedFiles = async (localUpdaterFiles, remoteUpdater) => {
        const deprecated = localUpdaterFiles.filter(file => {
            return file.version < remoteUpdater[file.name].version
        })

        const filesToUpdate = deprecated.map(file => {
            return {
                ...file,
                remoteVersion: remoteUpdater[file.name].version
            }
        })

        if (deprecated.length > 0) {
            this.status.innerHTML = 'Atualizando arquivos...'

            return filesToUpdate
        }

        return []
    }

    allowPlayGame = () => {
        this.status.innerHTML = 'Pronto para jogar!'
        this.button.classList.add('is-actived')
    }
}

module.exports = new Patcher()