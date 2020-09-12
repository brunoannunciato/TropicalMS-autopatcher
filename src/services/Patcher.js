const Updater = require('./Updater')
const View = require('./View')
const request = require('request')
const fs = require('fs')

const baseURL = 'http://145.14.134.159/files/game/'

const finalPath = './game/'

class Patcher {
    constructor() {
        if (!fs.existsSync('./game')) {
            fs.mkdir('./game', { recursive: false }, (err) => {
                if (err) throw err;
              });
        }
    }

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

        Updater.writeUpdater([...localUpdaterFiles, ...notExistentFiles])


        return notExistentFiles
    }

    getDeprecatedFiles = async (remoteUpdater) => {
        const localUpdater = await Updater.getUpdater()

        this.addNotExistentFilesOnLocalUpdater(localUpdater, remoteUpdater)

        const deprecated = localUpdater.filter(file => {
            console.log(file.name.toLowerCase())
            return file.version < remoteUpdater[file.name].version
        })

        const filesToUpdate = deprecated.map(file => {
            return {
                ...file,
                remoteVersion: remoteUpdater[file.name].version
            }
        })

        if (deprecated.length > 0) {
            View.setStatus('Atualizando arquivos...')

            return filesToUpdate
        }

        return []
    }

    downloadFile = deprecatedFile => {
        View.setStatus(`Baixando ${deprecatedFile.file}`)
        console.log('url', `${baseURL}${deprecatedFile.file}`)

        return new Promise(function(resolve, reject){
    
            const req = request({
                method: 'GET',
                uri: `${baseURL}${deprecatedFile.file}`
            })
    
            const out = fs.createWriteStream(`${finalPath}${deprecatedFile.file}`)
            req.pipe(out)
    
            req.on('end', function() {
                resolve()
            })
        })
    }

    updateGame = (deprecatedFiles, localUpdater) => {
        let finishedDownloads = 0

        if (deprecatedFiles.length === 0) {
            View.allowPlayGame()

            return
        }

        for (let file of deprecatedFiles) {
            this.downloadFile(file).then(async () =>{
                const index = localUpdater.findIndex(item => item.name === file.name)
                finishedDownloads++

                localUpdater[index].version = file.remoteVersion

                if (finishedDownloads === deprecatedFiles.length) {
                    Updater.writeUpdater(localUpdater)

                    View.allowPlayGame()
                }

            })
        }
    }
}

module.exports = new Patcher()