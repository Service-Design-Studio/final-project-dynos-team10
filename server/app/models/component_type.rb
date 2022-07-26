class ComponentType < ApplicationRecord
  has_many :components
  has_and_belongs_to_many :machine_types
  validates :type_name, presence: true
  validates :type_name, uniqueness: true


  # def self.get_all_workorders(component_type_id)
  #   Workorder.where(component_type_id:component_type_id)
  # end

  def self.get_one_component_type_from_id(component_type_id)
    ComponentType.find_by(id:component_type_id)
  end

  def self.add_machine_type(machine_type_id,component_type_id)
    comp_type = ComponentType.find_by(id: component_type_id)
    machine_type = MachineType.find_by(id: machine_type_id)
    comp_type.machine_types << machine_type
  end

  def self.remove_machine_type(machine_type_id,component_type_id)
    comp_type = ComponentType.find_by(id: component_type_id)
    machine_type = MachineType.find_by(id: machine_type_id)
    comp_type.machine_types.delete(machine_type)
  end

  def self.get_all_machine_types_containing_component_type_from_id(component_type_id)
    comp_type = ComponentType.find_by(id: component_type_id)
    comp_type.machine_types
  end

  def self.get_all_machine_types_containing_component_type_from_type(component_type_name)
    comp_type = ComponentType.find_by(type_name: component_type_name)
    comp_type.machine_types
  end
  def self.find_one_by_component_type_name(component_type_name)
    ComponentType.find_by(type_name: component_type_name)
  end

  def self.create_record(component_type_name)
    ComponentType.create(type_name: component_type_name)
  end

  def self.get_count
    ComponentType.count
  end
  def self.get_one_component(component_type_id)
    ComponentType.find_by(id: component_type_id).components
  end

end
