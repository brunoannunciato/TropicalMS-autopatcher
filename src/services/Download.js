const request = require('request');
const fs = require('fs');

class Download {
    downloadFile(configuration){
        return new Promise(function(resolve, reject){
    
            var req = request({
                method: 'GET',
                uri: configuration.remoteFile
            });
    
            var out = fs.createWriteStream(configuration.localFile);
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