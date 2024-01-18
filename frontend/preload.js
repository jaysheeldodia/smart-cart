const { contextBridge } = require('electron')
const { ipcRenderer} = require("electron")

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer)