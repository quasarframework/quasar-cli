// Basic init
const path = require('path')
const electron = require('electron')
const {app, BrowserWindow} = electron

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {
  let mainWindow = new BrowserWindow({width: 800, height: 600})
  let basePath = path.join(__dirname, '../')

  mainWindow.loadURL(`file://${basePath}/dist/index.html`)
})
