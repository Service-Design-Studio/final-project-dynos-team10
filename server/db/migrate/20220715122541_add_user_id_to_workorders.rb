class AddUserIdToWorkorders < ActiveRecord::Migration[7.0]
  def change
    add_column :workorders, :user_id, :bigint
  end
end
