class AddComponentTypeToComponents < ActiveRecord::Migration[7.0]
  def change
    add_reference :component_types, :component
  end
end
