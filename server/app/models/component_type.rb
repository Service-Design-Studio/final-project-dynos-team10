class ComponentType < ApplicationRecord
  has_many :components
  validates :type_name, presence: true
  validates :type_name, uniqueness: { scope: :workorder_id}

  def self.get_all_component_types_for_machine_type(machine_type_id)
    ComponentType.find_by(machine_type_id: machine_type_id)
  end

  def self.get_all_workorders(component_type_id)
    Workorder.find_by(component_type_id:component_type_id)
  end

  # def self.create_record(machine_type_id,)
end
