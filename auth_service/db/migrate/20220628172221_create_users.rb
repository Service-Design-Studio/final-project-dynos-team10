class CreateUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :users do |t|
      t.string :username, index: { unique: true }
      t.string :webauthn_id
      t.timestamps
    end
  end
end
