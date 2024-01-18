document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  var inputElement = document.getElementById("fileInput");
  var file = inputElement.files[0];

  if (!file) {
    alert("Please select an image");
    return;
  }

  var formData = new FormData();
  formData.append("file", file);


  fetch("http://127.0.0.1:5000/upload", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      displayResult(data);
    })
    .catch(err => console.error("Error:"));

});


function displayResult(data) {
  console.log(data)
  var resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";

  if (data.error) {
    resultContainer.innerHTML = "<p>Error: " + data.error + "</p>";
  } else {
    resultContainer.innerHTML = "<h2>Processed Image: " + data.processed_image + "</h2>";
  }
}