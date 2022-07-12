class AddUniqueIndexToComponentTypes < ActiveRecord::Migration[7.0]
  def change
    add_index :components, [:component_type, :workorder_id], unique: true
  end
end
