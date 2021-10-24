const Updater = require('./Updater')
const View = require('./View')
const request = require('request')
const fs = require('fs')

const baseURL = 'http://arquivos.tropicalms.com.br/files/game/'

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
        const response = await fetch(`http://arquivos.tropicalms.com.br/files/updater.json?v=${ hash.getMilliseconds() }`)
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
        console.log(1)
        View.setStatus(`Baixando ${deprecatedFile.file}`)
        console.log(2)
        return new Promise(function(resolve, reject){
            var received_bytes = 0;
            var total_bytes = 0;
            console.log(3)
            
            const req = request({
                method: 'GET',
                uri: `${baseURL}${deprecatedFile.file}`
            })
            console.log(4)
            
            const out = fs.createWriteStream(`${finalPath}${deprecatedFile.file}`)
            req.pipe(out)
            console.log(5)
            
            req.on('response', function ( data ) {
                // Change the total bytes value to get progress later.
                console.log(6)
                total_bytes = parseInt(data.headers['content-length' ])
            })
            console.log(7)
            
            req.on('data', function(chunk) {
                // Update the received bytes
                received_bytes += chunk.length
                console.log(8)
                
                View.createDownloadItem(deprecatedFile.file, deprecatedFile.name, received_bytes, total_bytes)
            })
            console.log(9)
            
            req.on('end', function() {
                console.log(10)
                resolve()
            })
            console.log(11)
        })
    }

    updateGame = (deprecatedFiles, localUpdater) => {
        let finishedDownloads = 0

        if (deprecatedFiles.length === 0) {
            View.allowPlayGame()

            return
        }

        View.activeSection('download')

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