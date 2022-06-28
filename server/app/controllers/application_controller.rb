class ApplicationController < ActionController::API
  def index
    render json: success_json("Welcome to the Dynostic API")
  end

  # this method generates a success json to send back to the client
  def success_json(data)
    { success: true, result: data }
  end

  # this method generates a failure json to send back to the client
  def fail_json(**kwargs)
    { success: false, result: kwargs[:data], errors: kwargs[:errors] }
  end
end
