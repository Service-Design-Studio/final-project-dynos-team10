class CreateMachineTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :machine_types do |t|

      t.timestamps
    end
  end
end
