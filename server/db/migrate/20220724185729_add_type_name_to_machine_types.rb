class AddTypeNameToMachineTypes < ActiveRecord::Migration[7.0]
  def change
    add_column :machine_types, :type_name, :string, null: false
  end
end
