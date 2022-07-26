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
        machine_type = MachineType.create_record("m10")
        work_order = Workorder.create_record("W03",machine_type.id)
        expect(Workorder.find_one(work_order.id)).to eq(work_order)
      end
    end
  end

  describe '.create_record' do
    context "given workorder number, machine_type" do
      it 'creates the workorder with the given arguments' do
        machine_type = MachineType.create_record("m10")
        work_order = Workorder.create_record("W03",machine_type.id)
        expect(work_order.workorder_number).to eq("W03")
        expect(work_order.machine_type_id).to eq(machine_type.id)
      end
    end
  end

  describe '.find_one' do
    context "given workorder number" do
      it 'returns the workorder with that workorder number' do
        machine_type = MachineType.create_record("m10")
        work_order = Workorder.create_record("W03",machine_type.id)
        expect(Workorder.find_one_by_workorder_number(work_order.workorder_number)).to eq(work_order)
      end
    end
  end

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
