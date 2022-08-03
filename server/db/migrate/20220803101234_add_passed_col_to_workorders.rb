class AddPassedColToWorkorders < ActiveRecord::Migration[7.0]
  def change
    add_column :workorders, :passed, :boolean, default: false
  end
end
