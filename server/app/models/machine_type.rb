class MachineType < ApplicationRecord
  has_many :workorders
  has_and_belongs_to_many  :component_types
  validates :type_name, presence: true

  # def self.get_all_machine_types_for_component_type(component_type_id)
  #   MachineType.find_by(component_type_id: component_type_id)
  # end

  def self.add_component_type(machine_type_id,component_type_id)
    comp_type = ComponentType.find_by(id: component_type_id)
    machine_type = MachineType.find_by(id: machine_type_id)
    machine_type.component_types << comp_type
  end
end
