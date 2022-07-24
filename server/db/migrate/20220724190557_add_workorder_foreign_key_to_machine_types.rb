class AddWorkorderForeignKeyToMachineTypes < ActiveRecord::Migration[7.0]
  def change
    add_reference :machine_types, :workorder, column: :workorder_id
  end
end
