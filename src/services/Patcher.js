const Updater = require('./Updater')

class Patcher {
    status = document.querySelector('.status')
    button = document.querySelector('#play')

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

        notExistentFiles.forEach(file => {
            Updater.registerFile(file)
        })


        return await notExistentFiles
    }

    getDeprecatedFiles = async (remoteUpdater) => {
        const localUpdater = await Updater.getUpdater()

        await this.addNotExistentFilesOnLocalUpdater(localUpdater, remoteUpdater)

        const deprecated = localUpdater.filter(file => {
            console.log({
                file: file,
                fileVersion: file.version,
                remove: remoteUpdater[file.name.toLowerCase()],
                removeVersion: remoteUpdater[file.name.toLowerCase()].version
            })
            return file.version < remoteUpdater[file.name.toLowerCase()].version
        })

        console.log({deprecated})

        const filesToUpdate = deprecated.map(file => {
            return {
                ...file,
                remoteVersion: remoteUpdater[file.name].version
            }
        })

        console.log({filesToUpdate})

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