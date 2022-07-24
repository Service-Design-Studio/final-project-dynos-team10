class AddTypeToComponentTypes < ActiveRecord::Migration[7.0]
  def change
    add_column :component_types, :type, :string
  end
end
