class AddColumnsToImages < ActiveRecord::Migration[7.0]
  def change
    add_column :images, :public_url, :string
    add_column :images, :auth_url, :string
  end
end
