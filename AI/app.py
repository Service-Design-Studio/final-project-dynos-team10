import os
# !pip install flask
from flask import Flask
from flask import request
import tensorflow.keras
from PIL import Image, ImageOps
import numpy as np
import requests
import tensorflow as tf

# Import Flask API
from flask import Flask, request
from flask_cors import CORS
from numpy import apply_along_axis
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)


# Disable scientific notation for clarity
# np.set_printoptions(suppress=True)

# Load the model
model = tensorflow.keras.models.load_model('keras_model.h5')

@app.route("/")
def hello_world():
    return ("Hello World!")



# Create the array of the right shape to feed into the keras model
# The 'length' or number of images you can put into the array is
# determined by the first position in the shape tuple, in this case 1.
# data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
@app.route("/prediction", methods=['POST'])
def prediction():
    base64_string = request.get_json()["image"].encode("utf-8")
    tapered_base64_string = ""
    if base64_string.startswith(b"data:image/jpeg;base64,"):
      tapered_base64_string = base64_string.replace(b"data:image/jpeg;base64,", b"")
    elif base64_string.startswith(b"data:image/png;base64,"):
      tapered_base64_string = base64_string.replace(b"data:image/png;base64,", b"")

    # image = './incorrect 5 (crumpled).jpeg'
    # image = Image.open(image)
    # convert to RGB because png images have an extra alpha channel (RGBA, 4 columns) and we disregard tha
    image = Image.open(BytesIO(base64.b64decode(tapered_base64_string))).convert('RGB')
    image = image.resize((224,224))
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    image_array = np.asarray(image)
    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    # Load the image into the array
    data[0] = normalized_image_array

    # run the inference
    prediction = model.predict(data)
    return prediction.tolist(), 200
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))