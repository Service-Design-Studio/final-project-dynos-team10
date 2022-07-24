class RemoveMachineTypeFromWorkorder < ActiveRecord::Migration[7.0]
  def change
    remove_column :workorders, :machine_type, :string
  end
end
