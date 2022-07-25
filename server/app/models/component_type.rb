class ComponentType < ApplicationRecord
  has_many :components
  has_and_belongs_to_many :machine_types
  validates :type_name, presence: true
  validates :type_name, uniqueness: { scope: :workorder_id}

  def self.get_all_component_types_for_machine_type(machine_type_id)
    ComponentType.where(machine_type_id: machine_type_id)
  end

  def self.get_all_workorders(component_type_id)
    Workorder.where(component_type_id:component_type_id)
  end

  # def self.create_record(machine_type_id,)
end
