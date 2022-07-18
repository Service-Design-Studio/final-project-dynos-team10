require 'rails_helper'

RSpec.describe "Images", type: :request do
  describe "GET /index" do
    pending "add some examples (or delete) #{__FILE__}"
  end

  describe "DELETE /destroy" do

    it "destroys the requested image" do
      workorder = Workorder.create_record("1",1)
      c1 = Component.create_record(workorder.id,1,false)
      image = Image.create!(:component_id => c1.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png")
      expect {
        delete :destroy, { :component_id => c1.id, :id => image.id }
      }.to change(Image, :count).by(-1)

    end


  end


end
