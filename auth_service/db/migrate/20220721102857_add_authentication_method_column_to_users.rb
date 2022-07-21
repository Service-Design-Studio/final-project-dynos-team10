class AddAuthenticationMethodColumnToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :authentication_method, :boolean, null: false, default: false
  end
end
