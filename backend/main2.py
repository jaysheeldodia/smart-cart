from ultralytics import YOLO
from PIL import Image
from pyzbar.pyzbar import decode
from pathlib import Path


model = YOLO("best (2).pt")
# model = model.load('./best.pt')

# filename = "./Barcode_Dataset_750_Images/test/images/2007002006212-01_N95-2592x1944_scaledTo640x480bilinear_jpg.rf.30a83f1febc7004ffc7906c5a7e2409e.jpg"
filename = "./bug.jpg"

result = model.predict(filename)[0]

names = model.names

x = ""

for r in result:
    for c in r.boxes.cls:
        x = names[int(c)]
        

# Define your custom function
def run_scanner(image):
    try:
        # Your custom logic here
        # For demonstration purposes, let's just convert the image to grayscale
        data = decode(image)[0][0].decode('utf-8')
        return data
    except:
        return None


if x:
    processed_data = run_scanner(Image.open(filename))
    print(processed_data)
else:
    print("No image")
