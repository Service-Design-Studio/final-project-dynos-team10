require 'rails_helper'

RSpec.describe Image, type: :model do

  it "is valid with valid attributes" do
    workorder = Workorder.create_record("1",1)
    c1 = Component.create_record(workorder.id,1,false)
    image = Image.create!(:component_id => c1.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png")
    expect(image).to be_valid
  end


  describe "Image" do
    it { should belong_to(:component) }
  end


# HOW TO PUT IMAGE FILE as attribute?
describe '.find_one' do
  context "given image id" do 
    it 'returns the image with that image id' do
      workorder = Workorder.create_record("1",1)
      c1 = Component.create_record(workorder.id,1,false)
      image = Image.create!(:component_id => c1.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png")
      expect(Image.find_one(image.id)).to eq(image)
    end
  end
end

end
