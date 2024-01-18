from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
from ultralytics import YOLO
from PIL import Image
from pyzbar.pyzbar import decode
from pathlib import Path

app = FastAPI()

# Enable CORS (Cross-Origin Resource Sharing) for all routes
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("best (2).pt")

def run_scanner(image):
    try:
        # Your custom logic here
        # For demonstration purposes, let's just convert the image to grayscale
        data = decode(image)[0][0].decode('utf-8')
        return data
    except:
        return None

def process_image(filename: str):
    # Add your image processing logic here
    # For demonstration purposes, let's just print the filename
    filename = "./Barcode_Dataset_750_Images/test/images/2007002006212-01_N95-2592x1944_scaledTo640x480bilinear_jpg.rf.30a83f1febc7004ffc7906c5a7e2409e.jpg"
    result = model.predict(filename)[0]
    names = model.names
    
    for r in result:
        for c in r.boxes.cls:
            x = names[int(c)]

    if x:
        processed_data = run_scanner(Image.open(filename))
        return processed_data
    else:
        return None

@app.get("/")
async def root():
    res = process_image('./')
    return ({'data':'hello'})

@app.post("/uploadfile/")
async def create_upload_file(filename: str, filePath: str):
    try:
        # Save the file to the specified filePath
        with open(filePath, "wb") as f:
            f.write(filename)

        # Call the process function with the filename
        process_image(filename)

        return JSONResponse(content={"message": "File uploaded successfully"}, status_code=200)

    except Exception as e:
        return JSONResponse(content={"message": str(e)}, status_code=500)
    finally:
        # Cleanup: remove the uploaded file
        os.remove(filePath)

if __name__ == "__main__":
    import uvicorn

    # Run the FastAPI application using uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
