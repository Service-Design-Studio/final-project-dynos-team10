class AddWorkorderIdToComponents < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :components, :workorder
  end
end
