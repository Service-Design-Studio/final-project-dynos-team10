class MachineType < ApplicationRecord
  has_many :workorders
  validates :type_name, presence: true
  validates :type_name, uniqueness: { scope: :workorder_id}

  def self.get_all_machine_types_for_component_type(component_type_id)
    MachineType.find_by(component_type_id: component_type_id)
  end

  # def self.add_component_type_to_machine_type(component_type)
end
