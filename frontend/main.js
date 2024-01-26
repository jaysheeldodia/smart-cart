const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        setMenuBarVisibility: null,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.setMenuBarVisibility(null);


    win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.on("fileUploaded", async(event, data) => {
    console.log(data)
})

ipcMain.on("fileUploadError", async(event, message) => {
    console.log(message)
})

ipcMain.on('upload-file', async (event, { filename, data }) => {
    try {
        // Decode base64 data and write it to a file
        const decodedData = Buffer.from(data, 'base64');
        const filePath = path.join(app.getPath('temp'), filename);

        fs.writeFileSync(filePath, decodedData);
       
    } catch (error) {
        console.error(error.message);
    }
});

