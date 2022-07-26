class CreateComponentTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :component_types do |t|

      t.timestamps
    end
  end
end
