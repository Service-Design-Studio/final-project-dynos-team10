class AddComponentTypeReferenceToMachineType < ActiveRecord::Migration[7.0]
  def change
    add_reference :machine_types, :component_type, column: :component_type_id
  end
end
