class CreateJoinTableComponentFailingReasonsType < ActiveRecord::Migration[7.0]
  def change
    create_join_table :components, :failing_reasons_types do |t|
      # t.index [:component_id, :failing_reasons_type_id]
      # t.index [:failing_reasons_type_id, :component_id]
    end
  end
end
