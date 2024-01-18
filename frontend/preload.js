const { contextBridge } = require('electron')
const { ipcRenderer} = require("electron")
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)

// Expose Axios to the window object so that it can be accessed in the renderer process