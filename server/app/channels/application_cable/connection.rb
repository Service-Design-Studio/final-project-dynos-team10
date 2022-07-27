module ApplicationCable
  class Connection < ActionCable::Connection::Base
    JWT_SECRET = Rails.application.credentials.jwt_secret.to_s
    identified_by :current_user_id

    def connect
      self.current_user_id = find_verified_user
    end

    private
    def find_verified_user
      begin
        decoded = JWT.decode(request.params[:token], JWT_SECRET, true)
        # puts decoded[0]["aud"][0].to_i
        decoded[0]["aud"][0].to_i
      rescue
        reject_unauthorized_connection
      end
    end
  end
end
