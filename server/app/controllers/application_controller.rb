class ApplicationController < ActionController::API
  def index
    render json: { data: "Welcome to the Dynostic API" }
  end
end
