require "json"
# registering a NEW user and credentials (on callback)
class RegistrationsController < ApplicationController
  def create

    if params[:authentication_method] == "1"
      user = User.new(username: params[:registration][:username], password: params[:registration][:password])
      puts user.attributes
      user.webauthn_id ||= WebAuthn.generate_user_id
      puts user.attributes
      # puts "i am registering an webauth"
      create_options = WebAuthn::Credential.options_for_create(
        user: {
          name: params[:registration][:username],
          id: user.webauthn_id
        }
      )

      if user.valid?
        # puts "user is valid"

        render json: {
          user_attributes: user.attributes,
          create_options: create_options
        }
      else
        # puts "user is invalid"

        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      puts "i am creating user using username password"
      user = User.create!(username: params[:registration][:username], password: params[:registration][:password], webauthn_id: WebAuthn.generate_user_id)
      if user.valid?

        puts "user is valid and i am reg pass"

        render json: {
          user_attributes: user.attributes
        }
      else
        puts "user is invalid and i am reg pass"

        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

  end

  # this callback is only for registrations with web authentication
  def callback
    # webauthn_credential = WebAuthn::Credential.from_create(params)
    webauthn_credential = WebAuthn::Credential.from_create(params[:public_key_credential])
    # user = User.create!(session["current_registration"]["user_attributes"])
    user = User.create!(user_params)

    begin
      webauthn_credential.verify(params[:challenge])

      credential = user.credentials.build(
        external_id: Base64.strict_encode64(webauthn_credential.raw_id),
        nickname: params[:credential_nickname],
        public_key: webauthn_credential.public_key,
        sign_count: webauthn_credential.sign_count
      )

      if credential.save
        render json: { status: "ok" }, status: :ok
      else
        render json: "Couldn't register your Security Key", status: :unprocessable_entity
      end
    rescue WebAuthn::Error => e
      render json: "Verification failed: #{e.message}", status: :unprocessable_entity
    ensure
      # session.delete("current_registration")
    end
  end

  private

  def user_params
    params.require(:user_attributes).permit(:username, :webauthn_id, :id, :created_at, :updated_at, :password)
  end
end