const Patcher = require('./services/Patcher')
const Updater = require('./services/Updater')

const main = async () => {
    const remoteUpdater = await Patcher.getRemoteUpdater()
    const deprecatedFiles = await Patcher.getDeprecatedFiles(remoteUpdater)
    const localUpdater = await Updater.getUpdater()
    
    Patcher.updateGame(deprecatedFiles, localUpdater)
}

main()