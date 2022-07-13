class ChangeEnumsToStrings < ActiveRecord::Migration[7.0]
  def change
    change_column :workorders, :machine_type, :string
    change_column :components, :component_type, :string
  end
end
