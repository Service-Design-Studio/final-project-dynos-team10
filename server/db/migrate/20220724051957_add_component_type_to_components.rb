class AddComponentTypeToComponents < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :components, :component_type
  end
end
