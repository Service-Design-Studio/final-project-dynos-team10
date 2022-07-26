class RemoveComponentTypeFromComponent < ActiveRecord::Migration[7.0]
  def change
    remove_column :components, :component_type, :string
  end
end
