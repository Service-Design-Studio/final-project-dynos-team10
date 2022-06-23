require 'rails_helper'

# RSpec.describe Component, type: :model do
#   pending "add some examples to (or delete) #{__FILE__}"
# end

RSpec.describe Component, :type => :model do
  it "is valid with valid attributes" do
    expect(Component.new).to be_valid
  end

  it "is not valid without a component_type" do
    component = Component.new(component_type: nil)
    expect(component).to_not be_valid
  end

  it "is not valid without a workorder_id" do
    component = Component.new(workorder_id: nil)
    expect(component).to_not be_valid
  end

    #how to test uniqueness?
  it "is not valid without a unique workorder_id and unique component_type" do
    component = Component.new()
    expect(component.workorder_id).to be_unique
    expect(component.component_type).to be_unique
    # OR expect(component).to be_unique
  end

  describe "Components" do
    it { should belong_to(:workorder) }
  end

end

