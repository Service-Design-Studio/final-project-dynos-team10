require "securerandom"

class ImagesController < ApplicationController
  # resources :images, except: :update

  # TODO: Permit params
  def index
    render json: success_json(Image.find_all)
  end

  def commit_new_image(image_string, component_id)
    random_filename = "#{SecureRandom.uuid}.png"
    bucket_image_file = BUCKET.create_image image_string, random_filename
    Image.create_record component_id, bucket_image_file
  end

  def create
    new_image_base64 = params[:image]
    component_id = params[:component_id]
    image_record = commit_new_image new_image_base64, component_id
    if image_record.id.nil?
      # TODO: change http status?
      render json: fail_json(errors: image_record.errors)
      return
    end
    render json: success_json(image_record)
  end

  def show
    image_id = params[:id]
    image_record = Image.find_one(image_id)
    if image_record.nil?
      render json: fail_json(errors: "Error trying to find image id #{image_id}")
    else
      render json: success_json(image_record)
    end
  end

  def destroy
    image = Image.find(params[:id])
    BUCKET.delete_file(image.public_url)
    image.destroy
    if image.destroyed?
      render json: success_json(image)
    else
      render json: fail_json(errors: 'Could not delete image')
    end
  end

  # function to BATCH create images
  def batch_create
    new_images_base64 = params[:images]
    component_id = params[:component_id]
    image_records = []
    errors = []
    new_images_base64.each do |image_string|
      new_image_record = commit_new_image image_string, component_id
      if new_image_record.id.nil?
        errors << new_image_record.errors
      end
      image_records << new_image_record
    end

    if errors.length > 0
      render json: fail_json(data: { image_records: image_records } , errors: errors)
    else
      render json: success_json(image_records)
    end
  end

  def batch_delete
    ids = params[:ids].split(',').map(&:to_i)
    errors = []
    ids.each do |id|
      image = Image.find(id)
      BUCKET.delete_file(image.public_url)
      image.destroy
      unless image.destroyed?
        errors << image
      end
    end

    if errors.length > 0
      render json: fail_json(errors: errors)
    else
      render json: success_json(true)
    end
  end
end
