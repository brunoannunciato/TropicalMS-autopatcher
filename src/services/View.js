class View {
    status = document.querySelector('.status')
    button = document.querySelector('#play')
    spinner = document.querySelector('.spinner')

    allowPlayGame = () => {
        this.status.innerHTML = 'Pronto para jogar!'
        this.button.classList.add('is-actived')
        this.spinner.classList.add('hide')
    }

    setStatus = status => {
        this.status.innerHTML = status
    }
}

module.exports = new View()