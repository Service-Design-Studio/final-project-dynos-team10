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
from numpy import apply_along_axis

app = Flask(__name__)


# Disable scientific notation for clarity
# np.set_printoptions(suppress=True)

# Load the model
model = tensorflow.keras.models.load_model('keras_model.h5')

@app.route("/")
def hello_world():
    return ("Hello World!")

@app.route("/prediction", methods=['POST'])


# Create the array of the right shape to feed into the keras model
# The 'length' or number of images you can put into the array is
# determined by the first position in the shape tuple, in this case 1.
# data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

def prediction():
    image = './incorrect 5 (crumpled).jpeg'
    image = Image.open(image)
    image = image.resize((224,224))
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
 
    if True:
      image_array = np.asarray(image)
# Normalize the image
      normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
      # Load the image into the array
      data[0] = normalized_image_array

      # run the inference
      prediction = model.predict(data)
      return '{}'.format(prediction) , 200

    else:
      #If the apikey is not the same, then return a 400 status indicating an error.
      return "Not valid apikey", 500 

    # def read_tensor_from_image_url(url,
    #                             input_height=224,
    #                             input_width=224,
    #                             input_mean=0,
    #                             input_std=255):
        
    #     image_open = open(image, 'rb')
    #     image_read = image_open.read()
    #     image_reader = tf.image.decode_jpeg(
    #         image_read, channels=3, name="jpeg_reader")
    #     float_caster = tf.cast(image_reader, tf.float32)
    #     dims_expander = tf.expand_dims(float_caster, 0)
    #     resized = tf.image.resize(dims_expander,[input_height,input_width], method='bilinear',antialias=True, name = None)
    #     normalized = tf.divide(tf.subtract(resized, [input_mean]), [input_std])

    #     return normalized
    #Get all the values in your POST request. 
    # apikey = request.args.get('apikey')
    # image = request.args.get('url')
    # image = image.resize((224,224))

    #Check for API key access  --> Very makeshift manual solution. Totally not fit for production levels. 
    #Change this if you're using this method.
    # if apikey == 'AIzaSyCQsKa7J2bNPKKiiEHaAsrXTouyHI5zX5c':  
    # if True:
    #     #Follow all the neccessary steps to get the prediction of your image. 
    #     image = read_tensor_from_image_url(image)
    #     image_array = np.asarray(image)
    #     normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    #     data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    #     data[0] = normalized_image_array
    #     prediction = model.predict(data)
        
    #     #Retunr the prediction and a 200 status
    #     return '{}'.format(prediction) , 200

    # else:
    #     #If the apikey is not the same, then return a 400 status indicating an error.
    #     return "Not valid apikey", 500 
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))