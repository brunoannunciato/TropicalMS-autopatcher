const { writeFile, readFile } = require('fs').promises

class Updater {
    getUpdater = async () => {
        const file = await readFile('./updater.json')

        return JSON.parse(file.toString())
    }
}

module.exports = new Updater()