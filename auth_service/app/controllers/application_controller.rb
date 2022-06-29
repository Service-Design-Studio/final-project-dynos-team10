class ApplicationController < ActionController::API
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

  def verify_user(token)
    begin
      decoded_token = JwtService.decode token
    rescue JWT::ExpiredSignature
      render json: { expired_token: true }
    end
  end
end
