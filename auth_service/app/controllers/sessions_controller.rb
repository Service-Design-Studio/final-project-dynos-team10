# For logging in
class SessionsController < ApplicationController
  def create
    # user = User.find_by(username: session_params[:username])
    user = User.find_by(username: params[:username])

    if user

      if params[:authentication_method] == 1
        get_options = WebAuthn::Credential.options_for_get(allow: user.credentials.pluck(:external_id))

        # if(params[:au])

        # session[:current_authentication] = { challenge: get_options.challenge, username: session_params[:username] }

        # respond_to do |format|
        #   format.json { render json: get_options }
        # end
        render json: get_options
      else
        # puts "i am checking if the password entered is correct "
        # puts user.authenticate(params[:password])
        #checks the password. if correct returns the user record else returns false
        render json: user.authenticate(params[:password])
      end

    else
      # respond_to do |format|
      #   format.json { render json: { errors: ["Username doesn't exist"] }, status: :unprocessable_entity }
      # end
      render json: { errors: ["Username doesn't exist"] }, status: :unprocessable_entity
    end
  end

  def callback
    if params[:authentication_method]

      # webauthn_credential = WebAuthn::Credential.from_get(params)
      webauthn_credential = WebAuthn::Credential.from_get(params[:public_key_credential])

      # user = User.find_by(username: session["current_authentication"]["username"])
      user = User.find_by(username: params[:username])

      # raise "user #{session["current_authentication"]["username"]} never initiated sign up" unless user
      raise "user #{params[:username]} never initiated sign up" unless user

      credential = user.credentials.find_by(external_id: Base64.strict_encode64(webauthn_credential.raw_id))

      if credential.nil?
        render json: "Error fetching your credential", status: :unprocessable_entity
        return
      end

      begin
        webauthn_credential.verify(
          # session["current_authentication"]["challenge"],
          params[:challenge],
          public_key: credential.public_key,
          sign_count: credential.sign_count
        )

        credential.update!(sign_count: webauthn_credential.sign_count)
        # sign_in(user)
        new_jwt_token = sign_in(user)

        # render json: { status: "ok" }, status: :ok
        render json: { status: "ok", token: new_jwt_token }, status: :ok
      rescue WebAuthn::Error => e
        render json: "Verification failed: #{e.message}", status: :unprocessable_entity
      ensure
        # session.delete("current_authentication")
      end
    else
      #password login
      user = User.find_by(username: params[:username])
      raise "user #{params[:username]} never initiated sign up" unless user


    end

  end

  # def destroy
  #   sign_out
  #
  #   redirect_to root_path
  # end

  private

  def session_params
    params.require(:session).permit(:username)
  end
end