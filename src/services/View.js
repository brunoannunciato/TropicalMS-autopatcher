const Patcher = require('./Patcher')
const child = require('child_process').execFile

const setupPath ='./game/TropicalMs.exe';

class View {
    status = document.querySelector('.status')
    downloadStatus = document.querySelector('.download-status')
    button = document.querySelector('#play')
    spinner = document.querySelector('.spinner')

    allowPlayGame = () => {
        this.status.innerHTML = 'Pronto para jogar!'
        this.button.classList.add('is-actived')
        this.hideSpinner()

        this.button.addEventListener('click', this.startGame)
    }

    setStatus = status => {
        this.status.innerHTML = status
    }

    setDownloadStatus = status => {
        this.downloadStatus.innerHTML = status
    }

    hideSpinner = () => {
        this.spinner.classList.add('hide')
    }

    startGame = () => {
        child(setupPath, function(err, data) {
            console.log({setupPath})
            if(err){
            console.error(err)
            return
            }
            console.log('runData:', data.toString());
        })
    }
}

module.exports = new View()