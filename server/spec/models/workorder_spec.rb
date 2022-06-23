require 'rails_helper'

# RSpec.describe Workorder, type: :model do
#   pending "add some examples to (or delete) #{__FILE__}"
# end

RSpec.describe Workorder, :type => :model do
  it "is valid with valid attributes" do
    expect(Workorder.new).to be_valid
  end
  it "is not valid without a workorder_number" do
    workorder = Workorder.new(workorder_number: nil)
    expect(workorder).to_not be_valid
  end

  #how to test uniqueness?
  it "is not valid without a unique workorder_number" do
    workorder = Workorder.new()
    expect(workorder.workorder_number).to be_unique
    # OR expect(workorder).to be_unique
  end


  it "is not valid without a machine_type" do
    workorder = Workorder.new(machine_type: nil)
    expect(workorder).to_not be_valid
  end
end
