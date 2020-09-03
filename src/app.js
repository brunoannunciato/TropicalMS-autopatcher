const Download = require('./services/Download')
const Patcher = require('./services/Patcher')
const Updater = require('./services/Updater')

const main = async () => {
    const remoteUpdater = await Patcher.getRemoteUpdater()
    const deprecatedFiles = await Patcher.getDeprecatedFiles(remoteUpdater)

    for (let file of deprecatedFiles) {
        Download.downloadFile(file).then(async function(){
            Updater.updateFile(file.name, {version: file.remoteVersion})

            console.log('Download concluído!')
        });
    }
}

main()