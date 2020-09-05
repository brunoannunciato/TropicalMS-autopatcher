const Download = require('./services/Download')
const Patcher = require('./services/Patcher')
const Updater = require('./services/Updater')
const { updateFile } = require('./services/Updater')

const main = async () => {
    const remoteUpdater = await Patcher.getRemoteUpdater()
    const deprecatedFiles = await Patcher.getDeprecatedFiles(remoteUpdater)
    const localUpdater = await Updater.getUpdater()
    let finishedDownloads = 0

    console.log({ localUpdater })

    if (deprecatedFiles.length === 0) {
        Patcher.allowPlayGame()

        return
    }

    for (let file of deprecatedFiles) {
        Download.downloadFile(file).then(async function(){
            const index = localUpdater.findIndex(item => item.name === file.name)
            finishedDownloads++
            //console.log(`Baixou: ${downloads} de ${deprecatedFiles.length}`)

            console.log({file, localUpdater})

            localUpdater[index].version = file.remoteVersion

            if (finishedDownloads === deprecatedFiles.length) {
                Updater.writeUpdater(localUpdater)

                Patcher.allowPlayGame()
            }

        });
    }
}

main()