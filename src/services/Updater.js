const { writeFile, readFile } = require('fs').promises

class Updater {
    getUpdater = async () => {
        let file
        try {
            file = await readFile('./updater.json')
        } catch (error) {
            console.log({ error })
            await writeFile('./updater.json', JSON.stringify([]))
            file = await readFile('./updater.json')
        }

        return JSON.parse(file.toString())
    }

    writeUpdater = async data => {
        await writeFile('./updater.json', JSON.stringify(data))
        return true
    }

    registerFile = async file => {
        const data = await this.getUpdater()

        return await this.writeUpdater([...data, file])
    }

    updateFile = async (fileName, modifier) => {
        const data = await this.getUpdater()
        const index = data.findIndex(item => item.name === fileName)

        if (index === -1) {
          throw Error('Arquivo não encontrado!')
        }
    
        const current = data[index]
        data.splice(index, 1)

        const updatedObject = JSON.parse(JSON.stringify(modifier))
        const updatedData = Object.assign({}, current, updatedObject)
    
        return await this.writeUpdater([...data, updatedData])
    }
}

module.exports = new Updater()