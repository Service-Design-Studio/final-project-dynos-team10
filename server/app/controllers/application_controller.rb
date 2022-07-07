class ApplicationController < ActionController::API
  JWT_SECRET = Rails.application.credentials.jwt_secret.to_s

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

  # this route is to simply CHECK if the token is valid and nothing else.
  # this should be NOT be used as a middleware
  def verify_jwt
    # check authorization header
    if request.headers['Authorization'].present?
      token = request.headers['Authorization'].split(' ').last
    else
      render json: { token_missing: true }
      return
    end

    # begin verifying token
    begin
      decoded_token = JWT.decode(token, JWT_SECRET, true)
      render json: { token_valid: true }
    rescue JWT::ExpiredSignature
      render json: { token_expired: true }
    rescue JWT::DecodeError
      render json: { token_invalid: true }
    end
  end

  # middleware for authenticating requests with JWT tokens
  def verify_middleware
    # check authorization header
    if request.headers['Authorization'].present?
      token = request.headers['Authorization'].split(' ').last
    else
      render json: { token_missing: true }
      return
    end

    # begin verifying token
    begin
      JWT.decode(token, JWT_SECRET, true)
    rescue JWT::ExpiredSignature
      render json: { token_expired: true }
    rescue JWT::DecodeError
      render json: { token_invalid: true }
    end
  end
end
