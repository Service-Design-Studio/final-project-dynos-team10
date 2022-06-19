class AddComponentForeignKeyToImages < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :images, :components, column: :component_id
  end
end
