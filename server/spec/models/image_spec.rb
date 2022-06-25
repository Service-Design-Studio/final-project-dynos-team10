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


