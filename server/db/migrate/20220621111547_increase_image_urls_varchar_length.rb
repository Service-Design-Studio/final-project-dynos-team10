class IncreaseImageUrlsVarcharLength < ActiveRecord::Migration[7.0]
  def change
    change_column :images, :public_url, :string, :limit => 1024
    change_column :images, :auth_url, :string, :limit => 1024
  end
end
