class AddMachineTypeReferenceToComponentType < ActiveRecord::Migration[7.0]
  def change
    add_reference :component_types, :machine_type, column: :machine_type_id

  end
end
