class AddCompletedFieldToWorkorders < ActiveRecord::Migration[7.0]
  def change
    add_column :workorders, :completed, :boolean, :default => false
  end
end
