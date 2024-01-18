function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (event) {
            const fileData = event.target.result.split(',')[1]; // Extract base64 data part
            const filename = file.name;

            ipcRenderer.send('upload-file', { filename, data: fileData });
        };

        reader.readAsDataURL(file);
    } else {
        alert('Please select a file.');
    }
}


function loadImage(e) {
    const file = e.target.files[0];
    if (!isFileImage(file)) {
        console.log("Please select an image");
        return;
    }
    console.log("success")
}

// Make sure file is image
function isFileImage(file) {
    const accepetedImageTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];
    return file && accepetedImageTypes.includes(file['type']);
}

// fileInput.addEventListener("change", loadImage);