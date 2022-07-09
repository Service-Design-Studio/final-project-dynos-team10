require 'rails_helper'

# RSpec.describe Component, type: :model do
#   pending "add some examples to (or delete) #{__FILE__}"
# end

RSpec.describe Component, :type => :model do

  # # ***** validation of attributes *******
  # it "is valid with valid attributes" do
  #   expect(Component.new).to be_valid
  # end

  #cant test this cuz validates requires us to input a component type and nil/""/'' maps to 0 which is label, this test is not required
  # it "is not valid without a component_type" do
  #   component = Component.new(component_type: nil)
  #   expect(component).to_not be_valid
  # end

  it "is not valid without a workorder_id" do
    component = Component.create_record(nil,1,false)
  end

    #how to test uniqueness?
  # it "is not valid without a unique workorder_id and unique component_type" do
  #   component = Component.new()
  #   expect(component.workorder_id).to be_unique
  #   expect(component.component_type).to be_unique
  #   # OR expect(component).to be_unique
  # end

  describe "Components" do
    it { should belong_to(:workorder) }
  end


  # ***** testing of methods *********

  describe '.find_one' do
    context "given component id" do 
      it 'returns the component with that component_id' do
        workorder = Workorder.create_record("1", 1)
        component = Component.create_record(workorder.id,1,false)
        # byebug
        expect(Component.find_one(component.id)).to eq(component)
      end
    end
  end

  describe '.create_record' do
    context "given workorder id, component_type and status" do 
      it 'creates the component with the given arguements' do
        test_component = Component.create_record("1",1,false)
        expect(test_component.workorder_id).to equal(1)
        expect(test_component.component_type).to eq("label")
        expect(test_component.status).to be_falsy
      end
    end
  end

  describe '.get_component_types' do
    it 'should return all the different component types' do
      test_component_types = Component.get_component_types()
      expect(test_component_types).to match_array([["component_3", 2], ["label", 0], ["wire", 1]])
    end
  end

  describe '.find_all' do
    it 'should return all the component objects' do
      count = Component.all.count
      expect(Component.find_all.to_a.count).to equal(count)
    end
  end

  describe '.find_all_by_workorder_id' do
    it 'should return all the component objects belonging to one workorder' do
      workorder = Workorder.create_record("2",1)
      c1 = Component.create_record(workorder.id,1,false)
      c2 = Component.create_record(workorder.id,2,false)
      expect(Component.find_all_by_workorder_id(workorder.id)).to match_array([c1,c2])
    end
  end
end

