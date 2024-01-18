document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/uploadfile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      ipcRenderer.send('fileUploaded', response.data);
    } catch (error) {
      ipcRenderer.send('fileUploadError', error.message);
    }
  });