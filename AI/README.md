# AI Inspection Service
This microservice is a Flask App that runs AI inspection on label images using a Keras model exported from Teachable Machine and Google Cloud Vision

## Running the application locally
You need to have python3 installed on your machine
1. Create a virtual environment and install packages
```bash
python3 -m venv env
source env/bin/activate
python3 -m pip install -r requirements.txt
python3 -m pip install opencv-python # this installs cv2 and numpy
```
2. Running the Flask app
```python
python3 app.py
```

The Flask app will be available at `http://localhost:8080`.