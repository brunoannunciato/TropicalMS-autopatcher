const Download = require('./services/Download')
const Patcher = require('./services/Patcher')
const Updater = require('./services/Updater')

const baseURL = "http://145.14.134.159/files/";
const finalPath = './';

document.querySelector('#button').addEventListener('click', async () => {
    // const data = await Patcher.getDeprecatedFiles(localUpdater)
       
    // for (let file of data) {
    //     Download.downloadFile({
    //         remoteFile: `${baseURL}${file.file}`,
    //         localFile: `${finalPath}${file.file}`
    //     }).then(function(){
    //         alert("File succesfully downloaded");
    //     });
    // }

    const file = await Updater.updateFile('map', {version: 3})

    console.log(file)

})
