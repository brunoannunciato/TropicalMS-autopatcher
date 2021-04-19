const Patcher = require('./Patcher')
const child = require('child_process').execFile

const setupPath ='./game/TropicalMs.exe';

class View {
    status = document.querySelector('.status')
    downloadStatus = document.querySelector('.download-status')
    button = document.querySelector('#play')
    spinner = document.querySelector('.spinner')
    sections = document.querySelectorAll('.section')
    downloadList = document.querySelector('.download-list')

    allowPlayGame = () => {
        this.status.innerHTML = 'Pronto para jogar!'
        this.button.classList.add('is-actived')
        this.hideSpinner()

        this.activeSection('loader')

        this.button.addEventListener('click', this.startGame)
    }

    setStatus = status => {
        this.status.innerHTML = status
    }

    activeSection = section => {
        for (let item of this.sections) {
            item.classList.remove('actived')
        }

        document.querySelector(`.${ section }`).classList.add('actived')
    }

    createDownloadItem = (file, fileName, currentStatus, maxStatus) => {
        const percentage = (currentStatus / maxStatus) * 100
        const listItem = document.querySelector(`.download-list__item.${fileName}`)
        const downloadWrapper = document.querySelector(`.download-list__item.${fileName} .download-list__item-status`)

        if (parseInt(percentage) === 100) {
            listItem.classList.add('removed')
        }

        if (!document.querySelector(`.download-list__item.${fileName}`)) {
            const template = `
            <li class="download-list__item ${fileName}">
                <span class="download-list__item-name">${file}</span>
                <span class="download-list__item-status">${percentage.toFixed(2)}%</span>
            </li>
            `

            this.downloadList.insertAdjacentHTML('beforeend', template)

            return
        }

        downloadWrapper.innerHTML = `${percentage.toFixed(2)}%`

    }

    hideSpinner = () => {
        this.spinner.classList.add('hide')
    }

    startGame = () => {
        child(setupPath, function(err, data) {
            if(err){
            console.error(err)
            return
            }
        })
    }
}

module.exports = new View()