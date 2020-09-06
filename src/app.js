const Patcher = require('./services/Patcher')
const Updater = require('./services/Updater')

const main = async () => {
    let localUpdater = await Updater.getUpdater()
    let remoteUpdater = await Patcher.getRemoteUpdater()
    let deprecatedFiles = await Patcher.getDeprecatedFiles(remoteUpdater)

    if (deprecatedFiles.length === 0 && localUpdater.length === 0) {
        localUpdater = await Updater.getUpdater()
        remoteUpdater = await Patcher.getRemoteUpdater()
        deprecatedFiles = await Patcher.getDeprecatedFiles(remoteUpdater)
    }

    Patcher.updateGame(deprecatedFiles, localUpdater)
}

main()