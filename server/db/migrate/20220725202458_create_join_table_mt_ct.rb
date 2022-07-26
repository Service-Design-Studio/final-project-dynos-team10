class CreateJoinTableMtCt < ActiveRecord::Migration[7.0]
  def change
    create_join_table :machine_types, :component_types do |t|
      # t.index [:machine_type_id, :component_type_id]
      # t.index [:component_type_id, :machine_type_id]
    end
  end
end
