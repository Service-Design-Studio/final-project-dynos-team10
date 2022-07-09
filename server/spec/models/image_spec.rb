require 'rails_helper'

RSpec.describe Image, type: :model do

  it "is valid with valid attributes" do
    expect(Image.new).to be_valid
  end

  it "is not valid without a public_url" do
    image = Image.new(public_url: nil)
    expect(image).to_not be_valid
  end

  it "is not valid without a image_id" do
    image = Image.new(Image_id: nil)
    expect(image).to_not be_valid
  end

  describe "Image" do
    it { should belong_to(:component) }
  end
end

# HOW TO PUT IMAGE FILE as attribute
# describe '.find_one' do
#   context "given image id" do 
#     it 'returns the image with that image id' do
#       image = Image.create_record("1", 1)
#       expect(Image.find_one(image.id)).to eq(image)
#     end
#   end
# end

# describe '.create_record' do
#   context "given image file, component_type" do 
#     it 'creates the image with the given arguements' do
#       test_image = image.create_record("1",1)
#       expect(test_image.image_number).to eq("1")
#       expect(test_image.machine_type).to eq("machine_1")
#     end
#   end
# end


