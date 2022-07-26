require 'rails_helper'

RSpec.describe "Images", type: :request do
  # describe "GET /index" do
  #   pending "add some examples (or delete) #{__FILE__}"
  # end

  describe "DELETE /destroy" do

    it "destroys the requested image" do

      machine_type = MachineType.create_record("m10")
      component_type = ComponentType.create_record("zzzz")
      ComponentType.add_machine_type(machine_type.id,component_type.id)
      work_order = Workorder.create_record("W10",machine_type.id)
      component = Component.create_record(work_order.id, component_type.id, [])

      image = Image.create!(:component_id => component.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/3bd1ac0b-c028-4161-987e-cc16ea5fe2db.png")
      random_filename = "#{SecureRandom.uuid}.png"
      base64str = "cTNsHa4eJEUrPJnfB79P1LQJ6c2enB4uaXNLMFmfebfILug4jGoDgnAQknM29xYjio6Qsk4/TPuARyJC1wyoVQ=="
      bucket_image_file = BUCKET.create_image base64str, random_filename
      image = Image.create_record image.component_id, bucket_image_file
      expect {
        delete image_path(image), params: { id: image.id }
      }.to change(Image, :count).by(-1)
    end
  end
end
