class AddComponentIdToImages < ActiveRecord::Migration[7.0]
  def change
    add_belongs_to :images, :component
  end
end
