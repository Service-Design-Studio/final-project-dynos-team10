class AddColumnsToWorkordersAndComponents < ActiveRecord::Migration[7.0]
  def change
    # WORKORDERS
    add_column :workorders, :workorder_number, :string
    add_column :workorders, :machine_type, :integer, default: 0

    # COMPONENTS
    add_column :components,:component_type, :integer, default: 0
    add_column :components, :status, :boolean
  end
end
