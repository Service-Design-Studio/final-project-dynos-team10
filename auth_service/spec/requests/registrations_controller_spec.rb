require 'spec_helper'
require 'rails_helper'
RSpec.describe "RegistrationsControllers", type: :request do
  describe "GET /index" do
    pending "add some examples (or delete) #{__FILE__}"
  end

  describe "POST /create", type: :request do
    it "returns json for the new user created using username and password" do
      # r = RegistrationsController.new
      # r.params = ActionController::Parameters.new(registration: {username:"test6",password:"test6"})
      post registration_path, params: {registration: {username:"test8", password:"test8"}, authentication_method:0}

      # expected_json = {"id"=>nil, "username"=>"test7", "webauthn_id"=>"9XIrV5Lu-LaOR7oLx9tWg1mcJXr_LpifZyEMKt1-CAbrT_I2EpARBmXadzzyHjwWwse9y_PGmEaSbJ6-gHum0w", "created_at"=>nil, "updated_at"=>nil, "password_digest"=>"$2a$04$JksKKvHllun1O7l8zA4/W.VjRu6EMQbT9B/0bFQPSDa4VKvg57P7W"}
      puts JSON.parse(response.body)
      # expect(JSON.parse(response.body)).to include{expected_json}

    end
  end

  # describe "POST /callback" do
  #   it "returns json for the new user created using username and password" do
  #     # r = RegistrationsController.new
  #     # r.params = ActionController::Parameters.new(registration: {username:"test6",password:"test6"})
  #     post registration_path, params: {registration: {username:"test7",password:"test7"}}
  #     # puts JSON.parse(response.body)
  #     # post callback_registration_path, params: JSON.parse(response.body)
  #     # puts JSON.parse(response.body)
  #
  #
  #     puts JSON.parse(response.body)
  #
  #   end
  # end
end
