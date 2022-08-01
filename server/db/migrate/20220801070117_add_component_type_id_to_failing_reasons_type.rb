class AddComponentTypeIdToFailingReasonsType < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :failing_reasons_types, :component_type
  end
end
