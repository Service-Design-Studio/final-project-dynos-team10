require "securerandom"

class ImagesController < ApplicationController
  # TODO: Permit params
  def index

  end

  def create
    new_image_base64 = params[:image]
    random_filename = "#{SecureRandom.uuid}.png"
    bucket_image_file = BUCKET.create_image new_image_base64, random_filename
    image_record = Image.create_new_image bucket_image_file
    render json: { success: true, data: image_record }
  end

  def show
    image_id = params[:id]
    image_record = Image.find_one(image_id)
    if image_record.nil?
      render json: { success: false, data: "Error trying to find image id #{image_id}" }
    else
      render json: { success: true, data: image_record }
    end
  end

  def update

  end

  def destroy

  end
end
