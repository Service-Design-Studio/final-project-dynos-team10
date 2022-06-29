class CreateCredentials < ActiveRecord::Migration[6.1]
  def change
    create_table :credentials do |t|
      t.string :external_id, index: { unique: true }
      t.string :public_key
      t.references :user, foreign_key: true
      t.string :nickname

      t.timestamps
    end
  end
end
