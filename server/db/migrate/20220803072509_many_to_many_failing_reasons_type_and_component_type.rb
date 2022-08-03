class ManyToManyFailingReasonsTypeAndComponentType < ActiveRecord::Migration[7.0]
  def change
    create_join_table :component_types, :failing_reasons_types
    remove_column :failing_reasons_types, :component_type_id
  end
end
