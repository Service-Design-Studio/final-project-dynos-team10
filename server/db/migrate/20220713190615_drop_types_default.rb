class DropTypesDefault < ActiveRecord::Migration[7.0]
  def change
    change_column_default(:workorders, :machine_type, nil)
    change_column_default(:components, :component_type, nil)
  end
end
