class ConvertWorkorderNumberToCitext < ActiveRecord::Migration[7.0]
  def change
    enable_extension :citext
    change_column :workorders, :workorder_number, :citext
  end
end
