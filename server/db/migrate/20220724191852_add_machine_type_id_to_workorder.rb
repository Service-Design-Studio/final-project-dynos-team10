class AddMachineTypeIdToWorkorder < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :workorders, :machine_type

  end
end

