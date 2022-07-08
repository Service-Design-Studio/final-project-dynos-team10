class UsersController < ApplicationController
  before_action :verify_user

  def index
    all_users= User.find_all
    render json: success_json(all_users)
  end

  def show
    user = User.find_one params[:id]
    render json: success_json(user)
  end

  def update

  end

  def get_credentials
    credentials = User.find_one_credentials params[:id]
    render json: success_json(credentials)
  end
end
