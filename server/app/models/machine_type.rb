class MachineType < ApplicationRecord
  has_many :workorders
  has_and_belongs_to_many  :component_types
  validates :type_name, presence: true
  validates :type_name, uniqueness: true


  # def self.get_all_machine_types_for_component_type(component_type_id)
  #   MachineType.find_by(component_type_id: component_type_id)
  # end

  def self.add_component_type(machine_type_id,component_type_id)
    comp_type = ComponentType.find_by(id: component_type_id)
    machine_type = MachineType.find_by(id: machine_type_id)
    machine_type.component_types << comp_type
  end

  def self.get_all_component_types_for_machine_type_from_id(machine_type_id)
    machine_type = MachineType.find_by(id: machine_type_id)
    machine_type.component_types
  end

  def self.get_all_component_types_for_machine_type_from_type(machine_type_name)
    machine_type = MachineType.find_by(type_name: machine_type_name)
    machine_type.component_types
  end

  def self.find_one_by_machine_type_name(machine_type_name)
    MachineType.find_by(type_name: machine_type_name)
  end

  def self.create_record(machine_type_name)
    MachineType.create(type_name: machine_type_name)
  end

  def self.find_one(machine_type_id)
    MachineType.find_by(id: machine_type_id)
  end

  def self.get_count
    MachineType.count
  end

  def self.get_one_work_order(machine_type_id)
    MachineType.find_by(id: machine_type_id).workorders
  end
end
