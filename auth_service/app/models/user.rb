class User < ApplicationRecord
  CREDENTIAL_MIN_AMOUNT = 1

  has_secure_password

  has_many :credentials, dependent: :destroy

  validates :username, presence: true, uniqueness: true

  after_initialize do
    self.webauthn_id ||= WebAuthn.generate_user_id
  end

  def can_delete_credentials?
    credentials.size > CREDENTIAL_MIN_AMOUNT
  end

  def self.find_all
    User.all
  end

  def self.find_one(user_id)
    User.find(user_id)
  end

  def self.find_one_credentials(user_id)
    self.find_one(user_id).credentials
  end
end