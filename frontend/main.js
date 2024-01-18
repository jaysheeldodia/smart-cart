const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

process.on('uncaughtException', function (err) {
    console.log(err);
});


function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });


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

        // Call the FastAPI server
        // const response = await axios.post('http://localhost:8000/uploadfile/', { filename, filePath });
        console.log("reached here")
        // axios({
        //     method: "get",
        //     url: "http://127.0.0.1:8000/",
            
        // }).then(function (response) {
        //     console.log(response.data);
        // });

        axios({
            method: 'post',
            url: 'http://localhost:8000/uploadfile/',
            data: {
                filename: filename,
                filePath: filePath
            }
        }).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error.message);
        });


        console.log("reach here")
       
    } catch (error) {
        console.error(error.message);
    }
});

