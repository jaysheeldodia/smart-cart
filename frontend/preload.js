const { contextBridge } = require('electron')
const { ipcRenderer} = require("electron")
const axios = require('axios')
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)
contextBridge.exposeInMainWorld('axios', axios)

// Expose Axios to the window object so that it can be accessed in the renderer process