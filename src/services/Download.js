const request = require('request')
const fs = require('fs')

const baseURL = "http://145.14.134.159/files/"
const finalPath = './'

class Download {
    downloadFile(deprecatedFile){
        console.log(deprecatedFile)
        document.querySelector('.status').innerHTML = `Baixando ${deprecatedFile.file}`
        return new Promise(function(resolve, reject){
    
            var req = request({
                method: 'GET',
                uri: `${baseURL}${deprecatedFile.file}`
            });
    
            var out = fs.createWriteStream(`${finalPath}${deprecatedFile.file}`);
            req.pipe(out);
    
            req.on('end', function() {
                resolve();
            });
        });
    }

    getFilenameFromUrl(url){
        return url.substring(url.lastIndexOf('/') + 1);
    }
}

module.exports = new Download()