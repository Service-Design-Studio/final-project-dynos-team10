# syntax=docker/dockerfile:1

# set base image (host OS)
FROM python:3.8.3

# set the working directory in the container
WORKDIR /AI

# install dependencies
RUN pip install --upgrade pip

# copy the dependencies file to the working directory
COPY requirements.txt .

RUN pip install -r requirements.txt

# copy the content of the local src directory to the working directory
COPY . .

# expose port to gcloud
EXPOSE 8080

# command to run on container start
CMD [ "python3", "app.py" ]