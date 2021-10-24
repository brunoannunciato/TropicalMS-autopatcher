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

    getLoalFiles = () => {
        let list = []

        fs.readdir('./game', (err, files) => {
            if (err) {
            
            } 

            files.forEach(function (file) {
                list.push(file)
            })
        })

        return list
    }

    getDeprecatedFiles = async (remoteUpdater) => {
        const localFiles = this.getLoalFiles()
        const localUpdater = await Updater.getUpdater()

        this.addNotExistentFilesOnLocalUpdater(localUpdater, remoteUpdater)

        const deprecated = localUpdater.filter(file => {
            return file.version < remoteUpdater[file.name].version || localFiles.indexOf(file.file) === -1
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
        
        return new Promise(function(resolve, reject){
            var received_bytes = 0;
            var total_bytes = 0;
            
            const req = request({
                method: 'GET',
                uri: `${baseURL}${deprecatedFile.file}`
            })
            
            const out = fs.createWriteStream(`${finalPath}${deprecatedFile.file}`)
            req.pipe(out)
            
            req.on('response', function ( data ) {
                // Change the total bytes value to get progress later.
                total_bytes = parseInt(data.headers['content-length' ])
            })
            
            req.on('data', function(chunk) {
                // Update the received bytes
                received_bytes += chunk.length
                
                View.createDownloadItem(deprecatedFile.file, deprecatedFile.name, received_bytes, total_bytes)
            })
            
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