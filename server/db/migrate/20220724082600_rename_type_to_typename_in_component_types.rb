class RenameTypeToTypenameInComponentTypes < ActiveRecord::Migration[7.0]
  def change
    rename_column :component_types, :type, :type_name

  end
end
