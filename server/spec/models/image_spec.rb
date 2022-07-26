require 'rails_helper'

RSpec.describe Image, type: :model do

  it "is valid with valid attributes" do
    machine_type = MachineType.create_record("m10")
    component_type = ComponentType.create_record("zzzz")
    ComponentType.add_machine_type(machine_type.id,component_type.id)
    work_order = Workorder.create_record("W10",machine_type.id)
    component = Component.create_record(work_order.id, component_type.id, [])
    image = Image.create!(:component_id => component.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png")
    expect(image).to be_valid
  end


  describe "Image" do
    it { should belong_to(:component) }
  end


  describe '.find_one' do
    context "given image id" do
      it 'returns the image with that image id' do
        machine_type = MachineType.create_record("m10")
        component_type = ComponentType.create_record("zzzz")
        ComponentType.add_machine_type(machine_type.id,component_type.id)
        work_order = Workorder.create_record("W10",machine_type.id)
        component = Component.create_record(work_order.id, component_type.id, [])
        image = Image.create!(:component_id => component.id, :public_url => "https://storage.googleapis.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png", :auth_url => "https://storage.cloud.google.com/dynostic-test-bucket/032e11e6-d779-4882-bc01-aee951b65ac3.png")
        expect(Image.find_one(image.id)).to eq(image)
      end
    end
  end

end
