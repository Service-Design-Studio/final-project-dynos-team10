class AddWorkorderForeignKeyToComponents < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :components, :workorders, column: :workorder_id
  end
end
