class ApplicationController < ActionController::API
  JWT_SECRET = Rails.application.credentials.secret_key_base.to_s

  # this method generates a success json to send back to the client
  def success_json(data)
    { success: true, result: data }
  end

  # this method generates a failure json to send back to the client
  def fail_json(**kwargs)
    { success: false, result: kwargs[:data], errors: kwargs[:errors] }
  end

  private

  def sign_in(user)
    # session[:user_id] = user.id
    JwtService.encode(user.id)
  end

  # def sign_out
  #   session[:user_id] = nil
  # end

  # TODO: remove this method and all usages in credentials controller
  def current_user
    @current_user ||=
      if session[:user_id]
        User.find_by(id: session[:user_id])
      end
  end

  # verify jwt token in authorization header
  def verify_user
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
    rescue JWT::ExpiredSignature
      render json: { token_expired: true }
    rescue JWT::DecodeError
      render json: { token_invalid: true }
    end
  end
end
