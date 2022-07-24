class AddWorkorderForeignKeyToComponentTypes < ActiveRecord::Migration[7.0]
  def change
    add_reference :component_types, :workorder, column: :workorder_id
  end
end
