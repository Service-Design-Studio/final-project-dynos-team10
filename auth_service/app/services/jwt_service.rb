class JwtService
  SECRET_KEY = Rails.application.credentials.secret_key_base.to_s

  def self.encode(user_id, exp=6.hours.from_now)
    # TODO: iss for real auth cloud run app
    iat = Time.now.to_i
    jti_raw = [SECRET_KEY, iat].join(':').to_s
    jti = Digest::SHA2.new(256).hexdigest(jti_raw)

    payload = {
      exp: exp.to_i,
      iat: iat,
      jti: jti,
      aud: [user_id.to_s]
    }
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    JWT.decode token, SECRET_KEY, true
  end
end