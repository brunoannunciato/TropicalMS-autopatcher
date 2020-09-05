const Updater = require('./Updater')

class Patcher {
    status = document.querySelector('.status')
    button = document.querySelector('#play')
    spinner = document.querySelector('.spinner')

    getRemoteUpdater = async () => {
        const hash = new Date()
        const response = await fetch(`http://145.14.134.159/files/updater.json?v=${ hash.getMilliseconds() }`)
        const updater = await response.json()

        return updater
    }

    checkIfFileExistsLocalUpdater = (array, fileName) => {
        return array.some(item => {
            return item.name === fileName
        })
    }

    addNotExistentFilesOnLocalUpdater = async (localUpdaterFiles, remoteUpdater) => {
        let notExistentFiles = []

        for (let index in remoteUpdater) {
            const file =  remoteUpdater[index]
            if (!this.checkIfFileExistsLocalUpdater(localUpdaterFiles, file.name)) {
                notExistentFiles.push({ name: file.name, file: file.file, version: 0 })
            }
        }

        console.log({notExistentFiles})

        Updater.writeUpdater([...localUpdaterFiles, ...notExistentFiles])


        return notExistentFiles
    }

    getDeprecatedFiles = async (remoteUpdater) => {
        const localUpdater = await Updater.getUpdater()

        this.addNotExistentFilesOnLocalUpdater(localUpdater, remoteUpdater)

        const deprecated = localUpdater.filter(file => {
            return file.version < remoteUpdater[file.name.toLowerCase()].version
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
        this.spinner.classList.add('hide')
    }
}

module.exports = new Patcher()