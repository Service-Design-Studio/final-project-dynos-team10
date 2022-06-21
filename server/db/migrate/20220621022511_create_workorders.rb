class CreateWorkorders < ActiveRecord::Migration[7.0]
  def change
    create_table :workorders do |t|

      t.timestamps
    end
  end
end
