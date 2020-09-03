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

// document.querySelector('#button').addEventListener('click', async () => {

//     const file = await Updater.updateFile('map', {version: 3})

//     console.log(file)

// })
