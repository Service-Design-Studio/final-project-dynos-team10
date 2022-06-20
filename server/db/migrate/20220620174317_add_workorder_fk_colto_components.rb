class AddWorkorderFkColtoComponents < ActiveRecord::Migration[7.0]
  def change
    add_reference :components, :workorder, :foreign_key: true
  end
end
