require "json"
# registering a NEW user and credentials (on callback)
class RegistrationsController < ApplicationController
  def create
    user = User.new(username: params[:registration][:username], password: params[:registration][:password])

    if params[:authentication_method]
      puts "i am registering an webauth"
      create_options = WebAuthn::Credential.options_for_create(
        user: {
          name: params[:registration][:username],
          id: user.webauthn_id
        }
      )

      if user.valid?
        puts "user is valid"

        # THIS MAINTAINS SESSION STATE
        # session[:current_registration] = { challenge: create_options.challenge, user_attributes: user.attributes }
        #
        # respond_to do |format|
        #   format.json { render json: create_options }
        # end
        render json: {
          user_attributes: user.attributes,
          create_options: create_options
        }
      else
        puts "user is invalid"

        # respond_to do |format|
        #   format.json { render json: { errors: user.errors.full_messages }, status: :unprocessable_entity }
        # end
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      if user.valid?
        puts "user is valid and i am reg pass"

        # THIS MAINTAINS SESSION STATE
        puts user.attributes
        render json: {
          user_attributes: user.attributes
        }
      else
        puts "user is invalid and i am reg pass"

        # respond_to do |format|
        #   format.json { render json: { errors: user.errors.full_messages }, status: :unprocessable_entity }
        # end
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

  end

  def callback

    if params[:authentication_method]
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
    else
      #create the new user using the attributes (username and password)
      user = User.create!(user_params)
    end
  end

  private

  def user_params
    params.require(:user_attributes).permit(:username, :webauthn_id, :id, :created_at, :updated_at, :password)
  end
end