require 'rails_helper'

# RSpec.describe Workorder, type: :model do
#   pending "add some examples to (or delete) #{__FILE__}"
# end

RSpec.describe Workorder, :type => :model do
  # # it "is valid with valid attributes" do
  # #   expect(Workorder.new).to be_valid
  # # end
  # it "is not valid without a workorder_number" do
  #   workorder = Workorder.new(workorder_number: nil)
  #   expect(workorder).to_not be_valid
  # end

  # #how to test uniqueness?
  # # it "is not valid without a unique workorder_number" do
  # #   workorder = Workorder.new()
  # #   expect(workorder.workorder_number).to be_unique
  # #   # OR expect(workorder).to be_unique
  # # end


  # it "is not valid without a machine_type" do
  #   workorder = Workorder.new(machine_type: nil)
  #   expect(workorder).to_not be_valid
  # end


  
  # # ***** testing of methods *********


  describe '.find_one' do
    context "given workorder id" do 
      it 'returns the workorder with that workorder_id' do
        workorder = Workorder.create_record("1", 1)
        expect(Workorder.find_one(workorder.id)).to eq(workorder)
      end
    end
  end

  describe '.create_record' do
    context "given workorder number, machine_type" do 
      it 'creates the workorder with the given arguements' do
        test_workorder = Workorder.create_record("1",1)
        expect(test_workorder.workorder_number).to eq("1")
        expect(test_workorder.machine_type).to eq("machine_1")
      end
    end
  end

  describe '.get_machine_types' do
    it 'should return all the different machine types' do
      expect(Workorder.get_machine_types).to match_array([["machine_3", 2], ["machine_1", 0], ["machine_2", 1]])
    end
  end

  describe '.find_one' do
    context "given workorder number" do 
      it 'returns the workorder with that workorder number' do
        workorder = Workorder.create_record("1", 1)
        expect(Workorder.find_one_by_workorder_number(workorder.workorder_number)).to eq(workorder)
      end
    end
  end
#doesnt work as intended
  # describe '.get_failing_reasons' do
  #   context "given workorder id" do 
  #     it 'returns the failing reasons with that workorder id' do
  #       workorder = Workorder.create_record("1",1)
  #       comp1 = Component.create_record(workorder.id,1,false)
  #       comp2 = Component.create_record(workorder.id,0,false)
  #       comp3 = Component.create_record(workorder.id,2,false)
  #       comp1.failing_reasons = ["label wrong"]
  #       comp2.failing_reasons = ["wire wrong"]
  #       comp3.failing_reasons = ["component 3 wrong"]
  #       # byebug
  #       expect(Workorder.get_failing_reasons(workorder.id)).to match_array(["label wrong", "wire wrong", "component 3 wrong"])
  #     end
  #   end
  # end

end
