class AddComponentTypeForeignKeyToComponents < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :components, :component_types, column: :component_type_id
  end
end
