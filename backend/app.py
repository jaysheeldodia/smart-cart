import os
from ultralytics import YOLO
from PIL import Image
from pyzbar.pyzbar import decode
from flask import Flask, render_template, request, jsonify
from PIL import Image

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'saved'
model = YOLO("best (2).pt")

def run_scanner(image):
    try:
        data = decode(image)[0][0].decode('utf-8')
        return data
    except:
        return None

def process_image(filename: str):
    filename = filename
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
    
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if '.' not in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'})

    filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    
    file.save(filename)
    processed_image = process_image(filename)
    
    return jsonify({'processed_image' : processed_image})

    # Save or display the processed image as needed
    # For simplicity, let's just save it to a BytesIO object

    # Convert the BytesIO object to base64 for sending in JSON
    # processed_image_base64 = base64.b64encode(output.getvalue()).decode('utf-8')


    # return jsonify({'processed_image': processed_image_base64})


if __name__ == '__main__':
    app.run(debug=True)
