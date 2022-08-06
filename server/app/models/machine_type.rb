class MachineType < ApplicationRecord
  has_many :workorders
  has_and_belongs_to_many  :component_types, dependent: :destroy
  validates :type_name, presence: true
  validates :type_name, uniqueness: true

  after_save do
    if ComponentType.all.empty?
      self.component_types.create([{type_name: "label"}, {type_name: "wire"}])

    else
      MachineType.update_component_types(self.id,[ComponentType.find_one_by_type_name("Label").id,ComponentType.find_one_by_type_name("Wire").id])
    end

  end

  before_save do
    self.type_name = type_name.upcase
  end

  # def self.get_all_machine_types_for_component_type(component_type_id)
  #   MachineType.find_by(component_type_id: component_type_id)
  # end

  def self.add_component_type(machine_type_id,component_type_id)
    @comp_type = ComponentType.find_by(id: component_type_id)
    @machine_type = MachineType.find_by(id: machine_type_id)
    @machine_type.component_types.push(@comp_type) unless @machine_type.component_types.include?(@comp_type)
    @comp_type.machine_types.push(@machine_type) unless @comp_type.machine_types.include?(@machine_type)
  end

  def self.remove_component_type(machine_type_id,component_type_id)
    @comp_type = ComponentType.find_by(id: component_type_id)
    @machine_type = MachineType.find_by(id: machine_type_id)
    @comp_type.machine_types.delete(@machine_type)
    @machine_type.component_types.delete(@comp_type)
  end

  def self.update_component_types(machine_type_id, component_type_ids)
    @machine_type = MachineType.find_by(id: machine_type_id)
    @machine_type.component_types.clear
    component_type_ids.each do |component_type_id|
      MachineType.add_component_type(machine_type_id,component_type_id)
    end
  end

  def self.get_all_component_types_from_id(machine_type_id)
    @machine_type = MachineType.find_by(id: machine_type_id)
    @machine_type.component_types
  end

  def self.get_all_component_types_from_type(machine_type_name)
    @machine_type = MachineType.find_by(type_name: machine_type_name.upcase)
    @machine_type.component_types
  end

  def self.find_one_by_type_name(machine_type_name)
    MachineType.find_by(type_name: machine_type_name.upcase)
  end

  def self.create_record(machine_type_name)
    MachineType.create(type_name: machine_type_name.upcase)
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
