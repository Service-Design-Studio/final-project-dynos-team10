class ImagesController < ApplicationController
  def index

  end

  def create
    new_image_base64 = params[:image]
    BUCKET.create_image new_image_base64, 'sample.png'
    render json: { success: true }
  end

  def show

  end

  def update

  end

  def destroy

  end
end
