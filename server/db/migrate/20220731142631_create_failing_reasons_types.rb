class CreateFailingReasonsTypes < ActiveRecord::Migration[7.0]
  def change
    create_table :failing_reasons_types do |t|
      t.string :reason , null: false
      t.timestamps
    end
  end
end
