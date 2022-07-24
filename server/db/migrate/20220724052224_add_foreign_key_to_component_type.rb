class AddForeignKeyToComponentType < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :component_types, :components
  end
end
