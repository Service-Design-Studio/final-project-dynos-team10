class AddSignCountToCredentials < ActiveRecord::Migration[6.1]
  def change
    add_column :credentials, :sign_count, :bigint, null: false, default: 0
  end
end
