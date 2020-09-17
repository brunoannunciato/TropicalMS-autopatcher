const electron = require('electron')
const nativeImage = require('electron').nativeImage;
const image = nativeImage.createFromPath(__dirname + './tropical-icon.png'); 

image.setTemplateImage(true);

const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Cria uma janela de navegação.
  const win = new BrowserWindow({
    width: 450,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: image,
    resizable: false,
    //autoHideMenuBar: true
  })

  //win.webContents.openDevTools()

  // e carrega o arquivo index.html do seu aplicativo.
  win.loadFile('src/index.html')
}

// Este método será chamado quando Electron terminar de inicializar
// e também estiver pronto para criar novas janelas do navegador.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Nesse arquivo, você pode incluir o resto do código principal
// de processos do seu aplicativo.
// Você também pode colocar eles em arquivos separados e requeridos-as aqui.