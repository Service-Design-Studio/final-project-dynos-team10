'''
For the ML component of our service, we are using Teachable Machine (first_check) and Cloud Vision API (second_check) to perform the image classification. The task involves 2 main stages:
1. checking for the presense/absense of the label on the machine 
2. checking whether the label passes or fails validation

The main categories for failing includes: 
1. Crumpled -- label is visibly crumpled 
2. Handwritten -- there are handwritten markings on the label
3. Missing fields -- some parts of the label is not filled out 
4. Torn -- label is visibly torn or folded 
5. Wrong position -- label could be placed upside down or at an angle

We have hence created a Flask microservice that will be called upon whenever the QC staff submits their photo on our mobile application. 
'''

import os
import numpy as np
from PIL import Image, ImageOps

from flask import Flask, redirect, request, url_for
from flask_cors import CORS
import tensorflow
from tensorflow.keras.models import load_model

# from google.cloud import datastore
# from google.cloud import storage
# from google.cloud import vision
from google.cloud import automl

from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)
first_check_model = tensorflow.keras.models.load_model('presence.h5')

# Disable scientific notation for clarity
# np.set_printoptions(suppress=True)

# Load the model
# model = tensorflow.keras.models.load_model('keras_model.h5')

@app.route("/")
def hello_world():
    return ("Hello World!")

def get_tapered_base64_string(base64_string):
    if base64_string.startswith(b"data:image/jpeg;base64,"):
      new = base64_string.replace(b"data:image/jpeg;base64,", b"")
      # print(type(new).__name__)
      return new
    elif base64_string.startswith(b"data:image/png;base64,"):
      new1 = base64_string.replace(b"data:image/png;base64,", b"")
      # print(type(new1).__name__)
      return new1
    print(type(b"").__name__)
    return b""

  
@app.route("/first_check", methods=['POST'])
def prediction():
    # print("first check begins")
    base64_string = request.get_json()["image"].encode("utf-8")
    # print(type(base64_string).__name__)
    # print("==================================")
    
    tapered_base64_string = get_tapered_base64_string(base64_string)
    # print(type(tapered_base64_string).__name__)
    # print("==================================")
    
    image = Image.open(BytesIO(base64.b64decode(tapered_base64_string))).convert('RGB')
    # print("image part 1 type: " + type(image).__name__)
    image = image.resize((224,224))
    # print("image part 2 type: " + type(image).__name__)
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    # print("==================================")
    
    size = (224,224)
    image = ImageOps.fit(image, size, Image.ANTIALIAS)

    image_array = np.asarray(image)
    # print(type(image_array).__name__)
    # print("==================================")
    
    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    # print(normalized_image_array)
    # print("==================================")
    
    # Load the image into the array
    data[0] = normalized_image_array
    # print(data[0])
  
    # run the inference
    prediction = first_check_model.predict(data)
    # print(prediction)
    if prediction[0][0] > 0.5:
      print("Label presence verified, please wait while we check the image for more details.")
      print("================================================")
      return redirect(url_for('second_check'), code=307)
    else:
      print("Non-conformance: Label not present")
      return redirect('/')

    # image = './incorrect 5 (crumpled).jpeg'
    # image = Image.open(image)
    # convert to RGB because png images have an extra alpha channel (RGBA, 4 columns) and we disregard tha
    # image = Image.open(BytesIO(base64.b64decode(tapered_base64_string))).convert('RGB')
    # image = image.resize((224,224))
    # data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    # image_array = np.asarray(image)
    # # Normalize the image
    # normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    # # Load the image into the array
    # data[0] = normalized_image_array

    # # run the inference
    # prediction = model.predict(data)
    # return '{}'.format(prediction), 200

@app.route("/second_check", methods=["POST"])
def second_check():
  # print("passed to second_check")
  base64_string = request.get_json()["image"].encode("utf-8")
  tapered_base64_string = get_tapered_base64_string(base64_string)
  # print(base64_string)
  # print(type(base64_string).__name__) # bytes
  # print("==================================")
  tapered_base64_string = get_tapered_base64_string(base64_string)
  # print(type(tapered_base64_string).__name__) # bytes
  # print("==================================")
  
  with open("test.png", "wb") as fp:
    fp.write(base64.decodebytes(tapered_base64_string))
  with open("test.png", "rb") as content_file:
    content = content_file.read()
  
  project_id = "tsh-labels"
  model_id = "ICN954729036142084096"
  
  prediction_client = automl.PredictionServiceClient()
  model_full_id = automl.AutoMlClient.model_path(project_id, "us-central1", model_id)
  
  image = automl.Image(image_bytes=content)
  # print(type(image).__name__)
  # print("==================================")
  
  payloads = automl.ExamplePayload(image=image)
  # print(payload)
  # print(type(payloads).__name__)
  # print("==================================")
  
  paramss = {"score_threshold": "0.8"}
  # print(paramss) # <class 'dict'>
  # print(type(paramss).__name__) # dict
  # print("================================================")
  
  request_automl = automl.PredictRequest(name=model_full_id, payload=payloads, params=paramss)
  # print(request) # <class 'bytes'>
  # print(type(request_thisbetterwork).__name__) # PredictRequest
  # print("================================================")
  
  response_automl = prediction_client.predict(request=request_automl)
  # print(response_automl) # <class 'bytes'>
  # print(type(response_automl).__name__) # PredictResponse
  # print("================================================")
  
  print("Prediction results:")
  for result in response_automl.payload:
    print("Predicted reason: {}".format(result.display_name))
    print("Predicted accuracy: {}".format(result.classification.score))

  print("Finished second check!")
  
  return '{}'.format(result.display_name), 200
  # return f'From second check: {tapered_base64_string}', 200
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))